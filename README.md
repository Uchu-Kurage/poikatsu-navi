# ポイ活ナビ

ポイントサイトの還元率比較・ランキングと、ポイ活のお役立ち記事をまとめたキュレーションサイトです。

## 技術構成

- **Next.js 15**（App Router / TypeScript）— 全ページ静的生成(SSG)
- **コンテンツ管理**: Markdown（`content/articles/*.md`）+ frontmatter
- **スタイル**: 自前CSSデザインシステム（ライト/ダークモード・レスポンシブ対応）

## ページ構成

| ルート | 内容 |
| --- | --- |
| `/` | トップ（ヒーロー・ランキングTOP3・比較表・新着記事） |
| `/ranking` | ポイントサイト還元率ランキング・詳細比較表 |
| `/articles` | 記事一覧 |
| `/articles/[slug]` | 記事詳細（Markdownレンダリング） |

## 開発

```bash
npm install
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run start    # 本番サーバー起動
```

## コンテンツの編集

- **記事を追加**: `content/articles/` に Markdown ファイルを追加（frontmatter に `title` / `description` / `category` / `tags` / `date` / `emoji` を記載）
- **比較データを編集**: `data/sites.ts` のサイト情報・評価を編集すると比較表・ランキングに反映されます

## 注意

掲載している還元率・レート・特典には**サンプル値**が含まれます。実運用時は各公式サイトの最新情報を反映してください。
