"use client";

import { formatIssueDate } from "@/lib/date";
import type { Team } from "@/lib/types";
import ShareButton from "./ShareButton";
import VisaCard from "./VisaCard";

interface Props {
  first: Team;
  runners: Team[];
  onReset: () => void;
}

/**
 * 結果画面。構成順（HANDOFF確定）:
 * ビザカード → 沼ポイント2項 → howto → 僅差の候補(2,3位) → シェア → もう一度診断
 * 「再移住する」小ボタンは最上部に常設。
 */
export default function ResultScreen({ first, runners, onReset }: Props) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 py-6">
      {/* 最上部: 再移住ボタン常設 */}
      <div className="flex items-center justify-between">
        <span className="label-en text-[10px] text-line/50">Immigration Result</span>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-line/40 px-3 py-1 text-xs font-bold text-line/80"
        >
          再移住する
        </button>
      </div>

      {/* 1. ビザカード */}
      <VisaCard team={first} issuedDate={formatIssueDate()} animateStamp />

      {/* 2. 沼ポイント */}
      <section>
        <h3
          className="text-lg font-black text-pitch"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          沼ポイント
        </h3>
        <ul className="mt-3 flex flex-col gap-3">
          {first.numa.map((point) => (
            <li
              key={point}
              className="border-l-2 border-pitch pl-3 text-sm leading-relaxed text-line/90"
            >
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* 3. howto */}
      <section>
        <h3
          className="text-lg font-black text-pitch"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          推し方
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-line/90">{first.howto}</p>
      </section>

      {/* 4. 僅差の候補 (2位・3位) */}
      <section>
        <p className="label-en text-[10px] text-line/50">Runners-up</p>
        <p className="mt-1 text-xs text-line/60">僅差だった移住先候補</p>
        <div className="mt-2 flex gap-2">
          {runners.map((team, i) => (
            <span
              key={team.id}
              className="flex items-center gap-1.5 rounded-full border border-line/25 px-3 py-1.5 text-sm"
            >
              <span className="text-line/50">{i + 2}位</span>
              <span role="img" aria-label={team.name}>
                {team.flag}
              </span>
              {team.name}
            </span>
          ))}
        </div>
      </section>

      {/* 5. シェア */}
      <ShareButton team={first} />

      {/* 6. もう一度診断 */}
      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-full border-2 border-line/40 py-3 font-bold text-line/90"
      >
        もう一度診断する
      </button>
    </div>
  );
}
