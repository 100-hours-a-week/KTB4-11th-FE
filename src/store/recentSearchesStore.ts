import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeLocalStorage } from "@/shared/utils/safeLocalStorage";

const MAX_RECENT_SEARCHES = 10;

interface RecentSearchesStore {
  hydrated: boolean;
  recentSearches: string[];
  addRecentSearch: (keyword: string) => void;
  removeRecentSearch: (keyword: string) => void;
  clearRecentSearches: () => void;
}

export const useRecentSearchesStore = create<RecentSearchesStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      recentSearches: [],
      addRecentSearch: (keyword) => {
        const trimmed = keyword.trim();
        if (!trimmed) return;
        const next = [
          trimmed,
          ...get().recentSearches.filter((item) => item !== trimmed),
        ].slice(0, MAX_RECENT_SEARCHES);
        set({ recentSearches: next });
      },
      removeRecentSearch: (keyword) => {
        set({
          recentSearches: get().recentSearches.filter(
            (item) => item !== keyword,
          ),
        });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "stockspoon-recent-stock-searches",
      skipHydration: true,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: ({ recentSearches }) => ({ recentSearches }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<RecentSearchesStore> | undefined;
        const recentSearches = Array.isArray(saved?.recentSearches)
          ? saved.recentSearches.filter(
              (item): item is string => typeof item === "string",
            )
          : [];
        return { ...current, recentSearches };
      },
    },
  ),
);

let hydration: Promise<void> | undefined;

export function hydrateRecentSearchesStore(): Promise<void> {
  if (hydration) return hydration;
  hydration = Promise.resolve(useRecentSearchesStore.persist.rehydrate())
    .catch(() => {
      // 손상된 저장 데이터는 기본값으로 대체
    })
    .then(() => {
      useRecentSearchesStore.setState({ hydrated: true });
    });
  return hydration;
}
