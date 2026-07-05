// ポイント還元キャンペーン情報のタイムライン用データ
//
// キャンペーンは2系統からマージされます:
//   - data/campaigns.manual.ts     … 手動キュレーション（編集はこちら）
//   - data/campaigns.generated.json … バックエンドで自動収集（collector/ が生成、PRレビュー後にマージ）
// idが重複した場合は手動分を優先します。
// ※還元率・期間・条件にはサンプル値が含まれます。実運用時は各公式サイトの最新情報を反映してください。

import { manualCampaigns } from "./campaigns.manual";
import generatedData from "./campaigns.generated.json";

export type CampaignCategory =
  | "キャッシュレス決済"
  | "ネット通販"
  | "クレジットカード"
  | "旅行・交通"
  | "コンビニ・スーパー"
  | "ふるさと納税"
  | "投資・金融"
  | "アプリ・エンタメ";

export type Campaign = {
  id: string;
  title: string;
  provider: string; // 提供元サービス（PayPay、楽天ポイント など）
  providerColor: string; // 提供元のブランドカラー
  category: CampaignCategory;
  reward: string; // 目立たせる還元表記（例: 最大20%還元 / 10,000pt）
  summary: string; // 概要
  postedAt: string; // タイムライン掲載日 YYYY-MM-DD（並び順の基準）
  startDate: string; // キャンペーン開始日 YYYY-MM-DD
  endDate: string; // キャンペーン終了日 YYYY-MM-DD
  url: string; // 情報元・公式ページ
  tags: string[];
  highlight?: boolean; // 注目キャンペーン
  details: string[]; // 参加条件・注意点
  source?: "manual" | "auto"; // データの出所（自動収集分の識別用）
};

export const categoryMeta: Record<CampaignCategory, { emoji: string; color: string }> = {
  キャッシュレス決済: { emoji: "📱", color: "#ef4444" },
  ネット通販: { emoji: "🛒", color: "#f97316" },
  クレジットカード: { emoji: "💳", color: "#6366f1" },
  "旅行・交通": { emoji: "✈️", color: "#0ea5e9" },
  "コンビニ・スーパー": { emoji: "🏪", color: "#22c55e" },
  ふるさと納税: { emoji: "🎁", color: "#e11d48" },
  "投資・金融": { emoji: "📈", color: "#14b8a6" },
  "アプリ・エンタメ": { emoji: "🎮", color: "#a855f7" },
};

export const categories = Object.keys(categoryMeta) as CampaignCategory[];

// 自動収集分（JSON）に source を付与
const generatedCampaigns: Campaign[] = (generatedData as Campaign[]).map((c) => ({
  source: "auto",
  ...c,
}));

// 手動分と自動収集分をマージ（id重複時は手動分を優先）
function mergeCampaigns(manual: Campaign[], generated: Campaign[]): Campaign[] {
  const byId = new Map<string, Campaign>();
  for (const c of generated) byId.set(c.id, c);
  for (const c of manual) byId.set(c.id, { source: "manual", ...c }); // 手動分で上書き
  return Array.from(byId.values());
}

export const campaigns: Campaign[] = mergeCampaigns(manualCampaigns, generatedCampaigns);

// 日付文字列（YYYY-MM-DD）を数値に変換して比較
function dayNumber(dateStr: string): number {
  return Date.parse(`${dateStr}T00:00:00+09:00`);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type CampaignStatusKey = "upcoming" | "active" | "soon" | "ended";

export type CampaignStatus = {
  key: CampaignStatusKey;
  label: string;
  daysLeft: number | null; // 終了までの残り日数（終了済みはnull）
};

// 今日を基準にキャンペーンの開催状況を判定
export function campaignStatus(c: Campaign, today: Date = new Date()): CampaignStatus {
  const todayNum = dayNumber(today.toISOString().slice(0, 10));
  const start = dayNumber(c.startDate);
  const end = dayNumber(c.endDate);

  if (todayNum < start) {
    const days = Math.ceil((start - todayNum) / MS_PER_DAY);
    return { key: "upcoming", label: "開催予定", daysLeft: days };
  }
  if (todayNum > end) {
    return { key: "ended", label: "受付終了", daysLeft: null };
  }
  const daysLeft = Math.round((end - todayNum) / MS_PER_DAY);
  if (daysLeft <= 3) {
    return { key: "soon", label: daysLeft <= 0 ? "本日まで" : `残り${daysLeft}日`, daysLeft };
  }
  return { key: "active", label: "開催中", daysLeft };
}

// タイムライン順（掲載日の新しい順、同日はキャンペーン終了が近い順）にソート
export function sortedCampaigns(list: Campaign[] = campaigns): Campaign[] {
  return [...list].sort((a, b) => {
    if (a.postedAt !== b.postedAt) return a.postedAt < b.postedAt ? 1 : -1;
    return dayNumber(a.endDate) - dayNumber(b.endDate);
  });
}

export function featuredCampaigns(): Campaign[] {
  return sortedCampaigns(campaigns.filter((c) => c.highlight));
}

export function getCampaign(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}

// 掲載日ごとにグループ化（タイムライン表示用）
export function groupByPostedDate(
  list: Campaign[]
): { date: string; items: Campaign[] }[] {
  const map = new Map<string, Campaign[]>();
  for (const c of list) {
    const arr = map.get(c.postedAt) ?? [];
    arr.push(c);
    map.set(c.postedAt, arr);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, items]) => ({ date, items }));
}

// 「2026-07-04」→「7月4日(土)」表記
const WD = ["日", "月", "火", "水", "木", "金", "土"];
export function formatPostedDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00+09:00`);
  return `${d.getMonth() + 1}月${d.getDate()}日(${WD[d.getDay()]})`;
}

export function formatPeriod(c: Campaign): string {
  const f = (s: string) => {
    const d = new Date(`${s}T00:00:00+09:00`);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };
  return c.startDate === c.endDate ? f(c.startDate) : `${f(c.startDate)} 〜 ${f(c.endDate)}`;
}
