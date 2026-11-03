"use client";

import ChevronDownIcon from "@/assets/icons/fill/chevron-down.svg";
import CloseIcon from "@/assets/icons/fill/close.svg";
import { ThemeCascaderSheet } from "@/features/ai/components/ThemeCascaderSheet";
import type { ThemeCategory } from "@/features/ai/types/theme";
import { getCategoryState } from "@/features/ai/utils/theme";

interface ThemeTag {
  key: string;
  label: string;
  remove: () => void;
}

function getSelectedTags(
  categories: ThemeCategory[],
  value: string[],
  onChange: (value: string[]) => void,
): ThemeTag[] {
  const tags: ThemeTag[] = [];

  categories.forEach((category) => {
    const state = getCategoryState(category, value);
    const itemNames = category.items.map((item) => item.name);

    if (state === "all") {
      tags.push({
        key: category.name,
        label: category.name,
        remove: () =>
          onChange(value.filter((name) => !itemNames.includes(name))),
      });
      return;
    }

    if (state === "some") {
      category.items.forEach((item) => {
        if (value.includes(item.name)) {
          tags.push({
            key: `${category.name}-${item.name}`,
            label: `${category.name} · ${item.name}`,
            remove: () => onChange(value.filter((name) => name !== item.name)),
          });
        }
      });
    }
  });

  return tags;
}

interface ThemeCascaderFieldProps {
  label: string;
  categories: ThemeCategory[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function ThemeCascaderField({
  label,
  categories,
  value,
  onChange,
}: ThemeCascaderFieldProps) {
  const tags = getSelectedTags(categories, value, onChange);

  return (
    <div className="flex flex-col gap-3">
      <span className="body-1-bold">{label}</span>
      <ThemeCascaderSheet
        title={label}
        categories={categories}
        value={value}
        onChange={onChange}
        trigger={
          <button
            type="button"
            className="bg-bg-layer-default border-border-neutral-muted flex min-h-[54px] w-full items-center justify-between gap-2 rounded-2xl border-[1.4px] p-3"
          >
            {tags.length === 0 ? (
              <span className="body-2-medium text-text-neutral-tertiary">
                테마를 선택해 주세요
              </span>
            ) : (
              <div className="flex flex-1 flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag.key}
                    className="bg-bg-layer-basement caption-1-semibold text-text-neutral-primary flex items-center gap-1 rounded-full py-1 pr-1.5 pl-2.5"
                  >
                    {tag.label}
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`${tag.label} 선택 해제`}
                      onClick={(event) => {
                        event.stopPropagation();
                        tag.remove();
                      }}
                      className="flex items-center justify-center"
                    >
                      <CloseIcon
                        width={14}
                        height={14}
                        className="text-icon-neutral-secondary"
                      />
                    </span>
                  </span>
                ))}
              </div>
            )}
            <ChevronDownIcon
              width={10}
              height={5}
              className="text-icon-neutral-secondary mr-1 shrink-0"
            />
          </button>
        }
      />
    </div>
  );
}
