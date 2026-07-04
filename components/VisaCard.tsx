import type { Team } from "@/lib/types";

interface Props {
  team: Team;
  issuedDate: string;
  /** 結果表示時のみ true（スタンプがドンと押されるアニメーション） */
  animateStamp?: boolean;
}

/**
 * 入国ビザカード。パスポートのビザスタンプ/搭乗券の意匠。
 * 点線ミシン目 + 「APPROVED / 入国許可」印 + 発行日。
 */
export default function VisaCard({ team, issuedDate, animateStamp = false }: Props) {
  return (
    <div className="rounded-2xl bg-line p-2 text-ink shadow-lg">
      {/* 点線ミシン目 */}
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-ink/30 px-5 pb-5 pt-4">
        {/* ヘッダー行 */}
        <div className="flex items-baseline justify-between border-b border-ink/15 pb-2">
          <span className="label-en text-[10px] font-bold text-ink/60">
            Second Oshi Visa
          </span>
          <span className="label-en text-[10px] text-ink/40">
            No.{team.id.toUpperCase()}-2026
          </span>
        </div>

        {/* 本体 */}
        <p className="mt-4 text-sm font-bold text-ink/70">あなたの移住先は</p>
        <div className="mt-1 flex items-center gap-4">
          <span className="text-6xl leading-none" role="img" aria-label={team.name}>
            {team.flag}
          </span>
          <h2
            className="text-4xl font-black leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {team.name}
          </h2>
        </div>

        <p className="mt-4 pr-24 text-sm font-bold leading-relaxed text-ink/90">
          {team.reason}
        </p>

        {/* 入国印 */}
        <div
          className={`absolute bottom-14 right-4 flex flex-col items-center rounded-lg border-4 border-stamp/85 px-3 py-2 text-stamp ${
            animateStamp ? "stamp-animate" : "-rotate-8"
          }`}
          aria-hidden="true"
        >
          <span className="label-en text-sm font-bold">Approved</span>
          <span className="text-[11px] font-bold tracking-[0.4em]">入国許可</span>
        </div>

        {/* 発行日 + MRZ風装飾 */}
        <div className="mt-6 flex items-baseline justify-between border-t border-ink/15 pt-2">
          <span className="label-en text-[10px] text-ink/60">Date of Issue</span>
          <span className="label-en text-xs font-bold text-ink/80">{issuedDate}</span>
        </div>
        <p className="label-en mt-1 truncate text-[9px] text-ink/30" aria-hidden="true">
          {`P<2NDOSHI${team.id.toUpperCase()}<<VISITOR<<<<<<<<<<<<<<<<<<<<<<`}
        </p>
      </div>
    </div>
  );
}
