"use client";

import type { ComponentProps } from "react";
import SearchIcon from "@/assets/icons/fill/search.svg";
import { Input } from "@/shared/components/Input";

type SearchInputProps = Omit<ComponentProps<typeof Input>, "left" | "compact">;

export function SearchInput(props: SearchInputProps) {
  return (
    <Input compact left={<SearchIcon width={18} height={18} />} {...props} />
  );
}
