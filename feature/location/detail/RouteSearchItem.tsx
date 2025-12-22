import { Path } from "@/app/api/map/odsay/odsay";
import { Icon24 } from "@/components/icons/icon24";
import { Button } from "@/components/ui/button";

const PATH_TYPE_MAP: { [key: number]: string } = {
  1: "지하철",
  2: "버스",
  3: "통합",
};

export const RouteSearchItem = ({
  index,
  path,
}: {
  index: number;
  path: Path;
}) => {
  const pathTypeString =
    index === 0 ? "최적" : PATH_TYPE_MAP[path.pathType] || "알 수 없음";

  const now = new Date();
  const arrivalTime = new Date(now.getTime() + path.info.totalTime * 60 * 1000);
  const arrivalTimeString = arrivalTime.toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="flex flex-col gap-2 bg-secondary p-4 rounded-lg">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4 items-center text-[12px]">
          <p className="font-semibold text-primary">{pathTypeString}</p>
          <div className="flex flex-row gap-1 items-center">
            <p className="font-bold text-[16px]">{path.info.totalTime}</p>
            <p>분</p>
          </div>
          <p className="text-opacity-80">{arrivalTimeString} 도착</p>
        </div>
        <Button variant={"ghost"} className="cursor-pointer">
          <Icon24 name={"go"} className="h-6 w-6" />
        </Button>
      </div>
      <div className="text-sm text-gray-500">
        {path.info.firstStartStation} → {path.info.lastEndStation}
      </div>
    </div>
  );
};
