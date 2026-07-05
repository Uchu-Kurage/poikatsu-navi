// 収集オーケストレータ。
// 収集 → 抽出（Claude API）→ 正規化 → 検証 → data/campaigns.generated.json 書き出し
// → collector/last-run-report.md にレポート出力。
//
// 実行: npm run collect （要 ANTHROPIC_API_KEY）
// 追加フィード: COLLECTOR_FEEDS=<url1>,<url2> / モデル: COLLECTOR_MODEL

import fs from "fs";
import path from "path";
import type { Campaign } from "../data/campaigns";
import { extractCampaigns } from "./extract";
import { normalize } from "./normalize";
import { getSources } from "./sources/index";
import type { RawCampaignItem } from "./sources/types";
import { validate, type Dropped } from "./validate";

const GENERATED_PATH = path.join(process.cwd(), "data", "campaigns.generated.json");
const REPORT_PATH = path.join(process.cwd(), "collector", "last-run-report.md");

// 収集上限（コスト保護）
const MAX_ITEMS = Number(process.env.COLLECTOR_MAX_ITEMS || "50");
// 終了からこの日数を過ぎた自動収集分は掃除する
const PRUNE_ENDED_AFTER_DAYS = Number(process.env.COLLECTOR_PRUNE_DAYS || "60");

function todayJst(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

function readExisting(): Campaign[] {
  try {
    const raw = fs.readFileSync(GENERATED_PATH, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as Campaign[]) : [];
  } catch {
    return [];
  }
}

function sortCampaigns(list: Campaign[]): Campaign[] {
  return [...list].sort((a, b) => {
    if (a.postedAt !== b.postedAt) return a.postedAt < b.postedAt ? 1 : -1;
    return Date.parse(a.endDate) - Date.parse(b.endDate);
  });
}

async function main() {
  const today = todayJst();
  const sources = getSources();

  const fetchErrors: string[] = [];
  const drops: Dropped[] = [];
  const rawItems: RawCampaignItem[] = [];

  // 1. 収集（ソース単位で失敗を隔離）
  for (const source of sources) {
    try {
      const items = await source.fetch();
      rawItems.push(...items);
    } catch (err) {
      fetchErrors.push(`${source.id}: ${(err as Error).message}`);
    }
  }

  const limited = rawItems.slice(0, MAX_ITEMS);

  // 2. 抽出（Claude API）。ソース未設定/候補ゼロ時はAPIを呼ばない
  const extracted =
    limited.length > 0
      ? await extractCampaigns(limited, {
          onDrop: (item, reason) => drops.push({ id: item.link, title: item.title, reason }),
        })
      : [];

  // 3. 正規化
  const normalized = normalize(extracted, today);

  // 4. 検証
  const { valid, dropped } = validate(normalized);
  drops.push(...dropped);

  // 5. 既存分とマージ（id一致は新データで更新）＋ 期限切れの掃除
  const existing = readExisting();
  const existingIds = new Set(existing.map((c) => c.id));
  const byId = new Map<string, Campaign>();
  for (const c of existing) byId.set(c.id, c);

  let added = 0;
  let updated = 0;
  for (const c of valid) {
    if (existingIds.has(c.id)) updated++;
    else added++;
    byId.set(c.id, c);
  }

  const pruneBefore = Date.parse(today) - PRUNE_ENDED_AFTER_DAYS * 24 * 60 * 60 * 1000;
  let pruned = 0;
  for (const [id, c] of byId) {
    const end = Date.parse(c.endDate);
    if (!Number.isNaN(end) && end < pruneBefore) {
      byId.delete(id);
      pruned++;
    }
  }

  const merged = sortCampaigns(Array.from(byId.values()));

  // 6. 書き出し
  fs.writeFileSync(GENERATED_PATH, JSON.stringify(merged, null, 2) + "\n", "utf8");

  const report = buildReport({
    today,
    sourceCount: sources.length,
    fetched: rawItems.length,
    considered: limited.length,
    extracted: extracted.length,
    added,
    updated,
    pruned,
    total: merged.length,
    fetchErrors,
    drops,
  });
  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log(report);
}

function buildReport(s: {
  today: string;
  sourceCount: number;
  fetched: number;
  considered: number;
  extracted: number;
  added: number;
  updated: number;
  pruned: number;
  total: number;
  fetchErrors: string[];
  drops: Dropped[];
}): string {
  const lines: string[] = [];
  lines.push(`# キャンペーン自動収集レポート ${s.today}`);
  lines.push("");
  lines.push("| 項目 | 件数 |");
  lines.push("| --- | ---: |");
  lines.push(`| ソース数 | ${s.sourceCount} |`);
  lines.push(`| 取得アイテム | ${s.fetched} |`);
  lines.push(`| 抽出対象（上限適用後） | ${s.considered} |`);
  lines.push(`| キャンペーンと判定 | ${s.extracted} |`);
  lines.push(`| 新規追加 | ${s.added} |`);
  lines.push(`| 更新 | ${s.updated} |`);
  lines.push(`| 期限切れ掃除 | ${s.pruned} |`);
  lines.push(`| 掲載合計（自動収集分） | ${s.total} |`);
  lines.push("");

  if (s.sourceCount === 0) {
    lines.push("> ⚠️ 収集ソースが未設定です。`collector/sources.config.ts` にフィードを追加してください。");
    lines.push("");
  }

  if (s.fetchErrors.length > 0) {
    lines.push("## 取得エラー");
    for (const e of s.fetchErrors) lines.push(`- ${e}`);
    lines.push("");
  }

  if (s.drops.length > 0) {
    lines.push(`## 除外 (${s.drops.length}件)`);
    for (const d of s.drops.slice(0, 50)) {
      lines.push(`- ${d.title || d.id} — ${d.reason}`);
    }
    if (s.drops.length > 50) lines.push(`- …ほか ${s.drops.length - 50}件`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(
    "還元率・期間・条件は誤りを含む可能性があります。**必ず内容を確認してからマージ**してください。"
  );
  lines.push("");
  return lines.join("\n");
}

main().catch((err) => {
  console.error("収集に失敗しました:", err);
  process.exit(1);
});
