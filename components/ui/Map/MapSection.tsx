// src/components/ui/Map/MapSection.tsx
"use client";
import { useWeather } from "@/types/weather";
// import Map from "./mapScriptLoader"; // ⭐️ 이 임포트 삭제
import { NaverMap } from "@/types/maptype";
import { getPM10Level, getPM25Level, useAirQuality } from "@/types/airquality";
import { useWeeklyWeather } from "@/types/weeklyWeather";
import { useState, useCallback, useRef, useEffect } from "react"; // 추가
import WeeklyWeatherModal from "@/feature/weeklyWeatherModal";
import { useMapStore } from "@/stores/map/store"; // ⭐️ Zustand 스토어 임포트

const MapSection = () => {
  // ⭐️ Zustand 스토어에서 map 인스턴스와 로드 상태 가져오기
  const map = useMapStore((state) => state.map);
  const isMapScriptLoaded = useMapStore((state) => state.isMapScriptLoaded);

  const { weather, fetchWeather } = useWeather();
  const { airQuality, fetchAirQuality } = useAirQuality();
  const { weeklyWeather, fetchWeeklyWeather } = useWeeklyWeather();
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 이 `handleMapLoad` 함수는 더 이상 `<Map />` 컴포넌트의 prop으로 사용되지 않습니다.
  // 대신, `MapSection` 내부에서 `useEffect`를 통해 지도 인스턴스에 리스너를 등록하는 방식으로 바꿉니다.
  /*
  const handleMapLoad = (map: NaverMap) => {
    // ... 기존 로직 (제거 또는 아래 useEffect 로직으로 통합)
  };
  */

  // ⭐️ API 호출 로직은 이제 `useEffect` 내부에서 지도 인스턴스에 접근할 때 사용
  //   const fetchMapData = useCallback(
  //     (lat: number, lng: number) => {
  //       setCurrentPosition({ lat, lng });
  //       fetchWeather(lat, lng);
  //       fetchAirQuality(lat, lng);
  //     },
  //     [fetchWeather, fetchAirQuality]
  //   );

  // ⭐️ `MapSection`이 마운트될 때, Zustand 스토어에서 받은 `map` 인스턴스에 이벤트 리스너를 등록합니다.
  const isListenerAddedRef = useRef(false); // 리스너가 추가되었는지 여부 플래그 (중복 등록 방지)

  useEffect(() => {
    // 지도가 로드되고, 스크립트도 로드되었으며, 리스너가 아직 추가되지 않았을 때만 실행
    if (!map || !isMapScriptLoaded || isListenerAddedRef.current) {
      console.log(
        "[MapSection UI] 지도 인스턴스 또는 스크립트 로드 대기 중이거나 리스너 이미 추가됨."
      );
      return;
    }

    console.log("[MapSection UI] 지도 인스턴스에 이벤트 리스너 등록 시작.");
    isListenerAddedRef.current = true; // 리스너 추가 플래그 설정

    // 초기 날씨 & 미세먼지 데이터 로드
    const center = map.getCenter();
    const lat = center.x; // NaverMap의 LatLng 객체는 x, y를 가집니다.
    const lng = center.y;
    //fetchMapData(lat, lng);

    // 지도 이동 시 업데이트 리스너 등록
    const listener = naver.maps.Event.addListener(map, "idle", () => {
      const newCenter = map.getCenter();
      const newLat = newCenter.x;
      const newLng = newCenter.y;

      console.log(
        `[MapSection UI] 지도 이동 완료 (idle). 새로운 좌표: ${newLat} \t ${newLng}`
      );

      // 이전 위치와 다를 때만 업데이트를 요청하여 불필요한 fetch 방지
      if (
        !currentPosition ||
        Math.abs(currentPosition.lat - newLat) > 0.0001 || // 0.0001도 이상 변화 시 (약 11m)
        Math.abs(currentPosition.lng - newLng) > 0.0001
      ) {
        //fetchMapData(newLat, newLng);
      }
    });

    return () => {
      // 컴포넌트 언마운트 또는 `map` 인스턴스 변경 시 리스너 제거 및 플래그 초기화
      console.log("[MapSection UI] Cleanup: 리스너 제거 및 플래그 초기화.");
      naver.maps.Event.removeListener(listener); // 등록된 리스너 제거
      isListenerAddedRef.current = false;
    };
  }, [map, isMapScriptLoaded, currentPosition]); // map, isMapScriptLoaded가 변경될 때마다 useEffect 실행

  const handleWeatherClick = () => {
    if (showWeeklyModal) {
      setShowWeeklyModal(false);
    } else {
      if (currentPosition) {
        fetchWeeklyWeather(currentPosition.lat, currentPosition.lng);
        setShowWeeklyModal(true);
      }
    }
  };

  const pm10Level = airQuality ? getPM10Level(airQuality.pm10) : null;
  const pm25Level = airQuality ? getPM25Level(airQuality.pm2_5) : null;

  return (
    // MapSection은 지도 위에 UI를 오버레이하는 역할만 합니다.
    // 지도 자체는 RootLayout에서 MapLoader (이전 map-canvas)가 렌더링합니다.
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      {/*날씨정보 */}
      {weather && (
        <div
          onClick={handleWeatherClick}
          className="absolute bottom-5 left-5 bg-[#F1F5FA] rounded shadow-[0_2px_8px_rgba(0,0,0,0.15)] w-[150px] h-[100px] flex gap-2 items-center justify-center cursor-pointer pointer-events-auto z-20"
        >
          {/* 날씨 & 온도 */}
          <div className="flex items-center justify-center flex-col">
            <div className="w-12 h-12 border border-black">
              {/* <Icon24 weathercode={weather.weathercode} /> */}
            </div>
            <div className="text-base">{Math.round(weather.temperature)}°C</div>
          </div>
          {/* // 미세먼지 */}
          {airQuality && pm10Level && pm25Level && (
            <div className="flex flex-col gap-3 w-[60px]">
              {/* 미세먼지 PM10 */}
              <div
                className="w-full flex-1 text-center text-base rounded-[3px]"
                style={{ borderRight: `3px solid ${pm25Level.color}` }}
              >
                미세
              </div>

              {/* 초미세먼지 PM25 */}
              <div
                className="w-full flex-1 text-center text-base rounded-[3px]"
                style={{ borderRight: `3px solid ${pm25Level.color}` }}
              >
                초미세
              </div>
            </div>
          )}
        </div>
      )}

      {/* 주간날씨모달 */}
      {showWeeklyModal && weeklyWeather && (
        <WeeklyWeatherModal
          weeklyWeather={weeklyWeather}
          onClose={() => setShowWeeklyModal(false)}
        />
      )}
    </div>
  );
};

export default MapSection;
