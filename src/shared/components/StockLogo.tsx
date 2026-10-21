"use client";

import { useState } from "react";
import Image from "next/image";
import BuildingApartmentIcon from "@/assets/icons/fill/building-apartment.svg";
import { STOCK_LOGO_BASE_URL } from "@/shared/constants/stockLogo";
import { cn } from "@/shared/utils/cn";

interface StockLogoProps {
  code: string;
  className?: string;
}

export function StockLogo({ code, className }: StockLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span
        className={cn(
          "bg-sky-blue-50 flex shrink-0 items-center justify-center rounded-full",
          className,
        )}
      >
        <BuildingApartmentIcon
          width={20}
          height={20}
          className="text-icon-accent"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full",
        className,
      )}
    >
      <Image
        src={`${STOCK_LOGO_BASE_URL}/${code}.jpg`}
        alt=""
        fill
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </span>
  );
}
