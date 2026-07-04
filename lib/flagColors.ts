/**
 * OGP背景用: 各国国旗の代表2色（グラデーション用）。
 * teams.json は仕様v3で凍結されているため、表示用の色はここで別管理する。
 */
export const flagColors: Record<string, [string, string]> = {
  bra: ["#009739", "#FEDD00"],
  nor: ["#BA0C2F", "#00205B"],
  eng: ["#FFFFFF", "#CE1124"],
  mex: ["#006341", "#C8102E"],
  fra: ["#0055A4", "#EF4135"],
  bel: ["#FDDA24", "#EF3340"],
  usa: ["#B31942", "#0A3161"],
  esp: ["#AA151B", "#F1BF00"],
  por: ["#046A38", "#DA291C"],
  ger: ["#DD0000", "#FFCE00"],
  mar: ["#C1272D", "#006233"],
  arg: ["#74ACDF", "#F6B40E"],
  cpv: ["#003893", "#CF2027"],
  can: ["#D80621", "#F2EFE6"],
  rsa: ["#007749", "#FFB81C"],
};

const FALLBACK: [string, string] = ["#0F1A2B", "#19C37D"];

export function getFlagColors(teamId: string): [string, string] {
  return flagColors[teamId] ?? FALLBACK;
}
