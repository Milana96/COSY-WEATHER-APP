import Button from "./Button";
import ButtonSecond from "./Button-Second";
import StatCard from "./StatCard";
import WeatherCanvas from "./WeatherCanvas";
import WeatherDebugPanel from "./WeatherDebugPanel";
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

      <aside className="right-column panel weather-panel">

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
            <WeatherDebugPanel weather={weather} visualMode={visualMode} />

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
