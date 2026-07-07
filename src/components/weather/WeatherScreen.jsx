import { Link } from "react-router-dom";
import Button from "./Button";
import ButtonSecond from "./Button-Second";
import StatCard from "./StatCard";
import WeatherCanvas from "./WeatherCanvas";
import { convertTemperature, convertWindSpeed } from "../../helpers/weather/conversions";
import useWeather from "../../hooks/useWeather";
import "./WeatherScreen.css";

export default function WeatherScreen({ settings }) {
  const {
    cityQuery,
    setCityQuery,
    weather,
    loading,
    error,
    visualMode,
    sceneSeed,
    onSubmit,
  } = useWeather(settings.defaultLocation);

  const currentTemp = weather ? convertTemperature(weather.current.temp, settings.temperatureUnit) : null;
  const currentFeelsLike = weather
    ? convertTemperature(weather.current.feelsLike, settings.temperatureUnit)
    : null;
  const currentWind = weather ? convertWindSpeed(weather.current.wind, settings.windSpeedUnit) : null;

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
        <div className="top-actions">
          <Link to="/settings" className="icon-link" aria-label="Open settings">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20 13.1v-2.2l-2-0.5c-0.2-0.6-0.5-1.2-0.9-1.8l1.1-1.8-1.5-1.6-1.9 1c-0.5-0.3-1.1-0.5-1.7-0.7L12.6 3h-2.2l-0.5 2.1c-0.6 0.2-1.2 0.4-1.7 0.7l-1.9-1-1.6 1.6 1.1 1.8c-0.4 0.6-0.7 1.2-0.9 1.8L3 10.9v2.2l2 0.5c0.2 0.6 0.5 1.2 0.9 1.8l-1.1 1.8 1.6 1.6 1.9-1c0.5 0.3 1.1 0.5 1.7 0.7l0.5 2.1h2.2l0.5-2.1c0.6-0.2 1.2-0.4 1.7-0.7l1.9 1 1.5-1.6-1.1-1.8c0.4-0.6 0.7-1.2 0.9-1.8l2-0.5zM11.5 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
            </svg>
            <span>Settings</span>
          </Link>
        </div>

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
                {currentTemp?.value}
                <span>{currentTemp?.label}</span>
              </h2>
              <p className="subtitle">
                Feels like {currentFeelsLike?.value}
                {currentFeelsLike?.label}
              </p>
              <p className="subtitle">{weather.current.label}</p>
            </section>

            <section className="stats-grid reveal-2">
              <StatCard label="Wind" value={currentWind?.value} unit={` ${currentWind?.label}`} />
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
                    <strong>{convertTemperature(item.temp, settings.temperatureUnit).value}°</strong>
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
                      {convertTemperature(item.max, settings.temperatureUnit).value}° / {convertTemperature(item.min, settings.temperatureUnit).value}°
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
