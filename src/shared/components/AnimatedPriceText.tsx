import { cn } from "@/shared/utils/cn";

interface AnimatedPriceTextProps {
  text: string;
  className?: string;
}

// 문자 단위로 key를 주어, 바뀐 자리만 다시 애니메이션되도록 함
export function AnimatedPriceText({ text, className }: AnimatedPriceTextProps) {
  return (
    <span className={cn("inline-flex", className)}>
      {text.split("").map((char, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <span
            key={char}
            className="animate-in slide-in-from-bottom-2 fade-in inline-block duration-300"
          >
            {char}
          </span>
        </span>
      ))}
    </span>
  );
}
