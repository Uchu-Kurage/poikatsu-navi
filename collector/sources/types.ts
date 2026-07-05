// 収集ソースアダプタの共通インターフェース。
// 新しいソース（公式API・スクレイピング等）を追加する場合は SourceAdapter を実装し、
// collector/sources/index.ts のレジストリに登録するだけで組み込めます。

// 収集ソースから取得した「キャンペーン候補」の生データ。
// この段階では構造化されておらず、extract.ts が Campaign 型のフィールドへ変換します。
export type RawCampaignItem = {
  sourceId: string; // 取得元アダプタのID
  title: string;
  link: string; // 情報元URL
  description: string; // 概要・本文抜粋
  publishedAt?: string; // 公開日時（ISO or YYYY-MM-DD）。並び順・postedAtの参考
  rawText: string; // 抽出に渡す生テキスト（title + description をまとめたもの）
};

export interface SourceAdapter {
  id: string;
  // 候補アイテムを取得。失敗しても他ソースへ影響しないよう、実装側で握りつぶさず throw してよい
  // （run.ts がソース単位で try/catch する）。
  fetch(): Promise<RawCampaignItem[]>;
}
