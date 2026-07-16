import { useEffect, useMemo, useState } from "react";
import { fetchWeatherForApp } from "../services/weatherDataService";

export default function useWeather(defaultLocation) {
  const [cityQuery, setCityQuery] = useState(defaultLocation);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const visualMode = useMemo(() => weather?.current.visual ?? "clear", [weather]);
  const sceneSeed = useMemo(() => {
    if (!weather) return "0";
    return `${weather.latitude.toFixed(2)},${weather.longitude.toFixed(2)}`;
  }, [weather]);

  const fetchWeather = async (query) => {
    setLoading(true);
    setError("");

    try {
      setWeather(await fetchWeatherForApp(query));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load weather");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCityQuery(defaultLocation);
    fetchWeather(defaultLocation);
  }, [defaultLocation]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!cityQuery.trim()) return;
    fetchWeather(cityQuery.trim());
  };

  return {
    cityQuery,
    setCityQuery,
    weather,
    loading,
    error,
    visualMode,
    sceneSeed,
    onSubmit,
  };
}
