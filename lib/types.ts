export const AXES = ["K", "U", "A", "S", "N", "F", "Y", "R"] as const;
export type Axis = (typeof AXES)[number];

/** 軸ごとの加点。定義されていない軸は 0 として扱う */
export type Scores = Partial<Record<Axis, number>>;

export interface Team {
  id: string;
  name: string;
  flag: string;
  status: "in" | "tbd";
  pair?: string;
  axes: Scores;
  reason: string;
  howto: string;
  numa: string[];
}

export interface QuestionOption {
  key: string;
  label: string;
  scores: Scores;
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

export interface RankedTeam {
  team: Team;
  score: number;
}
