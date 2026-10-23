"use client";

import { useEffect, useState } from "react";

export type EventSourceStatus =
  "idle" | "connecting" | "open" | "reconnecting" | "error";

interface UseEventSourceResult<T> {
  data: T | null;
  status: EventSourceStatus;
}

/** url이 null이면 연결하지 않음 (재연결은 EventSource 내장 동작에 맡기고 상태만 노출) */
export function useEventSource<T, TIncoming = T>(
  url: string | null,
  eventName: string,
  merge?: (previous: T | null, incoming: TIncoming) => T,
): UseEventSourceResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<EventSourceStatus>("connecting");

  useEffect(() => {
    if (!url) return;

    const source = new EventSource(url);

    source.onopen = () => setConnectionStatus("open");

    source.onerror = () => {
      setConnectionStatus(
        source.readyState === EventSource.CLOSED ? "error" : "reconnecting",
      );
    };

    source.addEventListener(eventName, (event) => {
      try {
        const incoming = JSON.parse(
          (event as MessageEvent<string>).data,
        ) as TIncoming;
        setData((previous) =>
          merge ? merge(previous, incoming) : (incoming as unknown as T),
        );
      } catch {
        // JSON이 아닌 메시지가 오면 무시하고 이전 data 그대로 유지 (앱이 죽지 않게)
      }
    });

    return () => {
      source.close();
    };
  }, [url, eventName, merge]);

  const status: EventSourceStatus = url === null ? "idle" : connectionStatus;

  return { data, status };
}
