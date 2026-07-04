# セカンド推し診断 〜次に推す国、見つけよう〜

日本代表と一緒に大会を去りかけているライト層に、10問の診断で「第二の祖国」への入国ビザを発行するWebアプリ。
結果カード（ビザ/搭乗券の意匠）をXでシェアさせることが唯一のKPI。

- `/` … 診断SPA（1問1画面、パスポートのスタンプ枠が埋まる進捗表現、回答はセッション内stateのみ）
- `/r/[teamId]` … 結果パーマリンク。ビザカード + 「自分も診断する」CTA。OGP画像を動的生成（next/og）

## 開発コマンド

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 本番ビルド
npm run start  # 本番サーバー
npm run lint

# R軸(因縁・ブラジル専用)の挙動検証
node scripts/verify-r-axis.mjs
```

## 環境変数

| 変数 | 説明 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 本番URL（例: `https://second-oshi.example.com`）。シェアURLの絶対URL化と `metadataBase`（og:imageの絶対URL）に使用。未設定時はブラウザの `window.location.origin` にフォールバックするため開発中は無くても動く。**Vercel本番では必ず設定すること。** |

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
5. `node scripts/verify-r-axis.mjs && npm run build` で確認 → デプロイ

判定ロジック・結果画面・OGPはすべて `teams.json` を参照しているため、コード変更は不要。

## 計測

@vercel/analytics。カスタムイベントはシェアボタン押下の `share`（プロパティ: `team`）のみ。
