# キャンペーン自動収集 (collector)

ポイント還元キャンペーン情報を定期的に自動収集し、`data/campaigns.generated.json` を更新するパイプラインです。GitHub Actions の cron で実行され、差分があれば **PR を起票**します。還元率・期間などは誤情報リスクがあるため、**人がレビューしてマージ**する運用です（自動マージしません）。

## パイプライン

```
収集(RSS/API) → 抽出(Claude API) → 正規化 → 検証(zod) → data/campaigns.generated.json → PR
```

| ファイル | 役割 |
| --- | --- |
| `sources/types.ts` | `SourceAdapter` インターフェース定義 |
| `sources/rss.ts` | 汎用 RSS/Atom アダプタ |
| `sources/index.ts` | 有効アダプタのレジストリ |
| `sources.config.ts` | 収集対象フィードURL |
| `extract.ts` | Claude API による構造化抽出（`Campaign`型へ） |
| `normalize.ts` | id採番・カラー補完・重複排除 |
| `validate.ts` | スキーマ + 業務ルール検証 |
| `run.ts` | オーケストレータ（レポート出力含む） |

## ローカル実行

```bash
export ANTHROPIC_API_KEY=sk-ant-...
# フィードを一時指定して実行（sources.config.ts に恒久登録も可）
COLLECTOR_FEEDS="https://example.com/feed" npm run collect
```

出力: `data/campaigns.generated.json`（更新）、`collector/last-run-report.md`（レポート）。

## 環境変数

| 変数 | 既定 | 説明 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | （必須） | Claude API キー |
| `COLLECTOR_MODEL` | `claude-opus-4-8` | 抽出モデル（コスト重視なら `claude-haiku-4-5`） |
| `COLLECTOR_FEEDS` | — | 追加フィードURL（カンマ区切り） |
| `COLLECTOR_MAX_ITEMS` | `50` | 1回の抽出上限（コスト保護） |
| `COLLECTOR_PRUNE_DAYS` | `60` | 終了からこの日数を過ぎた自動収集分を掃除 |

## ソースを追加する

1. **RSS**: `sources.config.ts` の `feeds` にURLを追加。
2. **公式API等**: `SourceAdapter` を実装し `sources/index.ts` で登録。

収集元の利用規約・robots・レート制限を尊重してください（RSS優先・過度なスクレイピング回避）。
