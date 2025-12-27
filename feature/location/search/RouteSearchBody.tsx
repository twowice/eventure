import { Button } from "@/components/ui/button";
import { RouteSearchBar } from "./RouteSearchBar";
import { SearchState, useSearchStore } from "@/stores/map/seachstore";
import { useShallow } from "zustand/react/shallow";
import { RouteSearchHistoryItem } from "./RouteSearchHistory";
import { RouteSearchItem } from "../detail/RouteSearchItem";
import { getLoadlane, getTransPath } from "@/lib/map/odsay";
import { RouteDetailPopup } from "../detail/RouteDetailPopup";
import { useRef, useState } from "react";
import { useMapStore } from "@/stores/map/store";
import type { OdsayLoadLane } from "@/app/api/map/odsay/odsay";

export const RouteSearchBody = ({}: {}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { map, isMapScriptLoaded } = useMapStore();
  const activePolylineRef = useRef<any>(null);
  const {
    places,
    setRoutePoints,
    isDuringSearching,
    setIsDuringSearching,
    setIsAfterSearching,
    isAfterSearching,
    paths,
    setPaths,
  } = useSearchStore(
    useShallow((state: SearchState) => ({
      isDuringSearching: state.isDuringSearching,
      setIsDuringSearching: state.setIsDuringSearching,
      places: state.places,
      setRoutePoints: state.setRoutePoints,
      setIsAfterSearching: state.setIsAfterSearching,
      isAfterSearching: state.isAfterSearching,
      paths: state.paths,
      setPaths: state.setPaths,
    }))
  );

  const search = async () => {
    if (places.length < 2) {
      alert("출발지와 목적지를 모두 선택해주세요.");
      return;
    }

    setIsDuringSearching(true);
    try {
      const startPlace = places.find((p) => p.order === 1);
      const endPlace = places.find((p) => p.order === places.length);

      if (!startPlace || !endPlace) {
        alert("출발지 또는 목적지 정보가 부족합니다.");
        return;
      }
      const routeData = await getTransPath(startPlace, endPlace);

      console.log("길찾기 API 결과:", routeData);

      setPaths(routeData);
      setRoutePoints(places);
      setIsAfterSearching(true);
    } catch (error: any) {
      console.error("길찾기 중 오류 발생:", error.message);
      alert(`길찾기 실패: ${error.message}`);
      setRoutePoints([]);
    } finally {
      setIsDuringSearching(false);
    }
  };

  const drawLoadlane = async (mapObj: string) => {
    if (!map || !isMapScriptLoaded || !mapObj) return;

    const data = (await getLoadlane(mapObj)) as OdsayLoadLane;
    console.log("경로 그리기 API 결과:", data);
    const graphPositions =
      data?.result?.lane?.flatMap((lane) =>
        lane.section?.flatMap((section) => section.graphPos ?? [])
      ) ?? [];

    if (graphPositions.length === 0) return;

    const path = graphPositions.map(
      (pos) => new window.naver.maps.LatLng(pos.y, pos.x)
    );

    if (activePolylineRef.current) {
      activePolylineRef.current.setMap(null);
    }

    const polyline = new window.naver.maps.Polyline({
      map,
      path,
      strokeColor: "#007de4",
      strokeWeight: 5,
      strokeOpacity: 0.9,
    });

    activePolylineRef.current = polyline;
  };

  return (
    <div className="bg-white p-4 w-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <h1 className="text-[24px] font-semibold">길찾기</h1>
          <Button
            disabled={isDuringSearching || places.length < 2}
            onClick={search}
          >
            길찾기 {isDuringSearching ? "중..." : ""}
          </Button>
        </div>
        <RouteSearchBar order={1} total={2} />
        <RouteSearchBar order={2} total={2} />
      </div>

      <div className="flex flex-col gap-2">
        {isAfterSearching ? (
          paths?.result?.path?.map((path, index) => (
            <RouteDetailPopup
              key={`popup-${index}`}
              open={openIndex === index}
              onOpenChange={(isOpen) => setOpenIndex(isOpen ? index : null)}
            >
              <RouteSearchItem
                key={index}
                index={index}
                path={path}
                fromName={places.find((p) => p.order === 1)?.name ?? ""}
                toName={
                  places.find((p) => p.order === places.length)?.name ?? ""
                }
                onClick={() => {
                  setOpenIndex(index);
                  void drawLoadlane(path.info.mapObj);
                }}
              />
            </RouteDetailPopup>
          ))
        ) : (
          <RouteSearchHistoryItem
            order={1}
            departure="해운대 해수욕장"
            destination="벡스코"
          />
        )}
      </div>
    </div>
  );
};
