"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DiscoverFilledIcon from "@/assets/icons/nav/filled/discover.svg";
import HeartFilledIcon from "@/assets/icons/nav/filled/heart.svg";
import HomeFilledIcon from "@/assets/icons/nav/filled/home.svg";
import TrophyFilledIcon from "@/assets/icons/nav/filled/trophy.svg";
import DiscoverOutlineIcon from "@/assets/icons/nav/outline/discover.svg";
import HeartOutlineIcon from "@/assets/icons/nav/outline/heart.svg";
import HomeOutlineIcon from "@/assets/icons/nav/outline/home.svg";
import TrophyOutlineIcon from "@/assets/icons/nav/outline/trophy.svg";

const TABS = [
  {
    label: "홈",
    href: "/home",
    outlineIcon: HomeOutlineIcon,
    filledIcon: HomeFilledIcon,
  },
  {
    label: "관심",
    href: "/favorites",
    outlineIcon: HeartOutlineIcon,
    filledIcon: HeartFilledIcon,
  },
  {
    label: "대결",
    href: "/competition",
    outlineIcon: TrophyOutlineIcon,
    filledIcon: TrophyFilledIcon,
  },
  {
    label: "발견",
    href: "/discover",
    outlineIcon: DiscoverOutlineIcon,
    filledIcon: DiscoverFilledIcon,
  },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
      <div className="bg-bg-layer-floating/80 flex h-16 items-center gap-2 rounded-full px-7 py-1 shadow-[0px_6px_24px_0px_rgba(0,0,0,0.16)] backdrop-blur-md">
        {TABS.map(
          ({
            label,
            href,
            outlineIcon: OutlineIcon,
            filledIcon: FilledIcon,
          }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);
            const Icon = isActive ? FilledIcon : OutlineIcon;

            return (
              <Link
                key={href}
                href={href}
                className="flex h-full w-15 flex-col items-center justify-center gap-0.5 rounded-full"
              >
                <Icon
                  width={22}
                  height={22}
                  className={isActive ? "text-gray-900" : "text-gray-800"}
                />
                <span className="text-[10px] leading-[18px] font-medium tracking-[-0.4px] text-gray-800">
                  {label}
                </span>
              </Link>
            );
          },
        )}
      </div>
    </div>
  );
}
