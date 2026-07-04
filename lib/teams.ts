import teamsJson from "@/data/teams.json";
import questionsJson from "@/data/questions.json";
import type { Question, Team } from "./types";

export const teams = teamsJson as Team[];
export const questions = questionsJson as Question[];

export function findTeam(id: string): Team | undefined {
  return teams.find((t) => t.id === id);
}
