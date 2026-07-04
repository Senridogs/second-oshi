"use client";

import { trackShare } from "@/lib/analytics";
import { xIntentUrl } from "@/lib/share";
import type { Team } from "@/lib/types";

interface Props {
  team: Team;
}

/** Xシェアボタン。計測はこの click イベントのみ（GA4 share イベント） */
export default function ShareButton({ team }: Props) {
  const handleClick = () => {
    trackShare(team.id);
    window.open(xIntentUrl(team), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-full bg-pitch py-4 text-lg font-black text-night"
      style={{ fontFamily: "var(--font-heading)" }}
    >
      Xで移住を報告する
    </button>
  );
}
