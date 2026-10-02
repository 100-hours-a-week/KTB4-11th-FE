import Image from "next/image";
import stockSpoonLogo from "@/assets/images/stockspoon-logo-full.png";

export function Splash() {
  return (
    <div className="bg-login-gradient flex h-full flex-col items-center justify-center">
      <Image
        src={stockSpoonLogo}
        alt="StockSpoon"
        className="h-24 w-auto animate-pulse"
        priority
      />
    </div>
  );
}
