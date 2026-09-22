import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";

interface MenuRowProps {
  label: string;
  onClick?: () => void;
}

export function MenuRow({ label, onClick }: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between py-3"
    >
      <span className="body-1-semibold">{label}</span>
      <ChevronForwardIcon
        width={16}
        height={16}
        className="text-icon-neutral-secondary"
      />
    </button>
  );
}
