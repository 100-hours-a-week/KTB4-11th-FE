"use client";

// 선택한 랭킹 종류를 URL에 저장해 새로고침 후 복원
import { useSearchParams } from "next/navigation";
import {
  RANKING_TYPES,
  RANKING_TYPE_TO_API_TYPE,
  type RankingType,
} from "@/features/stock/types/ranking";

export function useRankingTab() {
  const searchParams = useSearchParams();
  const kind = searchParams.get("ranking");
  const rankingType =
    RANKING_TYPES.find((type) => RANKING_TYPE_TO_API_TYPE[type] === kind) ??
    "거래대금";

  function setRankingType(type: RankingType) {
    const url = new URL(window.location.href);
    url.searchParams.set("ranking", RANKING_TYPE_TO_API_TYPE[type]);
    window.history.replaceState(null, "", url);
  }

  return { rankingType, setRankingType };
}
