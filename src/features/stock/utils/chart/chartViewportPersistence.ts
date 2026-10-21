// 상세 차트의 초기 범위 적용, 확대·이동 시 지연 저장 및 화면 이탈 시 저장·이벤트 정리

import type { IChartApi } from "lightweight-charts";
import {
  saveChartViewport,
  type SavedChartViewport,
} from "@/features/stock/utils/chart/chartPreferences";

export function createChartViewportPersistence({
  chart,
  getBarCount,
  onSave,
}: {
  chart: IChartApi;
  getBarCount: () => number;
  onSave: (viewport: SavedChartViewport) => void;
}) {
  let initialized = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: SavedChartViewport | null = null;

  const flush = () => {
    clearTimeout(timer);
    if (pending) {
      onSave(pending);
      pending = null;
    }
  };
  const remember = () => {
    if (!initialized) return;
    const range = chart.timeScale().getVisibleLogicalRange();
    const count = getBarCount();
    if (!range || !count) return;
    pending = saveChartViewport(range, count);
    clearTimeout(timer);
    timer = setTimeout(flush, 150);
  };

  chart.timeScale().subscribeVisibleLogicalRangeChange(remember);
  window.addEventListener("pagehide", flush);

  return {
    get initialized() {
      return initialized;
    },
    initialize(range: { from: number; to: number }) {
      if (initialized) return;
      chart.timeScale().setVisibleLogicalRange(range);
      initialized = true;
    },
    dispose() {
      remember();
      flush();
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(remember);
      window.removeEventListener("pagehide", flush);
    },
  };
}
