// 正規化済みキャンペーンのスキーマ + 業務ルール検証。
// 不正な項目はドロップし、理由を返します（収集レポートに記録）。

import { z } from "zod";
import { categories, type Campaign, type CampaignCategory } from "../data/campaigns";

const categoryTuple = categories as [CampaignCategory, ...CampaignCategory[]];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const CampaignSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    provider: z.string().min(1),
    providerColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    category: z.enum(categoryTuple),
    reward: z.string().min(1),
    summary: z.string().min(1),
    postedAt: z.string().regex(DATE_RE),
    startDate: z.string().regex(DATE_RE, "開始日が YYYY-MM-DD 形式でない"),
    endDate: z.string().regex(DATE_RE, "終了日が YYYY-MM-DD 形式でない"),
    url: z.string().url().startsWith("https://", "URLがhttpsでない"),
    tags: z.array(z.string()),
    details: z.array(z.string()),
    source: z.literal("auto").optional(),
  })
  .refine((c) => Date.parse(c.endDate) >= Date.parse(c.startDate), {
    message: "終了日が開始日より前",
    path: ["endDate"],
  });

export type Dropped = { id: string; title: string; reason: string };

export function validate(candidates: Campaign[]): { valid: Campaign[]; dropped: Dropped[] } {
  const valid: Campaign[] = [];
  const dropped: Dropped[] = [];

  for (const c of candidates) {
    const result = CampaignSchema.safeParse(c);
    if (result.success) {
      valid.push(result.data as Campaign);
    } else {
      const reason = result.error.issues
        .map((i) => `${i.path.join(".") || "-"}: ${i.message}`)
        .join(" / ");
      dropped.push({ id: c.id, title: c.title, reason });
    }
  }

  return { valid, dropped };
}
