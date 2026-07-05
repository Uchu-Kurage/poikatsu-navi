# ポイ活ナビ

PayPay・楽天・dポイントからクレカ・ふるさと納税・旅行まで、いま参加できる**ポイント還元キャンペーン**を新着順のタイムラインでまとめてチェックできるキュレーションサイトです。

## 技術構成

- **Next.js 15**（App Router / TypeScript）— 全ページ静的生成(SSG)
- **キャンペーン管理**: TypeScriptデータ（`data/campaigns.ts`）
- **記事管理**: Markdown（`content/articles/*.md`）+ frontmatter
- **スタイル**: 自前CSSデザインシステム（ライト/ダークモード・レスポンシブ対応）

## ページ構成

| ルート | 内容 |
| --- | --- |
| `/` | トップ（ヒーロー・注目キャンペーン・タイムライン・記事） |
| `/campaigns/[id]` | キャンペーン詳細（還元内容・開催期間・参加条件） |
| `/articles` | 記事一覧 |
| `/articles/[slug]` | 記事詳細（Markdownレンダリング） |

## タイムラインの仕組み

- 各キャンペーンは**掲載日（`postedAt`）順**にタイムラインへ流れます。
- 開催期間（`startDate` / `endDate`）と現在日から、`開催予定` / `開催中` / `残り○日` / `受付終了` の**開催状況を自動判定**します。
- トップページでは**カテゴリ**（キャッシュレス決済・ネット通販・クレカ・旅行・ふるさと納税 など）と**開催状況**で絞り込めます。

## 開発

```bash
npm install
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run start    # 本番サーバー起動
```

## コンテンツの編集

- **キャンペーンを追加**: `data/campaigns.ts` の `campaigns` 配列に項目を追加（`provider` / `category` / `reward` / `postedAt` / `startDate` / `endDate` / `url` / `tags` / `details` などを記載）。`highlight: true` を付けると「注目のキャンペーン」に掲載されます。
- **カテゴリを追加**: `CampaignCategory` と `categoryMeta`（絵文字・カラー）を編集します。
- **記事を追加**: `content/articles/` に Markdown ファイルを追加（frontmatter に `title` / `description` / `category` / `tags` / `date` / `emoji` を記載）。

## 注意

掲載している還元率・期間・条件には**サンプル値**が含まれます。実運用時は各公式ページの最新情報を反映してください。
