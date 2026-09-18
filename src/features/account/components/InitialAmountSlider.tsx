"use client";

import { Slider } from "radix-ui";

interface InitialAmountSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  minLabel: string;
  maxLabel: string;
}

export function InitialAmountSlider({
  value,
  onValueChange,
  min,
  max,
  step = 100_000,
  minLabel,
  maxLabel,
}: InitialAmountSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <Slider.Root
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([next]) => onValueChange(next)}
        className="relative flex h-5 w-full items-center"
      >
        <Slider.Track className="bg-bg-neutral-tertiary relative h-2 flex-1 rounded-full">
          <Slider.Range className="bg-bg-accent absolute h-full rounded-full" />
        </Slider.Track>
        <Slider.Thumb className="border-bg-accent block size-6 rounded-full border-2 bg-white" />
      </Slider.Root>
      <div className="body-2-medium text-text-neutral-primary flex justify-between">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
