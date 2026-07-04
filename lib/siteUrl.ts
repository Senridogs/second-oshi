/**
 * サイトのベースURL（絶対URL組み立て用の共通ヘルパー）。優先順位:
 * 1. NEXT_PUBLIC_SITE_URL（明示設定。本番の正規URL）
 * 2. VERCEL_URL（Vercelデプロイ時に自動注入。サーバーのみ）
 * 3. window.location.origin（クライアントのみ）
 * 4. localhost（ローカル開発フォールバック）
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
}
