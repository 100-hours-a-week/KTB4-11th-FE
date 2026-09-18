"use client";

import { Switch } from "radix-ui";

interface AiDelegationSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function AiDelegationSwitch({
  checked,
  onCheckedChange,
}: AiDelegationSwitchProps) {
  return (
    <div className="bg-bg-layer-default flex flex-col gap-1 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="body-1-semibold">AI 자동매매</span>
        <div className="flex items-center gap-2">
          <span className="body-2-semibold text-text-neutral-primary">
            {checked ? "ON" : "OFF"}
          </span>
          <Switch.Root
            checked={checked}
            onCheckedChange={onCheckedChange}
            className="data-[state=checked]:bg-bg-accent relative h-7 w-12 rounded-full bg-gray-200 transition-colors"
          >
            <Switch.Thumb className="block size-5 translate-x-1 rounded-full bg-white transition-transform data-[state=checked]:translate-x-6" />
          </Switch.Root>
        </div>
      </div>
      <p className="body-2-regular text-text-neutral-secondary">
        {checked
          ? "투자 판단과 매매를 AI에게 전적으로 위임해요"
          : "투자 판단과 매매를 내가 직접 진행해요"}
      </p>
    </div>
  );
}
