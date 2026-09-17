import { Suspense } from "react";
import { CallbackHandler } from "@/features/auth/components/CallbackHandler";

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
