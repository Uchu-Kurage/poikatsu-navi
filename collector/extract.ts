// Claude API による構造化抽出。
// RawCampaignItem（RSS等の生テキスト）から Campaign 型のフィールドを抽出します。
// - category は既存の8カテゴリに制約（structured outputs）
// - 日付は YYYY-MM-DD
// - キャンペーンでない記事・情報不足のものは isCampaign=false で除外

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { categories, type CampaignCategory } from "../data/campaigns";
import type { RawCampaignItem } from "./sources/types";

// 抽出モデル。既定は claude-opus-4-8。大量処理でコストを抑えたい場合は
// COLLECTOR_MODEL=claude-haiku-4-5 などに切り替え可能。
const MODEL = process.env.COLLECTOR_MODEL || "claude-opus-4-8";

const categoryTuple = categories as [CampaignCategory, ...CampaignCategory[]];

const ExtractionSchema = z.object({
  isCampaign: z
    .boolean()
    .describe("ポイント還元キャンペーンの告知ならtrue。単なるニュース・コラム・情報不足ならfalse"),
  title: z.string().describe("キャンペーンのタイトル（簡潔に）"),
  provider: z.string().describe("提供元サービス名（例: PayPay、楽天ポイント、dポイント）"),
  category: z.enum(categoryTuple).describe("最も適切なカテゴリを1つ"),
  reward: z.string().describe("還元の目立つ表記（例: 最大20%還元 / 10,000pt）"),
  summary: z.string().describe("概要を1〜2文で"),
  startDate: z.string().describe("開始日 YYYY-MM-DD。不明なら空文字"),
  endDate: z.string().describe("終了日 YYYY-MM-DD。不明なら空文字"),
  tags: z.array(z.string()).describe("関連タグ（2〜4個）"),
  details: z.array(z.string()).describe("参加条件・注意点（2〜4個）"),
});

export type ExtractedCampaign = z.infer<typeof ExtractionSchema> & {
  sourceUrl: string;
  sourceId: string;
  publishedAt?: string;
};

function buildPrompt(item: RawCampaignItem, today: string): string {
  return [
    `今日の日付（JST）: ${today}`,
    "以下はポイ活系フィードから取得した記事です。ポイント還元キャンペーンの告知であれば、指定スキーマに従って情報を構造化してください。",
    "相対的な日付表現（「今月末まで」等）は今日の日付を基準に YYYY-MM-DD へ変換してください。判断できない日付は空文字にします。",
    "キャンペーンの告知でない場合、または還元内容が読み取れない場合は isCampaign を false にしてください。",
    "",
    `タイトル: ${item.title}`,
    `本文: ${item.description}`,
    item.publishedAt ? `公開日: ${item.publishedAt}` : "",
    `URL: ${item.link}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function extractCampaigns(
  items: RawCampaignItem[],
  opts: { onDrop?: (item: RawCampaignItem, reason: string) => void } = {}
): Promise<ExtractedCampaign[]> {
  const client = new Anthropic(); // ANTHROPIC_API_KEY を環境から解決
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" }); // YYYY-MM-DD
  const results: ExtractedCampaign[] = [];

  for (const item of items) {
    try {
      const res = await client.messages.parse({
        model: MODEL,
        max_tokens: 1024,
        messages: [{ role: "user", content: buildPrompt(item, today) }],
        output_config: { format: zodOutputFormat(ExtractionSchema) },
      });

      const parsed = res.parsed_output;
      if (!parsed) {
        opts.onDrop?.(item, `抽出失敗（stop_reason: ${res.stop_reason ?? "unknown"}）`);
        continue;
      }
      if (!parsed.isCampaign) {
        opts.onDrop?.(item, "キャンペーン告知ではないと判定");
        continue;
      }

      results.push({
        ...parsed,
        sourceUrl: item.link,
        sourceId: item.sourceId,
        publishedAt: item.publishedAt,
      });
    } catch (err) {
      opts.onDrop?.(item, `抽出エラー: ${(err as Error).message}`);
    }
  }

  return results;
}
