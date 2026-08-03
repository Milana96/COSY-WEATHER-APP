import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useSettingsForm from "../../hooks/useSettingsForm";
import useWeather from "../../hooks/useWeather";
import {
  convertTemperature,
  convertWindSpeed,
} from "../../helpers/weather/conversions";
import WeatherCanvas from "../weather/WeatherCanvas";
import Button from "../weather/Button";
import ButtonSecond from "../weather/Button-Second";
import StatCard from "../weather/StatCard";
import WeatherCoach from "../weather/WeatherCoach";
import "../weather/WeatherScreen.css";
import "../settings/SettingsScreen.css";

export default function DashboardDeck({ settings, onUpdateSettings }) {
  const location = useLocation();
  const [isSettingsActive, setIsSettingsActive] = useState(
    location.pathname === "/settings",
  );

  useEffect(() => {
    setIsSettingsActive(location.pathname === "/settings");
  }, [location.pathname]);

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

  const { locationValue, setLocationValue, onSaveDefaultLocation } =
    useSettingsForm(settings.defaultLocation, onUpdateSettings);

  const currentTemp = weather
    ? convertTemperature(weather.current.temp, settings.temperatureUnit)
    : null;
  const currentFeelsLike = weather
    ? convertTemperature(weather.current.feelsLike, settings.temperatureUnit)
    : null;
  const currentWind = weather
    ? convertWindSpeed(weather.current.wind, settings.windSpeedUnit)
    : null;

  const leftVisualMode = isSettingsActive ? "clear" : visualMode;

  return (
    <main
      className={`app ${isSettingsActive ? "settings-app" : ""} visual-${leftVisualMode}`}
    >
      <div className="app-backdrop">
        <WeatherCanvas
          visual={leftVisualMode}
          weatherCode={
            isSettingsActive ? 0 : (weather?.current.weatherCode ?? 0)
          }
          isDay={isSettingsActive ? 1 : (weather?.current.isDay ?? 1)}
          sceneSeed={isSettingsActive ? "settings" : sceneSeed}
        />
        <div className="noise" />
      </div>

      <div className="app-surface">
        <section className="hero-card panel">
          <div className="hero-copy">
            <p className="mono-brand">COSY SKY STUDIO</p>
            <h1 className="scene-title">
              {isSettingsActive
                ? "Tune Your Forecast Space"
                : "Live Weather Dimension"}
            </h1>
            <p className="hero-description">
              {isSettingsActive
                ? "Refine the forecast experience without losing sight of the weather scene."
                : "A calmer, more readable forecast view with the animation running softly behind every card."}
            </p>
          </div>

          <div className="hero-pill-group">
            <div className="hero-pill">
              <span>Locale</span>
              <strong>
                {weather
                  ? `${weather.city}, ${weather.country}`
                  : "Choose a city"}
              </strong>
            </div>
            <div className="hero-pill">
              <span>Status</span>
              <strong>
                {isSettingsActive
                  ? "Preferences"
                  : (weather?.current.label ?? "Awaiting update")}
              </strong>
            </div>
            {!isSettingsActive && currentTemp ? (
              <div className="hero-pill">
                <span>Now</span>
                <strong>
                  {currentTemp.value}
                  {currentTemp.label}
                </strong>
              </div>
            ) : null}
          </div>
        </section>

        <section className="content-card panel">
          {isSettingsActive ? (
            <div className="settings-stack">
              <section className="settings-group reveal-1">
                <h2>Temperature Unit</h2>
                <div className="settings-toggle-row">
                  <button
                    type="button"
                    className={`settings-pill ${settings.temperatureUnit === "celsius" ? "is-active" : ""}`}
                    onClick={() =>
                      onUpdateSettings({ temperatureUnit: "celsius" })
                    }
                  >
                    Celsius (°C)
                  </button>
                  <button
                    type="button"
                    className={`settings-pill ${settings.temperatureUnit === "fahrenheit" ? "is-active" : ""}`}
                    onClick={() =>
                      onUpdateSettings({ temperatureUnit: "fahrenheit" })
                    }
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </section>

              <section className="settings-group reveal-2">
                <h2>Wind Speed Unit</h2>
                <label htmlFor="wind-speed" className="settings-label">
                  Display wind speed as
                </label>
                <select
                  id="wind-speed"
                  className="settings-select"
                  value={settings.windSpeedUnit}
                  onChange={(event) =>
                    onUpdateSettings({ windSpeedUnit: event.target.value })
                  }
                >
                  <option value="kmh">km/h</option>
                  <option value="mph">mph</option>
                  <option value="ms">m/s</option>
                </select>
              </section>

              <section className="settings-group reveal-3">
                <h2>Default Location</h2>
                <form
                  className="settings-location-form"
                  onSubmit={onSaveDefaultLocation}
                >
                  <label htmlFor="default-location" className="settings-label">
                    Forecast loads this city on startup
                  </label>
                  <div className="search-row">
                    <input
                      id="default-location"
                      value={locationValue}
                      onChange={(event) => setLocationValue(event.target.value)}
                      placeholder="Lisbon"
                    />
                    <button type="submit">Save</button>
                  </div>
                </form>
              </section>

              <section className="settings-group reveal-4">
                <h2>Theme</h2>
                <div className="settings-toggle-row">
                  <button
                    type="button"
                    className={`settings-pill ${settings.theme === "dark" ? "is-active" : ""}`}
                    onClick={() => onUpdateSettings({ theme: "dark" })}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    className={`settings-pill ${settings.theme === "light" ? "is-active" : ""}`}
                    onClick={() => onUpdateSettings({ theme: "light" })}
                  >
                    Light
                  </button>
                </div>
              </section>
            </div>
          ) : (
            <>
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
                    <ButtonSecond
                      mode={visualMode}
                      detail={weather.current.label}
                    />
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
                    <StatCard
                      label="Wind"
                      value={currentWind?.value}
                      unit={` ${currentWind?.label}`}
                    />
                    <StatCard
                      label="Humidity"
                      value={weather.current.humidity}
                      unit="%"
                    />
                    <StatCard label="Sunrise" value={weather.current.sunrise} />
                    <StatCard label="Sunset" value={weather.current.sunset} />
                  </section>

                  <section className="forecast reveal-3">
                    <h3>Next hours</h3>
                    <div className="hourly-row">
                      {weather.hourlyForecast.map((item) => (
                        <article key={item.label} className="tiny-card">
                          <span>{item.label}</span>
                          <strong>
                            {
                              convertTemperature(
                                item.temp,
                                settings.temperatureUnit,
                              ).value
                            }
                            °
                          </strong>
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
                            {
                              convertTemperature(
                                item.max,
                                settings.temperatureUnit,
                              ).value
                            }
                            ° /{" "}
                            {
                              convertTemperature(
                                item.min,
                                settings.temperatureUnit,
                              ).value
                            }
                            °
                          </strong>
                        </article>
                      ))}
                    </div>
                  </section>

                  <WeatherCoach weather={weather} cityName={weather.city} />
                </>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
