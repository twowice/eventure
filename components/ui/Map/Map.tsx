// src/components/ui/Map/Map.tsx
"use client";

import {
  Coordinates,
  INITIAL_CENTER,
  INITIAL_ZOOM,
  NaverMap,
} from "@/types/maptype";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Props = {
  mapId?: string;
  initialCenter?: Coordinates;
  initialZoom?: number;
  onLoad?: (map: NaverMap) => void;
};

const Map = ({
  mapId = "map",
  initialCenter = INITIAL_CENTER,
  initialZoom = INITIAL_ZOOM,
  onLoad,
}: Props) => {
  const mapInstanceRef = useRef<NaverMap | null>(null);

  const initializeMap = () => {
    if (!window.naver || !window.naver.maps || mapInstanceRef.current) {
      console.log(
        "Map already initialized or Naver Maps SDK not fully ready on window."
      );
      return;
    }

    if (mapInstanceRef.current) {
      console.log(
        "3. initializeMap: 지도가 이미 생성되어 있습니다 (mapInstanceRef.current 존재)."
      ); // 새로 추가
      return;
    }

    console.log("Map initialized successfully"); // 초기화 로그는 한 번만 찍혀야 함

    const mapOptions = {
      center: new window.naver.maps.LatLng(...initialCenter),
      zoom: initialZoom,
      minZoom: 9,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };

    const map = new window.naver.maps.Map(mapId, mapOptions);
    mapInstanceRef.current = map;

    if (onLoad) {
      onLoad(map);
    }
  };

  // 컴포넌트가 언마운트될 때 지도 인스턴스 파괴
  useEffect(() => {
    console.log("[Map] Mouted");
    return () => {
      console.log("Map component unmounting: Destroying map instance.");
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Script
        strategy="afterInteractive" // 가장 빠르게 로드되도록
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}`}
        onReady={initializeMap} // 스크립트 로드 완료 시 initializeMap 호출
        onError={(e) => {
          console.error("Failed to load Naver Maps script:", e);
        }}
      />
      <div id={mapId} className="w-full h-full" />
    </>
  );
};

export default Map;
