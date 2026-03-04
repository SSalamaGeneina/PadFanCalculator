import { useState, useCallback, useRef } from 'react';
import {
  searchLocations,
  getCurrentWeather,
  getPeakSummerConditions,
} from '../services/weather';
import type { GeocodingResult, WeatherData } from '../services/weather';

export function useWeather() {
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const results = await searchLocations(query);
      setSuggestions(results);
    }, 300);
  }, []);

  const fetchWeather = useCallback(
    async (lat: number, lon: number, peakSummer = false) => {
      setLoading(true);
      try {
        const data = peakSummer
          ? await getPeakSummerConditions(lat, lon)
          : await getCurrentWeather(lat, lon);
        setWeatherData(data);
        return data;
      } catch {
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  return { suggestions, loading, weatherData, search, fetchWeather, clearSuggestions };
}
