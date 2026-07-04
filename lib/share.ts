import type { Team } from "./types";
import { getSiteUrl } from "./siteUrl";

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
 * ベースURLの優先順位は lib/siteUrl.ts（metadataBase と共通）に従う。
 */
export function resultUrl(teamId: string): string {
  return `${getSiteUrl().replace(/\/$/, "")}${resultPath(teamId)}`;
}

/** X (Twitter) intent URL */
export function xIntentUrl(team: Team): string {
  const params = new URLSearchParams({
    text: shareText(team),
    url: resultUrl(team.id),
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}
