"use client";

import { useSyncExternalStore } from "react";
import { formatIssueDate } from "@/lib/date";
import type { Team } from "@/lib/types";
import VisaCard from "./VisaCard";

interface Props {
  team: Team;
}

const emptySubscribe = () => () => {};

/**
 * /r/[teamId] 用のビザカード。
 * 静的エクスポート（SSG）でも「発行日=閲覧日」の要件を保つため、
 * 発行日はマウント後にクライアントで描画する。
 * SSG出力とのhydration不整合を避けるため、SSR/初回hydration時は空表示
 * （useSyncExternalStore のサーバースナップショット）にする。
 */
export default function ResultVisaCard({ team }: Props) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const issuedDate = mounted ? formatIssueDate() : "";

  return <VisaCard team={team} issuedDate={issuedDate} animateStamp />;
}
