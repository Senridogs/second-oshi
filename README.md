# セカンド推し診断 〜次に推す国、見つけよう〜

日本代表と一緒に大会を去りかけているライト層に、10問の診断で「第二の祖国」への入国ビザを発行するWebアプリ。
結果カード（ビザ/搭乗券の意匠）をXでシェアさせることが唯一のKPI。

- `/` … 診断SPA（1問1画面、パスポートのスタンプ枠が埋まる進捗表現、回答はセッション内stateのみ）
- `/r/[teamId]` … 結果パーマリンク。ビザカード + 「自分も診断する」CTA。OGP画像はビルド時に15カ国ぶん生成（next/og）

**完全静的サイト**（`output: "export"`）。S3 + CloudFront での静的ホスティングを想定（Vercelでも静的サイトとしてそのまま動く）。

## 開発コマンド

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 静的エクスポート（out/ に出力）
npx serve out  # ビルド成果物のローカル確認
npm run lint

# R軸(因縁・ブラジル専用)の挙動検証
node scripts/verify-r-axis.mjs
```

## 環境変数

静的エクスポートのため、`NEXT_PUBLIC_*` は **ビルド時に成果物へ焼き込まれる**。本番ビルドでは必ずビルドコマンド実行時に設定すること（デプロイ後に変更はできない。変更するには再ビルドが必要）。

| 変数 | 説明 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 本番URL（例: `https://second-oshi.example.com`）。シェアURLの絶対URL化と `metadataBase`（og:imageの絶対URL）に使用。**本番ビルドでは必須**。未設定時はブラウザの `window.location.origin` にフォールバックするため開発中は無くても動くが、静的HTML内の og:image 絶対URLはビルド時に確定するため本番では必ず設定する（VERCEL_URLフォールバックも残してあるがVercelビルド時のみ有効）。 |
| `NEXT_PUBLIC_GA_ID` | GA4 測定ID（例: `G-XXXXXXXXXX`）。設定時のみ gtag スクリプトを読み込む。未設定なら計測コードは一切出力されない（no-op）。計測したい本番ビルドでは設定すること。 |

## デプロイ（S3 + CloudFront）

```bash
# 1. ビルド（環境変数はビルド時に焼き込まれる）
NEXT_PUBLIC_SITE_URL=https://second-oshi.example.com \
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX \
npm run build

# 2. out/ を S3 へ同期
aws s3 sync out/ s3://<bucket-name>/ --delete

# 3. OGP画像は拡張子なしファイルのため Content-Type を明示して上書きアップロード
#    （aws s3 sync は拡張子からMIMEを推測するので、拡張子なしだと
#      binary/octet-stream になり、SNSクローラーが画像と認識しない恐れがある）
aws s3 cp out/opengraph-image s3://<bucket-name>/opengraph-image \
  --content-type image/png
for f in out/r/*/opengraph-image; do
  aws s3 cp "$f" "s3://<bucket-name>/${f#out/}" --content-type image/png
done

# 4. CloudFront キャッシュ無効化
aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
```

CloudFront 側の設定注意:

- **ディレクトリindex解決**: `trailingSlash: true` でビルドしているため、`/r/bra/` → `r/bra/index.html` の解決が必要。S3の静的ウェブサイトホスティング（index document: `index.html`）をオリジンにするか、CloudFront Function でURL末尾 `/` に `index.html` を付与する。
- **404**: 未知の `/r/xxx/` などは S3 が 403/404 を返す。CloudFront の Custom Error Response で 403 と 404 を **`/404.html`（ステータス404）** に向けること。`/index.html`（200）に向けるSPA風の設定にはしないこと（存在しないteamIdが診断トップとして200で返ってしまう）。
- Vercel にデプロイする場合も静的サイトとしてそのまま動く（`output: "export"` を自動検出）。環境変数はビルド時に設定する。

## データ構成

- `data/questions.json` … 質問10問（仕様v3で文言・スコア凍結。変更禁止）
- `data/teams.json` … チーム15カ国（`status: "in"`=確定 / `"tbd"`=試合待ち。tbdも判定対象）
- `lib/flagColors.ts` … OGP背景用の国旗2色（teams.jsonを汚さないため別管理）
- `lib/flagSvg.ts` … OGP用の国旗SVG（`scripts/fetch-flags.mjs` で自動生成。直接編集しない）

## 明朝の16カ国整理手順（7/4朝）

ラウンド32全結果確定後、**`data/teams.json` の編集だけで追従できる**:

1. 敗退した `status: "tbd"` の国のオブジェクトを削除
2. 勝ち上がった国は `status` を `"in"` に変更（任意。判定はstatusを見ないので削除だけでも可）
3. 不足している国があれば同フォーマット（id/name/flag/status/axes/reason/howto/numa）で追記
4. 新規国を追加した場合のみ:
   - `node scripts/fetch-flags.mjs` を実行してOGP用国旗SVGを再生成（未生成でも絵文字描画にフォールバックする）
   - `lib/flagColors.ts` に国旗2色を追記（無くてもデフォルト色で動く）
5. `node scripts/verify-r-axis.mjs && npm run build` で確認 → `out/` を再デプロイ（OGP画像もビルド時に再生成される）

判定ロジック・結果画面・OGPはすべて `teams.json` を参照しているため、コード変更は不要。

## 計測

GA4（`NEXT_PUBLIC_GA_ID` 設定時のみ有効）。カスタムイベントはシェアボタン押下の `share`（プロパティ: `team`）のみ。
