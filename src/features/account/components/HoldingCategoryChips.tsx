"use client";

import { FilterChips } from "@/shared/components/FilterChips";

const ALL_CATEGORY = "전체";

interface HoldingCategoryChipsProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}

export function HoldingCategoryChips({
  categories,
  value,
  onChange,
}: HoldingCategoryChipsProps) {
  return (
    <FilterChips
      options={[ALL_CATEGORY, ...categories]}
      value={value}
      onChange={onChange}
      scrollable
    />
  );
}
