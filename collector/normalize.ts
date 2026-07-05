// 抽出結果を Campaign 型へ正規化。
// - id採番（provider slug + タイトルhash + 終了年月）
// - providerColor をプロバイダ→カラーのマップで補完
// - postedAt を収集日（JST）に設定
// - バッチ内の重複（同一URL / 同一id）を排除

import type { Campaign } from "../data/campaigns";
import type { ExtractedCampaign } from "./extract";

// 既存の手動データから抽出したプロバイダ→ブランドカラーの初期マップ。
// 未知のプロバイダは既定色を使用。
const providerRegistry: Record<string, { slug: string; color: string }> = {
  PayPay: { slug: "paypay", color: "#ff0033" },
  楽天ポイント: { slug: "rakuten", color: "#bf0000" },
  dポイント: { slug: "dpoint", color: "#cc0033" },
  "au PAY": { slug: "aupay", color: "#eb5505" },
  Amazon: { slug: "amazon", color: "#ff9900" },
  Vポイント: { slug: "vpoint", color: "#0068b7" },
  "JRE POINT": { slug: "jre-point", color: "#00ac9a" },
  さとふる: { slug: "satofull", color: "#f5a623" },
  メルカリ: { slug: "merpay", color: "#ff0211" },
  Ponta: { slug: "ponta", color: "#0a4c9a" },
  LINEポイント: { slug: "line-point", color: "#06c755" },
  エポスポイント: { slug: "epos", color: "#003e92" },
  ANAマイル: { slug: "ana", color: "#13448f" },
  "WAON POINT": { slug: "waon", color: "#e60012" },
  majica: { slug: "majica", color: "#ffcc00" },
};

const DEFAULT_COLOR = "#64748b";

function shortHash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return (h >>> 0).toString(36).slice(0, 6);
}

function yearMonth(dateStr: string, fallback: string): string {
  const s = /^\d{4}-\d{2}/.test(dateStr) ? dateStr : fallback;
  return s.slice(0, 7).replace("-", ""); // "2026-07" -> "202607"
}

export function normalize(extracted: ExtractedCampaign[], today: string): Campaign[] {
  const seenUrl = new Set<string>();
  const seenId = new Set<string>();
  const out: Campaign[] = [];

  for (const e of extracted) {
    if (e.sourceUrl && seenUrl.has(e.sourceUrl)) continue;
    if (e.sourceUrl) seenUrl.add(e.sourceUrl);

    const reg = providerRegistry[e.provider];
    const slug = reg?.slug ?? "campaign";
    const color = reg?.color ?? DEFAULT_COLOR;
    const ym = yearMonth(e.endDate, today);
    const id = `${slug}-${shortHash(e.title + e.sourceUrl)}-${ym}`;

    if (seenId.has(id)) continue;
    seenId.add(id);

    out.push({
      id,
      title: e.title,
      provider: e.provider,
      providerColor: color,
      category: e.category,
      reward: e.reward,
      summary: e.summary,
      postedAt: today,
      startDate: e.startDate,
      endDate: e.endDate,
      url: e.sourceUrl,
      tags: e.tags,
      details: e.details,
      source: "auto",
    });
  }

  return out;
}
