// src/components/ui/Map/MapSection.tsx
'use client';
import { useWeather } from '@/types/weather';
import { getPM10Level, getPM25Level, useAirQuality } from '@/types/airquality';
import { useWeeklyWeather } from '@/types/weeklyWeather';
import { useState, useCallback, useRef, useEffect } from 'react';
import WeeklyWeatherModal from '@/feature/map/weeklyWeatherModal';
import { useMapStore } from '@/stores/map/store';
import { panelstore } from '@/stores/panelstore';
import { WeatherIcon } from '@/feature/map/weatherIcon';
import { Button } from '../button';
import { supabase } from '@/lib/clientSupabase';

const REGION_NAME = {
   all: null,
   seoul: '서울',
   incheon: '인천',
   daejeon: '대전',
   daegu: '대구',
   gwangju: '광주',
   busan: '부산',
   ulsan: '울산',
   sejong: '세종',
   gyeonggi: '경기',
   gangwon: '강원',
   chungbuk: '충청북도',
   chungnam: '충청남도',
   gyeongbuk: '경상북도',
   gyeongnam: '경상남도',
   jeonbuk: '전북',
   jeonnam: '전남',
   jeju: '제주',
} as const;

const MapSection = () => {
   const map = useMapStore(state => state.map);
   const isMapScriptLoaded = useMapStore(state => state.isMapScriptLoaded);
   const isInitialFetchDone = useRef(false);
   const openpanel = panelstore(state => state.openpanel);
   const lastPanelShiftRef = useRef(0);
   const lastPanelOpenRef = useRef(false);

   const { weather, fetchWeather } = useWeather();
   const { airQuality, fetchAirQuality } = useAirQuality();
   const { weeklyWeather, fetchWeeklyWeather } = useWeeklyWeather();
   const [showWeeklyModal, setShowWeeklyModal] = useState(false);
   const [selectedRegion, setSelectedRegion] = useState<keyof typeof REGION_CODES | null>('all');
   const [currentPosition, setCurrentPosition] = useState<{
      lat: number;
      lng: number;
   } | null>(null);

   const markersRef = useRef<naver.maps.Marker[]>([]);

   const fetchMapData = useCallback(
      (lat: number, lng: number) => {
         setCurrentPosition({ lat, lng });
         fetchWeather(lat, lng);
         fetchAirQuality(lat, lng);
      },
      [fetchWeather, fetchAirQuality], // fetchWeather, fetchAirQuality가 변경될 때마다 함수 재생성 (안정적)
   );
   const isListenerAddedRef = useRef(false);

   useEffect(() => {
      if (!map || !isMapScriptLoaded) return;

      map.setZoom(7);
   }, [map, isMapScriptLoaded]);

   useEffect(() => {
      if (!map || !isMapScriptLoaded) return;

      map.setZoom(7);

      async function loadMarkers() {
         try {
            // 기존 마커 모두 제거
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];

            // 선택 해제된 경우 마커 미표시
            if (selectedRegion === null) {
               console.log('필터 해제 - 마커 미표시');
               return;
            }

            //supabase에서 이벤트 가져오기
            let query = supabase.from('events').select('*');

            //지역 필터링
            if (selectedRegion !== 'all') {
               const regionName = REGION_NAME[selectedRegion];
               if (regionName) {
                  query = query.like('address', `${regionName}%`);
               }
            }

            const { data: events, error } = await query;

            if (error) {
               console.error('이벤트 로드 실패:', error);
               return;
            }

            if (!events || events.length === 0) {
               console.log('표시할 이벤트가 없습니다.');
               return;
            }

            console.log(`${events.length}개의 이벤트 마커 표시`);

            // 마커 생성
            events.forEach((event: any) => {
               if (!event.latitude || !event.longitude) {
                  console.warn('좌표 없음:', event.title);
                  return;
               }

               const marker = new naver.maps.Marker({
                  position: new naver.maps.LatLng(event.latitude, event.longitude),
                  map: map,
                  title: event.title || '이벤트',
                  icon: {
                     url: '/marker/normal.png',
                     scaledSize: new naver.maps.Size(12, 16),
                     anchor: new naver.maps.Point(6, 16),
                  },
               });

               // 마커 클릭 이벤트
               naver.maps.Event.addListener(marker, 'click', () => {
                  console.log('클릭된 이벤트:', event.title, event.id);
                  //todo eventpanel 열기
               });
               markersRef.current.push(marker);
            });
         } catch (error) {
            console.error('마커 표시 중 오류:', error);
         }
      }

      loadMarkers();
   }, [map, isMapScriptLoaded, selectedRegion]);

   useEffect(() => {
      if (!map || !isMapScriptLoaded) {
         console.log('[MapSection UI] 지도 인스턴스 또는 스크립트 로드 대기 중.');
         return;
      }

      if (!isInitialFetchDone.current) {
         const initialCenter = map.getCenter();
         const initialLat = initialCenter.y;
         const initialLng = initialCenter.x;
         console.log('[MapSection UI] 초기 맵 로드 시 fetchMapData 호출:', initialLat, initialLng);
         fetchMapData(initialLat, initialLng);
         isInitialFetchDone.current = true;
      }

      if (isListenerAddedRef.current) {
         console.log('[MapSection UI] 리스너 이미 추가됨. 재등록 방지.');
         return;
      }

      console.log('[MapSection UI] 지도 인스턴스에 이벤트 리스너 등록 시작.');
      isListenerAddedRef.current = true;

      const listener = naver.maps.Event.addListener(map, 'idle', () => {
         const newCenter = map.getCenter();
         const newLat = newCenter.y;
         const newLng = newCenter.x;

         console.log(`[MapSection UI] 지도 이동 완료 (idle). 새로운 좌표: ${newLat} \t ${newLng}`);

         if (
            !currentPosition ||
            Math.abs(currentPosition.lat - newLat) > 0.0001 ||
            Math.abs(currentPosition.lng - newLng) > 0.0001
         ) {
            fetchMapData(newLat, newLng); // ⭐️ 3. 지도 이동 조건 충족 시 fetchMapData 호출
         } else {
            console.log('[MapSection UI] 지도 위치 변화 미미. API 호출 건너뜀.');
         }
      });

      return () => {
         console.log('[MapSection UI] Cleanup: 리스너 제거 및 플래그 초기화.');
         if (listener && naver.maps.Event.removeListener) {
            naver.maps.Event.removeListener(listener);
         }
         isListenerAddedRef.current = false;
      };
   }, [map, isMapScriptLoaded, currentPosition, fetchMapData]); // ⭐️ 의존성 배열에 fetchMapData 추가

   useEffect(() => {
      if (!map || !isMapScriptLoaded) return;

      const isPanelOpen = Boolean(openpanel);
      if (isPanelOpen === lastPanelOpenRef.current) return;

      if (isPanelOpen) {
         const openPanelEl = document.querySelector(
            '[data-panel-root="true"][data-panel-open="true"]',
         ) as HTMLElement | null;
         const panelWidth = openPanelEl?.getBoundingClientRect().width ?? 0;
         const shiftX = Math.round(panelWidth / 2);
         if (shiftX > 0 && map.panBy) {
            // 왼쪽 패널이 열리면 우측 영역이 중심이 되도록 왼쪽으로 이동
            map.panBy(-shiftX, 0);
            lastPanelShiftRef.current = shiftX;
         }
      } else if (lastPanelShiftRef.current > 0 && map.panBy) {
         map.panBy(lastPanelShiftRef.current, 0);
         lastPanelShiftRef.current = 0;
      }

      lastPanelOpenRef.current = isPanelOpen;
   }, [map, isMapScriptLoaded, openpanel]);

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

   const handleRegion = (region: keyof typeof REGION_NAME) => {
      if (selectedRegion === region) {
         setSelectedRegion(null);
         console.log('필터 해제');
      } else {
         setSelectedRegion(region);
         console.log('선택된 지역:', region, '코드:', REGION_NAME[region]);
      }
   };

   return (
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
         {/* 필터 */}
         <div className="absolute top-5 left-5 rounded-md z-20 cursor-pointer pointer-events-auto gap-2 flex">
            <Button
               variant={selectedRegion === 'all' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('all')}
            >
               전체
            </Button>
            <Button
               variant={selectedRegion === 'seoul' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('seoul')}
            >
               서울
            </Button>
            <Button
               variant={selectedRegion === 'incheon' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('incheon')}
            >
               인천
            </Button>
            <Button
               variant={selectedRegion === 'daejeon' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('daejeon')}
            >
               대전
            </Button>
            <Button
               variant={selectedRegion === 'daegu' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('daegu')}
            >
               대구
            </Button>
            <Button
               variant={selectedRegion === 'gwangju' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('gwangju')}
            >
               광주
            </Button>
            <Button
               variant={selectedRegion === 'busan' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('busan')}
            >
               부산
            </Button>
            <Button
               variant={selectedRegion === 'ulsan' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('ulsan')}
            >
               울산
            </Button>
            <Button
               variant={selectedRegion === 'sejong' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('sejong')}
            >
               세종
            </Button>
            <Button
               variant={selectedRegion === 'gyeonggi' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('gyeonggi')}
            >
               경기
            </Button>
            <Button
               variant={selectedRegion === 'gangwon' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('gangwon')}
            >
               강원
            </Button>
            <Button
               variant={selectedRegion === 'chungbuk' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('chungbuk')}
            >
               충북
            </Button>
            <Button
               variant={selectedRegion === 'chungnam' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('chungnam')}
            >
               충남
            </Button>
            <Button
               variant={selectedRegion === 'gyeongbuk' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('gyeongbuk')}
            >
               경북
            </Button>
            <Button
               variant={selectedRegion === 'gyeongnam' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('gyeongnam')}
            >
               경남
            </Button>
            <Button
               variant={selectedRegion === 'jeonbuk' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('jeonbuk')}
            >
               전북
            </Button>
            <Button
               variant={selectedRegion === 'jeonnam' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('jeonnam')}
            >
               전남
            </Button>
            <Button
               variant={selectedRegion === 'jeju' ? 'default' : 'outline'}
               className="rounded-3xl min-w-[60px]"
               onClick={() => handleRegion('jeju')}
            >
               제주
            </Button>
         </div>
         {/* 날씨정보 */}
         {weather && (
            <div
               onClick={handleWeatherClick}
               className="absolute bottom-5 left-5 bg-[#F1F5FA] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.15)] px-2 py-3 flex gap-1 items-center justify-center pointer-events-auto z-20 cursor-pointer border"
            >
               <div className="flex items-center justify-center flex-col gap-2">
                  <WeatherIcon weatherCode={weather.weathercode} className="w-8 h-8" />
                  <div className="text-sm">{Math.round(weather.temperature)}°C</div>
               </div>
               {airQuality && pm10Level && pm25Level && (
                  <div className="flex flex-col gap-3 w-12">
                     <div
                        className="w-full flex-1 text-center text-xs rounded-[3px]"
                        style={{ borderRight: `3px solid ${pm25Level.color}` }}
                     >
                        미세
                     </div>
                     <div
                        className="w-full flex-1 text-center text-xs rounded-[3px]"
                        style={{ borderRight: `3px solid ${pm25Level.color}` }}
                     >
                        초미세
                     </div>
                  </div>
               )}
            </div>
         )}
         {showWeeklyModal && weeklyWeather && (
            <WeeklyWeatherModal
               weeklyWeather={weeklyWeather}
               onClose={() => setShowWeeklyModal(false)}
               currentPosition={currentPosition}
            />
         )}
      </div>
   );
};

export default MapSection;
