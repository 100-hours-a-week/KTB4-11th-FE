"use client";

import { useEffect } from "react";
import {
  hydrateRecentSearchesStore,
  useRecentSearchesStore,
} from "@/store/recentSearchesStore";

export function useRecentSearches() {
  const hydrated = useRecentSearchesStore((state) => state.hydrated);
  const recentSearches = useRecentSearchesStore(
    (state) => state.recentSearches,
  );
  const addRecentSearch = useRecentSearchesStore(
    (state) => state.addRecentSearch,
  );
  const removeRecentSearch = useRecentSearchesStore(
    (state) => state.removeRecentSearch,
  );
  const clearRecentSearches = useRecentSearchesStore(
    (state) => state.clearRecentSearches,
  );

  useEffect(() => {
    void hydrateRecentSearchesStore();
  }, []);

  return {
    recentSearches: hydrated ? recentSearches : [],
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}
