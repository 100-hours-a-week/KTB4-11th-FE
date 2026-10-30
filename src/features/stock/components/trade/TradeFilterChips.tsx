"use client";

import { FilterChips } from "@/shared/components/FilterChips";

const FILTERS = ["전체", "매수", "매도"] as const;

export type TradeFilterValue = (typeof FILTERS)[number];

interface TradeFilterChipsProps {
  value: TradeFilterValue;
  onChange: (value: TradeFilterValue) => void;
}

export function TradeFilterChips({ value, onChange }: TradeFilterChipsProps) {
  return <FilterChips options={FILTERS} value={value} onChange={onChange} />;
}
