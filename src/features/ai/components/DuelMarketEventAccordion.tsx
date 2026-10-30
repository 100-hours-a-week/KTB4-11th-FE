"use client";

import { Accordion } from "radix-ui";
import { useRef } from "react";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import type { DuelMarketEvent } from "@/features/ai/types/duel";
import { trackEvent } from "@/shared/utils/analytics";

interface DuelMarketEventAccordionProps {
  items: DuelMarketEvent[];
  competitionId: string;
}

export function DuelMarketEventAccordion({
  items,
  competitionId,
}: DuelMarketEventAccordionProps) {
  const openValuesRef = useRef<string[]>([]);

  function handleValueChange(value: string[]) {
    const newlyOpened = value.find(
      (item) => !openValuesRef.current.includes(item),
    );
    if (newlyOpened) {
      const eventIndex = Number(newlyOpened.replace("event-", ""));
      trackEvent("duel_market_event_expand", {
        competition_id: competitionId,
        event_index: eventIndex,
      });
    }
    openValuesRef.current = value;
  }

  return (
    <Accordion.Root
      type="multiple"
      className="flex flex-col"
      onValueChange={handleValueChange}
    >
      {items.map((item, index) => (
        <Accordion.Item
          key={`${item.date}-${item.title}`}
          value={`event-${index}`}
          className="border-border-neutral-muted border-b last:border-none"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-start gap-3 py-3 text-left">
              <span className="bg-sky-blue-50 text-text-accent caption-1-regular shrink-0 rounded-full px-2 py-0.5">
                {item.date}
              </span>
              <span className="body-2-semibold flex-1">{item.title}</span>
              <ChevronForwardIcon
                width={16}
                height={16}
                className="text-icon-neutral-secondary shrink-0 self-center transition-transform group-data-[state=open]:rotate-90"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pb-3 pl-[52px]">
            <p className="body-2-regular text-text-neutral-secondary text-justify">
              {item.body}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
