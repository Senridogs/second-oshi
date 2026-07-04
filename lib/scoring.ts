import { AXES, type Axis, type RankedTeam, type Scores, type Team } from "./types";

/** 回答（各設問で選んだ選択肢の scores）を合算してユーザーの軸スコアを作る */
export function computeUserScores(answers: Scores[]): Scores {
  const user: Scores = {};
  for (const answer of answers) {
    for (const axis of AXES) {
      const v = answer[axis];
      if (v !== undefined) {
        user[axis] = (user[axis] ?? 0) + v;
      }
    }
  }
  return user;
}

/** score(team) = Σ_axis user[axis] * team.axes[axis]（未定義軸は 0） */
export function scoreTeam(user: Scores, team: Team): number {
  let score = 0;
  for (const axis of AXES) {
    score += (user[axis] ?? 0) * (team.axes[axis] ?? 0);
  }
  return score;
}

/**
 * 全チームをスコア降順に並べる。
 * 同点は Math.random によるタイブレークで分散させる。
 */
export function rankTeams(user: Scores, teams: Team[]): RankedTeam[] {
  return teams
    .map((team) => ({ team, score: scoreTeam(user, team), tiebreak: Math.random() }))
    .sort((a, b) => b.score - a.score || b.tiebreak - a.tiebreak)
    .map(({ team, score }) => ({ team, score }));
}

export type { Axis };
