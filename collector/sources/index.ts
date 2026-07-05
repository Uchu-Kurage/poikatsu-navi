// 有効なソースアダプタのレジストリ。
// フェーズ2で公式APIアダプタ（例: 楽天アフィリエイトAPI）を追加する場合も、
// SourceAdapter を実装してここで push すれば組み込めます。

import { feeds as configuredFeeds, type FeedConfig } from "../sources.config";
import { createRssAdapter } from "./rss";
import type { SourceAdapter } from "./types";

export function getSources(): SourceAdapter[] {
  const feeds: FeedConfig[] = [...configuredFeeds];

  // 環境変数 COLLECTOR_FEEDS（カンマ区切りURL）で追加フィードを指定可能（ローカル検証用）。
  const envFeeds = process.env.COLLECTOR_FEEDS;
  if (envFeeds) {
    envFeeds
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean)
      .forEach((url, i) => feeds.push({ id: `env-feed-${i + 1}`, url }));
  }

  return feeds.map(createRssAdapter);
}
