"use client";

import { InfomationPopup } from "@/components/popup/infomation";
import { panelstore } from "@/stores/panelstore";
import { cn } from "@/lib/utils";

export const RouteDetailPopup = ({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const { openpanel } = panelstore();
  const isLocationPanelOpen = openpanel === "location";

  return (
    <InfomationPopup
      dialogTrigger={children}
      title="test"
      hideOverlay
      position="top-left"
      preventOutsideClose
      allowOutsideInteraction
      open={open}
      onOpenChange={onOpenChange}
      className={cn(
        "w-[360px] md:w-[420px]",
        isLocationPanelOpen
          ? "left-[calc(4rem+25rem+24px)] md:left-[calc(5rem+37.5rem+24px)]"
          : "left-[calc(4rem+24px)] md:left-[calc(5rem+24px)]"
      )}
      body={
        <div>
          <p>테스트중입니다.</p>
        </div>
      }
    ></InfomationPopup>
  );
};
