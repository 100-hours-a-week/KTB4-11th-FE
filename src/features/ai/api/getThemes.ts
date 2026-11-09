import { marketApiClient } from "@/shared/lib/marketApiClient";
import type {
  ThemeCategory,
  ThemeCategoryItem,
} from "@/features/ai/types/theme";

type ThemeApiEntry = ThemeCategory | ThemeCategoryItem;

function toThemeCategory(entry: ThemeApiEntry): ThemeCategory {
  return "items" in entry ? entry : { name: entry.name, items: [entry] };
}

export async function getThemes() {
  const { data } = await marketApiClient.get<ThemeApiEntry[]>("/themes");
  return data.map(toThemeCategory);
}
