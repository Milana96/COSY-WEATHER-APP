import { useEffect, useMemo, useState } from "react";
import Button from "./components/Button";
import ButtonSecond from "./components/Button-Second";
import WeatherCanvas from "./components/WeatherCanvas";
import { getCityCoordinates, getWeatherByCoords, normalizeWeather } from "./weatherApi";

const DEFAULT_CITY = "Lisbon";

function StatCard({ label, value, unit = "" }) {
  return (
    <article className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">
        {value}
        {unit}
      </strong>
    </article>
  );
}

export default function App() {
  const [cityQuery, setCityQuery] = useState(DEFAULT_CITY);
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
      const geo = await getCityCoordinates(query);
      const raw = await getWeatherByCoords(geo.latitude, geo.longitude, "auto");
      const normalized = normalizeWeather(geo, raw);
      setWeather(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load weather");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(DEFAULT_CITY);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!cityQuery.trim()) return;
    fetchWeather(cityQuery.trim());
  };

  return (
    <main className={`app visual-${visualMode}`}>
      <WeatherCanvas
        visual={visualMode}
        weatherCode={weather?.current.weatherCode ?? 0}
        isDay={weather?.current.isDay ?? 1}
        sceneSeed={sceneSeed}
      />
      <div className="noise" />
      <section className="left-column panel">
        <header className="scene-header">
          <p className="mono-brand">COSY SKY STUDIO</p>
          <h1 className="scene-title">Live Weather Dimension</h1>
        </header>
        <footer className="scene-footer">
          <p>
            {weather?.city}, {weather?.country}
          </p>
          <p>{weather?.current.label}</p>
        </footer>
      </section>

      <aside className="right-column panel">
        <form className="search-form" onSubmit={onSubmit}>
          <label htmlFor="city">Find city</label>
          <div className="search-row">
            <input
              id="city"
              value={cityQuery}
              onChange={(event) => setCityQuery(event.target.value)}
              placeholder="Try Reykjavik, Nairobi, Kyoto..."
            />
            <button type="submit" disabled={loading}>
              {loading ? "Loading" : "Sync"}
            </button>
          </div>
        </form>

        {error && <p className="error-box">{error}</p>}

        {!error && weather && (
          <>
            <section className="reveal-1">
              <Button mode={visualMode} detail={weather.current.label} />
            </section>

            <section className="reveal-1">
              <ButtonSecond mode={visualMode} detail={weather.current.label} />
            </section>

            <section className="temperature-section reveal-1">
              <h2>
                {weather.current.temp}
                <span>°C</span>
              </h2>
              <p className="subtitle">Feels like {weather.current.feelsLike}°C</p>
              <p className="subtitle">{weather.current.label}</p>
            </section>

            <section className="stats-grid reveal-2">
              <StatCard label="Wind" value={weather.current.wind} unit=" km/h" />
              <StatCard label="Humidity" value={weather.current.humidity} unit="%" />
              <StatCard label="Sunrise" value={weather.current.sunrise} />
              <StatCard label="Sunset" value={weather.current.sunset} />
            </section>

            <section className="forecast reveal-3">
              <h3>Next hours</h3>
              <div className="hourly-row">
                {weather.hourlyForecast.map((item) => (
                  <article key={item.label} className="tiny-card">
                    <span>{item.label}</span>
                    <strong>{item.temp}°</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="forecast reveal-4">
              <h3>5-day outlook</h3>
              <div className="daily-list">
                {weather.dailyForecast.map((item) => (
                  <article key={item.dayLabel} className="day-item">
                    <span>{item.dayLabel}</span>
                    <strong>
                      {item.max}° / {item.min}°
                    </strong>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </aside>
    </main>
  );
}
