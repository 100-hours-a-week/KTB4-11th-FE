"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import DiscoverFilledIcon from "@/assets/icons/nav/filled/discover.svg";
import HeartFilledIcon from "@/assets/icons/nav/filled/heart.svg";
import HomeFilledIcon from "@/assets/icons/nav/filled/home.svg";
import TrophyFilledIcon from "@/assets/icons/nav/filled/trophy.svg";
import DiscoverOutlineIcon from "@/assets/icons/nav/outline/discover.svg";
import HeartOutlineIcon from "@/assets/icons/nav/outline/heart.svg";
import HomeOutlineIcon from "@/assets/icons/nav/outline/home.svg";
import TrophyOutlineIcon from "@/assets/icons/nav/outline/trophy.svg";
import { trackEvent } from "@/shared/utils/analytics";

const TABS = [
  {
    label: "홈",
    href: "/home",
    outlineIcon: HomeOutlineIcon,
    filledIcon: HomeFilledIcon,
    featureName: null,
  },
  {
    label: "관심",
    href: "/favorites",
    outlineIcon: HeartOutlineIcon,
    filledIcon: HeartFilledIcon,
    featureName: "favorites",
  },
  {
    label: "대결",
    href: "/competition",
    outlineIcon: TrophyOutlineIcon,
    filledIcon: TrophyFilledIcon,
    featureName: "competition",
  },
  {
    label: "발견",
    href: "/discover",
    outlineIcon: DiscoverOutlineIcon,
    filledIcon: DiscoverFilledIcon,
    featureName: "discover",
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
            featureName,
          }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);
            const Icon = isActive ? FilledIcon : OutlineIcon;
            const content = (
              <>
                <Icon
                  width={22}
                  height={22}
                  className={isActive ? "text-gray-900" : "text-gray-800"}
                />
                <span className="text-[10px] leading-[18px] font-medium tracking-[-0.4px] text-gray-800">
                  {label}
                </span>
              </>
            );

            if (featureName) {
              return (
                <button
                  key={href}
                  type="button"
                  onClick={() => {
                    trackEvent("unsupported_feature_click", {
                      feature_name: featureName,
                    });
                    toast.info(`${label} 페이지는 v2에서 이용할 수 있어요`);
                  }}
                  className="flex h-full w-15 flex-col items-center justify-center gap-0.5 rounded-full"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className="flex h-full w-15 flex-col items-center justify-center gap-0.5 rounded-full"
              >
                {content}
              </Link>
            );
          },
        )}
      </div>
    </div>
  );
}
