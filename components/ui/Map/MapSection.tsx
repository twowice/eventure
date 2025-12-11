'use client';
import { useWeather } from '@/types/weather';
import Map from './Map';
import { NaverMap } from '@/types/maptype';
import { getPM10Level, getPM25Level, useAirQuality } from '@/types/airquality';
import { useWeeklyWeather } from '@/types/weeklyWeather';
import { useState } from 'react';
import WeeklyWeatherModal from '@/feature/weeklyWeatherModal';

const MapSection = () => {
   const { weather, fetchWeather } = useWeather();
   const { airQuality, fetchAirQuality } = useAirQuality();
   const { weeklyWeather, fetchWeeklyWeather } = useWeeklyWeather();
   const [showWeeklyModal, setShowWeeklyModal] = useState(false);
   const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

   const handleMapLoad = (map: NaverMap) => {
      //초기 날씨 & 미세먼지
      const center = map.getCenter();
      const lat = center.lat();
      const lng = center.lng();

      setCurrentPosition({ lat, lng });
      fetchWeather(lat, lng);
      fetchAirQuality(lat, lng);

      //지도 이동시 업데이트
      naver.maps.Event.addListener(map, 'idle', () => {
         const newCenter = map.getCenter();
         const newLat = newCenter.lat();
         const newLng = newCenter.lng();

         setCurrentPosition({ lat: newLat, lng: newLng });
         fetchWeather(newLat, newLng);
         fetchAirQuality(newLat, newLng);
      });
   };

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
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
         <Map onLoad={handleMapLoad} />
         {/*날씨정보 */}
         {weather && (
            <div
               onClick={handleWeatherClick}
               style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  background: '#F1F5FA',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 100,
                  width: '150px',
                  height: '100px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
               }}
            >
               {/* 날씨 & 온도 */}
               <div
                  style={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     flexDirection: 'column',
                  }}
               >
                  <div style={{ width: '48px', height: '48px', border: '1px solid black' }}>
                     {/* <Icon24 weathercode={weather.weathercode} /> */}
                  </div>
                  <div style={{ fontSize: '16px' }}>{Math.round(weather.temperature)}°C</div>
               </div>
               {/* // 미세먼지 */}
               {airQuality && pm10Level && pm25Level && (
                  <div
                     style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        width: '60px',
                     }}
                  >
                     {/* 미세먼지 PM10 */}
                     <div
                        style={{
                           width: '100%',
                           flex: 1,
                           borderRight: `3px solid ${pm25Level.color}`,
                           textAlign: 'center',
                           fontSize: '16px',
                           borderRadius: '3px',
                        }}
                     >
                        미세
                     </div>

                     {/* 초미세먼지 PM25 */}
                     <div
                        style={{
                           width: '100%',
                           flex: 1,
                           borderRight: `3px solid ${pm25Level.color}`,
                           textAlign: 'center',
                           fontSize: '16px',
                           borderRadius: '3px',
                        }}
                     >
                        초미세
                     </div>
                  </div>
               )}
            </div>
         )}

         {/* 주간날씨모달 */}
         {showWeeklyModal && weeklyWeather && (
            <WeeklyWeatherModal weeklyWeather={weeklyWeather} onClose={() => setShowWeeklyModal(false)} />
         )}
      </div>
   );
};

export default MapSection;
