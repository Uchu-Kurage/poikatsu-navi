// 収集対象フィードの設定。
// ここにポイ活系メディアや各社公式「お知らせ」RSS のURLを列挙します。
// ※実運用URLは各サイトの利用規約・robots・配信ポリシーを確認のうえ追加してください。
//   RSS/Atom を優先し、過度なスクレイピングは避けます。

export type FeedConfig = {
  id: string; // アダプタ識別子（レポート等に表示）
  url: string; // RSS/Atom フィードURL
  defaultProvider?: string; // 抽出でプロバイダが取れない場合の既定値（任意）
};

// MVP用の初期フィード。実際のフィードに差し替え・追加してください。
// 環境変数 COLLECTOR_FEEDS（カンマ区切りURL）でも上書き・追加できます（sources/index.ts 参照）。
export const feeds: FeedConfig[] = [
  // 例:
  // { id: "poikatsu-news", url: "https://example.com/poikatsu/feed" },
  // { id: "rakuten-info",  url: "https://example.com/rakuten/rss", defaultProvider: "楽天ポイント" },
];
