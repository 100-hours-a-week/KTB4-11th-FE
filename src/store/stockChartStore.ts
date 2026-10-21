import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_CHART_PREFERENCES,
  isChartGranularity,
  isSavedChartViewport,
  parseChartPreferences,
  type ChartPreferences,
  type SavedChartViewport,
} from "@/features/stock/utils/chart/chartPreferences";
import type { ChartGranularity } from "@/features/stock/utils/chart/chartPeriod";
import { safeLocalStorage } from "@/shared/utils/safeLocalStorage";

interface StockChartStore {
  hydrated: boolean;
  preferences: ChartPreferences;
  viewports: Partial<Record<ChartGranularity, SavedChartViewport>>;
  setPreferences: (preferences: ChartPreferences) => void;
  setViewport: (
    interval: ChartGranularity,
    viewport: SavedChartViewport,
  ) => void;
}

export const useStockChartStore = create<StockChartStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      preferences: DEFAULT_CHART_PREFERENCES,
      viewports: {},
      setPreferences: (preferences) => {
        const previous = get().preferences;
        if (
          previous.detailed === preferences.detailed &&
          previous.period === preferences.period &&
          previous.granularity === preferences.granularity &&
          previous.minute === preferences.minute
        )
          return;
        set({ preferences });
      },
      setViewport: (interval, viewport) => {
        if (!isSavedChartViewport(viewport)) return;
        set({ viewports: { ...get().viewports, [interval]: viewport } });
      },
    }),
    {
      name: "stock-chart-preferences-v1",
      skipHydration: true,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: ({ preferences, viewports }) => ({ preferences, viewports }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<StockChartStore> | undefined;
        const viewports = Object.fromEntries(
          Object.entries(saved?.viewports ?? {}).filter(
            ([interval, viewport]) =>
              isChartGranularity(interval) && isSavedChartViewport(viewport),
          ),
        );
        return {
          ...current,
          preferences: parseChartPreferences(saved?.preferences),
          viewports,
        };
      },
    },
  ),
);

let hydration: Promise<void> | undefined;

export function hydrateStockChartStore(): Promise<void> {
  if (hydration) return hydration;
  hydration = Promise.resolve(useStockChartStore.persist.rehydrate())
    .catch(() => {
      // 손상된 저장 데이터는 기본값으로 대체
    })
    .then(() => {
      useStockChartStore.setState({ hydrated: true });
    });
  return hydration;
}
