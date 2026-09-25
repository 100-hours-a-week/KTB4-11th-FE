"use client";

import { Accordion } from "radix-ui";
import type { AiJudgmentStep } from "@/features/ai/types/aiTradeReasoning";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";

interface JudgmentFlowAccordionProps {
  steps: AiJudgmentStep[];
}

export function JudgmentFlowAccordion({ steps }: JudgmentFlowAccordionProps) {
  return (
    <Accordion.Root
      type="multiple"
      className="bg-bg-layer-default flex flex-col rounded-2xl px-4"
    >
      {steps.map((step, index) => (
        <Accordion.Item
          key={step.id}
          value={step.id}
          className="border-border-neutral-muted border-b last:border-none"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center gap-3 py-[13px]">
              <span className="bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary group-data-[state=open]:bg-bg-accent group-data-[state=open]:text-text-neutral-inverse flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold group-data-[state=open]:border-transparent">
                {index + 1}
              </span>
              <span className="body-2-semibold flex-1 text-left">
                {step.title}
              </span>
              <ChevronForwardIcon
                width={16}
                height={16}
                className="text-icon-neutral-secondary shrink-0 transition-transform group-data-[state=open]:rotate-90"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          {step.details && (
            <Accordion.Content className="flex flex-col gap-1 pb-4 pl-8">
              {step.details.map((detail) => (
                <span
                  key={detail.label}
                  className="body-2-regular text-text-neutral-secondary"
                >
                  {detail.label} · {detail.value}
                </span>
              ))}
            </Accordion.Content>
          )}
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
