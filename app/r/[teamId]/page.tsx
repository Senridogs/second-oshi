import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResultVisaCard from "@/components/ResultVisaCard";
import { findTeam, teams } from "@/lib/teams";
import { shareText } from "@/lib/share";

interface Props {
  params: Promise<{ teamId: string }>;
}

/**
 * 静的エクスポート: 全15カ国ぶんをビルド時に事前生成する。
 * 発行日（=閲覧日）はクライアント描画（ResultVisaCard）で維持する。
 */
export function generateStaticParams() {
  return teams.map((team) => ({ teamId: team.id }));
}

/** generateStaticParams 外のteamIdは生成しない（404はS3/CloudFront側に委ねる） */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { teamId } = await params;
  const team = findTeam(teamId);
  if (!team) return {};

  const title = `${team.flag}${team.name}に移住しました | セカンド推し診断`;
  const description = team.reason;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/r/${team.id}`,
      siteName: "セカンド推し診断",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ResultPermalink({ params }: Props) {
  const { teamId } = await params;
  const team = findTeam(teamId);
  if (!team) notFound();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 py-6">
      {/* 最上部: 再移住動線 */}
      <div className="flex items-center justify-between">
        <span className="label-en text-[10px] text-line/50">Immigration Result</span>
        <Link
          href="/"
          className="rounded-full border border-line/40 px-3 py-1 text-xs font-bold text-line/80"
        >
          再移住する
        </Link>
      </div>

      {/* シェア文の再現（誰の結果かの文脈） */}
      <p className="text-sm leading-relaxed text-line/80">{shareText(team)}</p>

      {/* ビザカード（発行日はクライアントで閲覧日を描画） */}
      <ResultVisaCard team={team} />

      {/* KPI: 開いた人が10秒で診断を始められる目立つCTA */}
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="block w-full rounded-full bg-pitch py-4 text-center text-xl font-black text-night"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          自分も診断する
        </Link>
        <p className="text-center text-xs text-line/60">
          10問・30秒。サッカー知識ゼロでOK
        </p>
      </div>

      <footer className="mt-auto pb-2 text-center">
        <p className="label-en text-[10px] text-line/40">#セカンド推し診断</p>
        <p className="mt-1 text-[10px] text-line/30">国旗画像: Twemoji (CC-BY 4.0)</p>
      </footer>
    </div>
  );
}
