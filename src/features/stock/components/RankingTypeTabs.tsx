"use client";
import {
  RANKING_TYPES,
  type RankingType,
} from "@/features/stock/types/ranking";
import { Tabs } from "@/shared/components/Tabs";
interface RankingTypeTabsProps {
  value: RankingType;
  onChange: (value: RankingType) => void;
}
export function RankingTypeTabs(props: RankingTypeTabsProps) {
  return (
    <Tabs tabs={RANKING_TYPES} {...props} className="justify-between px-4" />
  );
}
