import type { Team } from "./types";

/** シェア本文（仕様v3 固定文言） */
export function shareText(team: Team): string {
  return `日本ロスの私、診断の結果 ${team.flag}${team.name} に移住しました。#セカンド推し診断`;
}

/** 結果パーマリンクのパス */
export function resultPath(teamId: string): string {
  return `/r/${teamId}`;
}

/**
 * 結果パーマリンクの絶対URL。
 * NEXT_PUBLIC_SITE_URL 未設定時はブラウザの origin にフォールバック。
 * （サーバー側で origin も無い場合は相対パスを返す）
 */
export function resultUrl(teamId: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base.replace(/\/$/, "")}${resultPath(teamId)}`;
}

/** X (Twitter) intent URL */
export function xIntentUrl(team: Team): string {
  const params = new URLSearchParams({
    text: shareText(team),
    url: resultUrl(team.id),
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}
