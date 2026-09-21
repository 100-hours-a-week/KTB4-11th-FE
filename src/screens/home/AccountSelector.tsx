import ThreeDotHorizontalIcon from "@/assets/icons/fill/three-dot-horizontal.svg";
import UnfoldIcon from "@/assets/icons/fill/unfold.svg";

export function AccountSelector() {
  return (
    <div className="flex items-center justify-between py-3">
      <button type="button" className="flex items-center">
        <span className="border-border-neutral-tertiary mr-2 size-6 rounded-lg border border-dashed" />
        <span className="heading-1-semibold mr-1">기본계좌</span>
        <UnfoldIcon
          width={16}
          height={24}
          className="text-icon-neutral-strong"
        />
      </button>
      <button type="button">
        <ThreeDotHorizontalIcon
          width={24}
          height={24}
          className="text-icon-neutral-secondary"
        />
      </button>
    </div>
  );
}
