const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const weatherCodeMap = {
  clear: [0],
  cloudy: [1, 2, 3, 45, 48],
  rainy: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
  snowy: [71, 73, 75, 77, 85, 86],
  stormy: [95, 96, 99],
};

const weatherLabelMap = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Strong thunderstorm with hail",
};

const findVisualWeather = (code) => {
  if (weatherCodeMap.rainy.includes(code)) return "rainy";
  if (weatherCodeMap.cloudy.includes(code)) return "cloudy";
  if (weatherCodeMap.snowy.includes(code)) return "snowy";
  if (weatherCodeMap.stormy.includes(code)) return "stormy";
  return "clear";
};

const formatLocalTime = (iso, timezone, options) => {
  const dt = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    ...options,
  }).format(dt);
};

export async function getCityCoordinates(query) {
  const params = new URLSearchParams({
    name: query,
    count: "1",
    language: "en",
    format: "json",
  });

  const response = await fetch(`${GEO_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Could not geocode city");
  }

  const data = await response.json();
  if (!data.results || !data.results.length) {
    throw new Error("City not found");
  }

  return data.results[0];
}

export async function getWeatherByCoords(latitude, longitude, timezone = "auto") {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone,
    current: [
      "temperature_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
      "relative_humidity_2m",
      "is_day",
    ].join(","),
    hourly: ["temperature_2m", "weather_code"].join(","),
    daily: ["sunrise", "sunset", "temperature_2m_max", "temperature_2m_min"].join(","),
    forecast_days: "5",
  });

  const response = await fetch(`${WEATHER_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Could not fetch weather");
  }

  return response.json();
}

export function normalizeWeather(geo, weatherRaw) {
  const code = weatherRaw.current.weather_code;
  const timezone = weatherRaw.timezone;

  const dailyForecast = weatherRaw.daily.time.map((day, index) => ({
    dayLabel: formatLocalTime(`${day}T00:00:00`, timezone, { weekday: "short" }),
    max: Math.round(weatherRaw.daily.temperature_2m_max[index]),
    min: Math.round(weatherRaw.daily.temperature_2m_min[index]),
  }));

  const nowHourIndex = weatherRaw.hourly.time.findIndex((entry) =>
    entry.startsWith(weatherRaw.current.time.slice(0, 13))
  );

  const hourlyForecast = weatherRaw.hourly.time
    .slice(Math.max(nowHourIndex, 0), Math.max(nowHourIndex, 0) + 8)
    .map((time, idx) => ({
      label: idx === 0 ? "Now" : formatLocalTime(time, timezone, { hour: "numeric" }),
      temp: Math.round(weatherRaw.hourly.temperature_2m[idx + Math.max(nowHourIndex, 0)]),
      code: weatherRaw.hourly.weather_code[idx + Math.max(nowHourIndex, 0)],
    }));

  return {
    city: geo.name,
    country: geo.country,
    latitude: geo.latitude,
    longitude: geo.longitude,
    timezone,
    current: {
      temp: Math.round(weatherRaw.current.temperature_2m),
      feelsLike: Math.round(weatherRaw.current.apparent_temperature),
      weatherCode: code,
      label: weatherLabelMap[code] ?? "Unknown weather",
      visual: findVisualWeather(code),
      humidity: weatherRaw.current.relative_humidity_2m,
      wind: Math.round(weatherRaw.current.wind_speed_10m),
      isDay: weatherRaw.current.is_day,
      sunrise: formatLocalTime(weatherRaw.daily.sunrise[0], timezone, {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunset: formatLocalTime(weatherRaw.daily.sunset[0], timezone, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    dailyForecast,
    hourlyForecast,
  };
}
