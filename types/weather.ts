import { useCallback, useState } from 'react';

type WeatherData = {
   temperature: number;
   weathercode: number;
   windspeed: number;
};

type DailyWeather = {
   date: string;
   maxTemp: number;
   minTemp: number;
   weathercode: number;
   precipitation: number; //강수량
};

export const useWeather = () => {
   const [weather, setWeather] = useState<WeatherData | null>(null);
   const [loading, setLoading] = useState(false);

   const fetchWeather = useCallback(async (lat: number, lng: number) => {
      setLoading(true);
      try {
         const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
         const response = await fetch(url);
         const data = await response.json();

         setWeather({
            temperature: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
            windspeed: data.current_weather.windspeed,
         });
      } catch (error) {
         console.error('Failed to fetch weather:', error);
      } finally {
         setLoading(false);
      }
   }, []);

   return { weather, loading, fetchWeather };
};

export const useWeeklyWeather = () => {
   const [weeklyWeather, setWeeklyWeather] = useState<DailyWeather[] | null>(null);
   const [loading, setLoading] = useState(false);

   const fetchWeeklyWeather = useCallback(async (lat: number, lng: number) => {
      setLoading(true);
      try {
         const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto`;
         const response = await fetch(url);
         const data = await response.json();

         const dailyData: DailyWeather[] = data.daily.time.map((date: string, index: number) => ({
            date: date,
            maxTemp: data.daily.temperature_2m_max[index],
            minTemp: data.daily.temperature_2m_min[index],
            weathercode: data.daily.weathercode,
            precipition: data.daily.precipitation_sum[index],
         }));

         setWeeklyWeather(dailyData);
      } catch (error) {
         console.error('Failed to fetch weekly weather:', error);
      } finally {
         setLoading(false);
      }
   }, []);

   return { weeklyWeather, loading, fetchWeeklyWeather };
};
