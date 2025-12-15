"use client";

import { useEffect, useRef } from "react";
import { useMapStore } from "@/stores/map/store";
import { INITIAL_CENTER, INITIAL_ZOOM } from "@/types/maptype";

export default function MapCanvas() {
  const { map, setMap, isMapScriptLoaded, setMapContainerRef } = useMapStore();
  const internalMapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMapContainerRef(internalMapContainerRef);
    console.log("[MapCanvas] 로컬 ref를 Zustand 스토어에 전달.");

    return () => {
      setMapContainerRef({ current: null });
      console.log("[MapCanvas] 로컬 ref가 스토어에서 해제됨.");
    };
  }, [setMapContainerRef]);

  useEffect(() => {
    if (isMapScriptLoaded && internalMapContainerRef.current && !map) {
      console.log("[MapCanvas] 지도 인스턴스 초기화 시작 (MapCanvas).");
      const mapOptions = {
        center: new window.naver.maps.LatLng(...INITIAL_CENTER),
        zoom: INITIAL_ZOOM,
        minZoom: 9,
        scaleControl: false,
        mapDataControl: false,
        logoControlOptions: {
          position: window.naver.maps.Position.BOTTOM_LEFT,
        },
      };

      try {
        const naverMapInstance = new window.naver.maps.Map(
          internalMapContainerRef.current,
          mapOptions
        );
        setMap(naverMapInstance);
        console.log("[MapCanvas] 지도 인스턴스 생성 완료 및 Zustand에 저장.");
      } catch (error) {
        console.error("[MapCanvas] 지도 인스턴스 생성 중 에러 발생:", error);
      }
    }
  }, [isMapScriptLoaded, map, setMap]);

  return (
    <div
      ref={internalMapContainerRef}
      id="map-canvas"
      className="absolute inset-0 w-full h-full z-0"
    />
  );
}
