import { Suspense } from "react";
import { Splash } from "@/shared/components/Splash";
import { DiscoverContainer } from "@/screens/discover/DiscoverContainer";

export default function DiscoverPage() {
  return (
    <Suspense fallback={<Splash />}>
      <DiscoverContainer />
    </Suspense>
  );
}
