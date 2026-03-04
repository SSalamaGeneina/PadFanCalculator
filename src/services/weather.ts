export interface GeocodingResult {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  solarRadiation: number;
}

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: '8',
    language: 'en',
    format: 'json',
  });

  const res = await fetch(`${GEOCODING_URL}?${params}`);
  if (!res.ok) return [];

  const data = await res.json();
  if (!data.results) return [];

  return data.results.map((r: Record<string, unknown>) => ({
    name: r.name as string,
    country: r.country as string,
    admin1: r.admin1 as string | undefined,
    latitude: r.latitude as number,
    longitude: r.longitude as number,
  }));
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,shortwave_radiation',
  });

  const res = await fetch(`${WEATHER_URL}?${params}`);
  if (!res.ok) throw new Error('Weather API error');

  const data = await res.json();
  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    solarRadiation: data.current.shortwave_radiation,
  };
}

export async function getPeakSummerConditions(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const year = new Date().getFullYear() - 1;
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    start_date: `${year}-06-01`,
    end_date: `${year}-09-30`,
    daily: 'temperature_2m_max,shortwave_radiation_sum',
    hourly: 'relative_humidity_2m',
    timezone: 'auto',
  });

  try {
    const res = await fetch(`${ARCHIVE_URL}?${params}`);
    if (!res.ok) throw new Error('Archive API error');

    const data = await res.json();

    const maxTemp = Math.max(...(data.daily.temperature_2m_max as number[]));
    const maxSolar = Math.max(...(data.daily.shortwave_radiation_sum as number[]));

    const allHumidity = data.hourly.relative_humidity_2m as number[];
    const minHumidity = Math.min(...allHumidity.filter((h: number) => h > 0));

    return {
      temperature: Math.round(maxTemp * 10) / 10,
      humidity: Math.round(minHumidity),
      solarRadiation: Math.round((maxSolar / 24) * 10) / 10,
    };
  } catch {
    return { temperature: 48, humidity: 10, solarRadiation: 950 };
  }
}
