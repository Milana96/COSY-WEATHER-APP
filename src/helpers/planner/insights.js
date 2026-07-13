import { convertTemperature } from "../weather/conversions";

const RAINY_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
const STORMY_CODES = [95, 96, 99];
const SNOWY_CODES = [71, 73, 75, 77, 85, 86];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getWeatherPenalty = (code) => {
  if (STORMY_CODES.includes(code)) return 38;
  if (RAINY_CODES.includes(code)) return 24;
  if (SNOWY_CODES.includes(code)) return 18;
  return 0;
};

const getComfortLabel = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 45) return "Fair";
  return "Challenging";
};

const createPackingList = (current) => {
  const list = ["Water bottle"];

  if (current.temp <= 8) list.push("Warm jacket");
  if (current.temp > 8 && current.temp <= 16) list.push("Light layers");
  if (current.wind >= 22) list.push("Windproof outer layer");
  if (current.humidity >= 75) list.push("Breathable fabric");
  if (RAINY_CODES.includes(current.weatherCode) || STORMY_CODES.includes(current.weatherCode)) {
    list.push("Umbrella or rain shell");
  }
  if (SNOWY_CODES.includes(current.weatherCode)) list.push("Non-slip footwear");

  return Array.from(new Set(list));
};

const getBestOutdoorHour = (hourlyForecast) => {
  if (!hourlyForecast?.length) return null;

  const ranked = hourlyForecast.map((entry) => {
    const thermalPenalty = Math.abs(entry.temp - 21) * 1.7;
    const weatherPenalty = getWeatherPenalty(entry.code);

    return {
      ...entry,
      score: thermalPenalty + weatherPenalty,
    };
  });

  ranked.sort((a, b) => a.score - b.score);
  return ranked[0];
};

const getDailySignal = (day) => {
  const spread = day.max - day.min;

  if (day.max >= 31) {
    return "Heat-heavy day. Plan shaded or indoor slots in afternoon.";
  }

  if (day.min <= 2) {
    return "Cold start and end. Schedule key activities around midday.";
  }

  if (spread >= 12) {
    return "Large temperature swing. Bring easy-to-remove layers.";
  }

  return "Stable conditions. Good for longer outdoor plans.";
};

export const generatePlannerInsights = (weather, settings) => {
  if (!weather) return null;

  const comfortRaw =
    100 -
    Math.abs(weather.current.temp - 21) * 2.2 -
    Math.max(0, weather.current.wind - 18) * 1.4 -
    Math.abs(weather.current.humidity - 50) * 0.45 -
    getWeatherPenalty(weather.current.weatherCode);

  const comfortScore = clamp(Math.round(comfortRaw), 0, 100);
  const bestHour = getBestOutdoorHour(weather.hourlyForecast);
  const bestHourTemp = bestHour ? convertTemperature(bestHour.temp, settings.temperatureUnit) : null;

  return {
    comfortScore,
    comfortLabel: getComfortLabel(comfortScore),
    bestHourLabel: bestHour?.label ?? "Unavailable",
    bestHourTemp,
    packingList: createPackingList(weather.current),
    dailySignals: weather.dailyForecast.map((day) => ({
      dayLabel: day.dayLabel,
      maxTemp: convertTemperature(day.max, settings.temperatureUnit),
      minTemp: convertTemperature(day.min, settings.temperatureUnit),
      signal: getDailySignal(day),
    })),
  };
};
