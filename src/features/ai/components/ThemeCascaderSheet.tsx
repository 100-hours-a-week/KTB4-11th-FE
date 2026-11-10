"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import CheckIcon from "@/assets/icons/fill/check.svg";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import type { ThemeCategory } from "@/features/ai/types/theme";
import {
  getCategoryState,
  type CheckboxState,
} from "@/features/ai/utils/theme";
import { Button } from "@/shared/components/Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHandle,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/Sheet";
import { cn } from "@/shared/utils/cn";

function isLeafCategory(category: ThemeCategory): boolean {
  return (
    category.items.length === 1 && category.items[0].name === category.name
  );
}

function CheckboxIndicator({ state }: { state: CheckboxState }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border-[1.5px] transition-colors duration-200",
        state === "all"
          ? "bg-bg-accent border-bg-accent"
          : "bg-bg-layer-default border-border-neutral-muted",
      )}
    >
      {state === "all" && (
        <CheckIcon
          width={15}
          height={15}
          className="text-icon-neutral-inverse"
        />
      )}
      {state === "some" && (
        <span className="bg-bg-accent size-2.5 rounded-[3px]" />
      )}
    </span>
  );
}

interface ThemeCascaderSheetProps {
  trigger: ReactNode;
  title: string;
  categories: ThemeCategory[];
  value: string[];
  onChange: (value: string[]) => void;
  excludedValue: string[];
}

export function ThemeCascaderSheet({
  trigger,
  title,
  categories,
  value,
  onChange,
  excludedValue,
}: ThemeCascaderSheetProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const effectiveFocusedIndex =
    focusedIndex ??
    categories.findIndex((category) => !isLeafCategory(category));
  const focusedCategory = categories[effectiveFocusedIndex];

  function toggleCategory(category: ThemeCategory) {
    const itemNames = category.items.map((item) => item.name);
    const state = getCategoryState(category, value);

    if (
      state !== "all" &&
      itemNames.some((name) => excludedValue.includes(name))
    ) {
      toast.error("관심 테마와 제외 테마에 같은 테마를 선택할 수 없어요.");
      return;
    }

    onChange(
      state === "all"
        ? value.filter((name) => !itemNames.includes(name))
        : Array.from(new Set([...value, ...itemNames])),
    );
  }

  function toggleItem(itemName: string) {
    if (!value.includes(itemName) && excludedValue.includes(itemName)) {
      toast.error("관심 테마와 제외 테마에 같은 테마를 선택할 수 없어요.");
      return;
    }

    onChange(
      value.includes(itemName)
        ? value.filter((name) => name !== itemName)
        : [...value, itemName],
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetPortal>
        <SheetContent>
          <div className="flex h-[70vh] flex-col px-5 pt-3 pb-5">
            <SheetHandle className="mb-4" />
            <div className="flex items-center justify-between">
              <SheetTitle>{title}</SheetTitle>
              <span className="body-2-medium text-text-accent">
                {value.length}개 선택
              </span>
            </div>

            <div className="border-border-neutral-muted mt-4 flex min-h-0 flex-1 overflow-hidden rounded-2xl border">
              <div className="border-border-neutral-muted w-1/2 overflow-y-auto border-r">
                {categories.map((category, index) => {
                  const state = getCategoryState(category, value);
                  const isFocused = index === effectiveFocusedIndex;

                  if (isLeafCategory(category)) {
                    return (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="flex w-full items-center gap-2 px-3 py-3"
                      >
                        <CheckboxIndicator state={state} />
                        <span className="body-2-medium text-text-neutral-primary text-left">
                          {category.name}
                        </span>
                      </button>
                    );
                  }

                  return (
                    <div
                      key={category.name}
                      className={cn(
                        "flex items-center gap-2 px-3 py-3 transition-colors duration-200",
                        isFocused && "bg-sky-blue-50",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        aria-label={`${category.name} 전체 선택`}
                      >
                        <CheckboxIndicator state={state} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFocusedIndex(index)}
                        className="flex flex-1 items-center justify-between gap-1"
                      >
                        <span
                          className={cn(
                            "text-left transition-colors duration-200",
                            isFocused
                              ? "body-2-semibold text-text-accent"
                              : "body-2-medium text-text-neutral-primary",
                          )}
                        >
                          {category.name}
                        </span>
                        <ChevronForwardIcon
                          width={14}
                          height={14}
                          className="text-icon-neutral-tertiary shrink-0"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="w-1/2 overflow-y-auto">
                {focusedCategory?.items.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => toggleItem(item.name)}
                    className="flex w-full items-center gap-2 px-3 py-3"
                  >
                    <CheckboxIndicator
                      state={value.includes(item.name) ? "all" : "none"}
                    />
                    <span className="body-2-medium text-text-neutral-primary">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <SheetClose asChild>
              <Button className="mt-4" disabled={value.length === 0}>
                선택 완료
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
