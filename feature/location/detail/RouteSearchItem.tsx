import { Button } from "@/components/ui/button";
import { Icon24 } from "@/components/icons/icon24";
import { Path } from "@/app/api/map/odsay/odsay";
import { RouteStopoverItem } from "./RouteStopoverItem";
import { makeRouteBarSegments, RouteProgressBar } from "./RouteProgressBar";

function formatKoreanTime(d: Date) {
  return d.toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function sumWalkTimeFromSubPath(path: Path) {
  return path.subPath
    .filter((s: any) => s.trafficType === 3)
    .filter((s: any) => !(s.distance === 0 && s.sectionTime === 0)) // 더미 제거
    .reduce((acc: number, s: any) => acc + (s.sectionTime ?? 0), 0);
}

function getProgressRatio(path: Path) {
  const total = path.info.totalTime || 1;
  const walk = sumWalkTimeFromSubPath(path);

  if (!walk || walk <= 0) return 0.7;
  const ratio = (total - walk) / total;
  return Math.min(0.95, Math.max(0.2, ratio));
}

function makeTransitRows(path: Path) {
  const transits = path.subPath
    .filter(
      (s: any) =>
        !(s.trafficType === 3 && s.distance === 0 && s.sectionTime === 0)
    )
    .filter((s: any) => s.trafficType === 1 || s.trafficType === 2);

  return transits.map((s: any) => {
    const lane0 = s.lane?.[0];

    const lineLabel =
      s.trafficType === 1
        ? lane0?.name ?? "지하철"
        : lane0?.busNo ?? lane0?.name ?? "버스";

    const stationName = s.startName ? `${s.startName}역` : "";

    const way = s.way ? `${s.way}행` : "";

    return { lineLabel, stationName, way };
  });
}

const PATH_TYPE_LABEL: Record<number, string> = {
  1: "지하철",
  2: "버스",
  3: "지하철+버스",
};

export function RouteSearchItem({
  index,
  path,
  fromName,
  toName,
  departAt = new Date(),
}: {
  index: number;
  path: Path;
  fromName: string;
  toName: string;
  departAt?: Date;
}) {
  const label =
    index === 0 ? "최적" : PATH_TYPE_LABEL[path.pathType] ?? "알 수 없음";

  const depart = departAt ?? new Date();
  const arrival = new Date(depart.getTime() + path.info.totalTime * 60 * 1000);

  const arrivalText = `${formatKoreanTime(arrival)} 도착`;
  const departText = formatKoreanTime(depart);

  const transitRows = makeTransitRows(path);

  const segments = makeRouteBarSegments(path);

  return (
    <div className="rounded-2xl bg-secondary/60 p-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-primary font-semibold">{label}</span>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold">
              {path.info.totalTime}
            </span>
            <span className="text-base font-medium">분</span>
          </div>

          <span className="text-muted-foreground font-medium">
            {arrivalText}
          </span>
        </div>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Icon24 name="go" className="h-6 w-6" />
        </Button>
      </div>

      {/* 진행 바 */}
      <RouteProgressBar segments={segments} />

      {/* 본문(출발/노선/도착) */}
      <div className="mt-4 space-y-1">
        <RouteStopoverItem
          leftLabel="출발"
          mainText={fromName}
          rightText={departText}
        />

        {transitRows.map((r, idx) => (
          <RouteStopoverItem
            key={`${r.lineLabel}-${r.stationName}-${idx}`}
            leftLabel={r.lineLabel} // ✅ 수도권 n호선이 “지하철” 자리로
            mainText={r.stationName} // ✅ 역 이름이 “수도권 n호선” 자리로
            rightText={r.way}
            accent
          />
        ))}

        <RouteStopoverItem leftLabel="도착" mainText={toName} />
      </div>
    </div>
  );
}
