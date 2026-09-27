"use client";

import { FilterChips } from "@/shared/components/FilterChips";

const FILTERS = ["전체", "매수", "매도"] as const;

export type AiTradeFilterValue = (typeof FILTERS)[number];

interface AiTradeFilterChipsProps {
  value: AiTradeFilterValue;
  onChange: (value: AiTradeFilterValue) => void;
}

export function AiTradeFilterChips({
  value,
  onChange,
}: AiTradeFilterChipsProps) {
  return <FilterChips options={FILTERS} value={value} onChange={onChange} />;
}
