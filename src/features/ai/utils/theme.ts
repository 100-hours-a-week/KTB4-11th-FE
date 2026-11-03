import type { ThemeCategory } from "@/features/ai/types/theme";

export type CheckboxState = "all" | "some" | "none";

export function getCategoryState(
  category: ThemeCategory,
  value: string[],
): CheckboxState {
  const selectedCount = category.items.filter((item) =>
    value.includes(item.name),
  ).length;
  if (selectedCount === 0) return "none";
  if (selectedCount === category.items.length) return "all";
  return "some";
}
