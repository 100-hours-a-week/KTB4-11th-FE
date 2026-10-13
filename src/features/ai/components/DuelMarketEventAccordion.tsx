"use client";

import { Accordion } from "radix-ui";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import type { DuelMarketEvent } from "@/features/ai/types/duel";

interface DuelMarketEventAccordionProps {
  items: DuelMarketEvent[];
}

export function DuelMarketEventAccordion({
  items,
}: DuelMarketEventAccordionProps) {
  return (
    <Accordion.Root type="multiple" className="flex flex-col">
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
