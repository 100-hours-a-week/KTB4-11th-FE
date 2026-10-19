// 현재 브라우저 기록에서 서비스 내부 이동으로 쌓인 깊이만 관리
const HISTORY_DEPTH = "stockSpoonHistoryDepth";

export function getInternalHistoryDepth(state: unknown): number {
  if (!state || typeof state !== "object") return 0;
  const depth = (state as Record<string, unknown>)[HISTORY_DEPTH];
  return typeof depth === "number" && Number.isSafeInteger(depth) && depth > 0
    ? depth
    : 0;
}

export function trackNavigationHistory(history: History): () => void {
  const pushState = history.pushState;
  const replaceState = history.replaceState;
  replaceState.call(
    history,
    {
      ...history.state,
      [HISTORY_DEPTH]: getInternalHistoryDepth(history.state),
    },
    "",
  );

  const trackedPush: History["pushState"] = function (data, unused, url) {
    pushState.call(
      history,
      {
        ...data,
        [HISTORY_DEPTH]: getInternalHistoryDepth(history.state) + 1,
      },
      unused,
      url,
    );
  };
  const trackedReplace: History["replaceState"] = function (data, unused, url) {
    replaceState.call(
      history,
      {
        ...data,
        [HISTORY_DEPTH]: getInternalHistoryDepth(history.state),
      },
      unused,
      url,
    );
  };
  history.pushState = trackedPush;
  history.replaceState = trackedReplace;

  return () => {
    if (history.pushState === trackedPush) history.pushState = pushState;
    if (history.replaceState === trackedReplace)
      history.replaceState = replaceState;
  };
}
