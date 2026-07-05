// 汎用RSS/Atomフィードアダプタ。
// RSS 2.0（channel > item）と Atom（feed > entry）の両方を最小限パースします。

import { XMLParser } from "fast-xml-parser";
import type { FeedConfig } from "../sources.config";
import type { RawCampaignItem, SourceAdapter } from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
});

// HTMLタグ・エンティティを軽く除去してプレーンテキスト化
function stripHtml(input: unknown): string {
  if (input == null) return "";
  const s = String(input);
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function toArray<T>(v: T | T[] | undefined): T[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

// Atomのlinkは文字列 or {@_href} or 配列
function atomLink(link: unknown): string {
  const links = toArray(link as any);
  for (const l of links) {
    if (typeof l === "string") return l;
    if (l && typeof l === "object") {
      const rel = l["@_rel"];
      if (!rel || rel === "alternate") return String(l["@_href"] ?? "");
    }
  }
  return "";
}

function normalizeDate(v: unknown): string | undefined {
  if (!v) return undefined;
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function createRssAdapter(feed: FeedConfig): SourceAdapter {
  return {
    id: feed.id,
    async fetch(): Promise<RawCampaignItem[]> {
      const res = await fetch(feed.url, {
        headers: { "user-agent": "poikatsu-navi-collector/1.0 (+https://github.com/)" },
      });
      if (!res.ok) {
        throw new Error(`feed ${feed.id}: HTTP ${res.status} ${res.statusText}`);
      }
      const xml = await res.text();
      const doc = parser.parse(xml);

      const rssItems = toArray(doc?.rss?.channel?.item);
      const atomEntries = toArray(doc?.feed?.entry);

      const items: RawCampaignItem[] = [];

      for (const it of rssItems) {
        const title = stripHtml(it.title);
        const link = String(it.link ?? "").trim();
        const description = stripHtml(it.description ?? it["content:encoded"]);
        if (!title && !description) continue;
        items.push({
          sourceId: feed.id,
          title,
          link,
          description,
          publishedAt: normalizeDate(it.pubDate ?? it["dc:date"]),
          rawText: [title, description].filter(Boolean).join("\n"),
        });
      }

      for (const en of atomEntries) {
        const title = stripHtml(en.title);
        const link = atomLink(en.link);
        const description = stripHtml(en.summary ?? en.content);
        if (!title && !description) continue;
        items.push({
          sourceId: feed.id,
          title,
          link,
          description,
          publishedAt: normalizeDate(en.updated ?? en.published),
          rawText: [title, description].filter(Boolean).join("\n"),
        });
      }

      return items;
    },
  };
}
