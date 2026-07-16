import {
  getCityCoordinates,
  getWeatherByCoords,
  normalizeWeather,
  normalizeWeatherFromSimulation,
} from "../weatherApi";

const parseBooleanEnv = (rawValue, fallback = false) => {
  if (typeof rawValue !== "string") return fallback;
  const normalized = rawValue.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
};

const useMockData = parseBooleanEnv(import.meta.env.VITE_USE_MOCK_DATA, false);
const mockDataPath = import.meta.env.VITE_SIM_WEATHER_FILE || "/weather-simulation.json";
const simulatedCity = import.meta.env.VITE_SIMULATED_CITY || "Adventure Town";
const simulationLocation = import.meta.env.VITE_SIMULATION_LOCATION || "Unknown";

const parseNumberEnv = (rawValue, fallback) => {
  const numeric = Number(rawValue);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const simulationSpeedSec = parseNumberEnv(import.meta.env.VITE_SIMULATION_SPEED_SEC, 10);

const normalizeCityKey = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const shouldUseSimulationForQuery = (query) => {
  if (!useMockData) return false;

  const normalizedQuery = normalizeCityKey(query);
  if (!normalizedQuery) return true;

  return normalizedQuery === normalizeCityKey(simulatedCity);
};

const fetchMockWeather = async (query) => {
  const response = await fetch(mockDataPath, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Could not load simulated weather data");
  }

  const payload = await response.json();
  const cityName = typeof query === "string" && query.trim() ? query.trim() : simulatedCity;
  return normalizeWeatherFromSimulation(payload, cityName);
};

const fetchLiveWeather = async (query) => {
  const geo = await getCityCoordinates(query);
  const raw = await getWeatherByCoords(geo.latitude, geo.longitude, "auto");
  return normalizeWeather(geo, raw);
};

export async function fetchWeatherForApp(query) {
  if (shouldUseSimulationForQuery(query)) {
    const simulated = await fetchMockWeather(query);
    return {
      ...simulated,
      dataSource: "mock",
    };
  }

  try {
    const live = await fetchLiveWeather(query);
    return {
      ...live,
      dataSource: "live",
    };
  } catch (error) {
    if (!useMockData) {
      throw error;
    }

    const simulated = await fetchMockWeather(query);
    return {
      ...simulated,
      dataSource: "mock",
    };
  }
}

export const weatherDataDebugConfig = {
  useMockData,
  simulationSpeedSec,
  simulationLocation,
  simulatedCity,
  mockDataPath,
};

export { useMockData };
