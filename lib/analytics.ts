/**
 * GA4 計測（NEXT_PUBLIC_GA_ID が設定されている場合のみ有効）。
 * 静的エクスポートのためIDはビルド時に焼き込まれる。
 * 未設定時は gtag スクリプトを一切読み込まず、送信も no-op。
 * カスタムイベントはシェアボタン押下の share のみ。
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** シェアボタン押下イベント（唯一の計測イベント） */
export function trackShare(teamId: string): void {
  if (!GA_ID) return;
  window.gtag?.("event", "share", { team: teamId });
}
