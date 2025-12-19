"use client";

import { panelstore } from "@/stores/panelstore";
import SlidePanel from "../slidepanel";

export default function LocationPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const { openpanel, setopenpanel } = panelstore();

  return (
    <SlidePanel
      isopen={openpanel === "location"}
      onclose={() => setopenpanel(null)}
      title="길찾기"
    >
      {children}
    </SlidePanel>
  );
}
