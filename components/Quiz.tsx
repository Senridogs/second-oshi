"use client";

import { useState } from "react";
import { questions, teams } from "@/lib/teams";
import { computeUserScores, rankTeams } from "@/lib/scoring";
import type { QuestionOption, RankedTeam, Scores } from "@/lib/types";
import PassportProgress from "./PassportProgress";
import ResultScreen from "./ResultScreen";

/**
 * 診断SPA。1問1画面、10問回答で結果画面へ（URLは / のまま、state のみ）。
 * localStorage / sessionStorage は使用しない。
 */
export default function Quiz() {
  const [answers, setAnswers] = useState<Scores[]>([]);
  const [ranked, setRanked] = useState<RankedTeam[] | null>(null);

  const step = answers.length;
  const question = questions[step];

  const choose = (option: QuestionOption) => {
    if (ranked) return;
    const next = [...answers, option.scores];
    setAnswers(next);
    if (next.length === questions.length) {
      setRanked(rankTeams(computeUserScores(next), teams));
    }
  };

  const reset = () => {
    setAnswers([]);
    setRanked(null);
  };

  if (ranked) {
    return (
      <ResultScreen
        first={ranked[0].team}
        // チーム数が3未満でもクラッシュしないよう存在する分だけ渡す
        runners={ranked.slice(1, 3).map((r) => r.team)}
        onReset={reset}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-6">
      {/* ヘッダー */}
      <header className="text-center">
        <p className="label-en text-[10px] text-line/50">Immigration Quiz</p>
        <h1
          className="mt-1 text-xl font-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          セカンド推し診断
        </h1>
        <p className="mt-1 text-xs text-line/60">次に推す国、見つけよう</p>
      </header>

      {/* 質問 */}
      <main className="flex flex-1 flex-col justify-center py-8">
        <p className="label-en text-xs font-bold text-pitch">
          Question {String(question.id).padStart(2, "0")} / {questions.length}
        </p>
        <h2
          className="mt-3 text-2xl font-black leading-snug"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {question.text}
        </h2>
        <div className="mt-8 flex flex-col gap-3">
          {question.options.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => choose(option)}
              className="w-full rounded-xl border-2 border-line/35 px-5 py-4 text-left text-base font-bold leading-snug hover:border-pitch hover:text-pitch active:border-pitch active:text-pitch"
            >
              {option.label}
            </button>
          ))}
        </div>
      </main>

      {/* 進捗: パスポートのスタンプ枠 */}
      <footer className="pb-2">
        <PassportProgress total={questions.length} filled={step} />
      </footer>
    </div>
  );
}
