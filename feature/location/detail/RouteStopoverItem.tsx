const TYPE_LABEL: Record<number, string> = {
  1: "지하철",
  2: "버스",
  3: "도보",
};

export function RouteStopoverItem({
  leftLabel,
  mainText,
  rightText,
  accent,
}: {
  leftLabel: string; // "출발" | "도착" | "지하철" | "버스" | "2호선" 같은 라벨
  mainText: string; // "해운대해수욕장" | "수도권 1호선" 등
  rightText?: string; // "15:45" | "신도림행"
  accent?: boolean; // 강조(노선명 bold)
}) {
  return (
    <div className="grid grid-cols-[64px_1fr_auto] items-center gap-3 py-1">
      <span className="text-[12px] text-muted-foreground">{leftLabel}</span>

      <span
        className={
          accent
            ? "text-[12px] font-semibold opacity-70"
            : "text-[12px] font-semibold opacity-70"
        }
      >
        {mainText}
      </span>

      {rightText ? (
        <span className="text-[12px] text-muted-foreground whitespace-nowrap">
          {rightText}
        </span>
      ) : (
        <span />
      )}
    </div>
  );
}
