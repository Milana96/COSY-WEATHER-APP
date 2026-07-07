import WeatherCanvas from "../weather/WeatherCanvas";
import useSettingsForm from "../../hooks/useSettingsForm";
import "./SettingsScreen.css";

export default function SettingsScreen({ settings, onUpdateSettings }) {
  const { locationValue, setLocationValue, onSaveDefaultLocation } = useSettingsForm(
    settings.defaultLocation,
    onUpdateSettings
  );

  return (
    <main className="app settings-app visual-clear">
      <section className="left-column panel settings-hero">
        <WeatherCanvas visual="clear" weatherCode={0} isDay={1} sceneSeed="settings" />
        <header className="scene-header">
          <p className="mono-brand">COSY SKY STUDIO</p>
          <h1 className="scene-title">Tune Your Forecast Space</h1>
        </header>
        <footer className="scene-footer">
          <p>Preferences sync automatically.</p>
          <p>Applies on your weather dashboard instantly.</p>
        </footer>
      </section>

      <aside className="right-column panel settings-panel">
        <section className="settings-group reveal-1">
          <h2>Temperature Unit</h2>
          <div className="settings-toggle-row">
            <button
              type="button"
              className={`settings-pill ${settings.temperatureUnit === "celsius" ? "is-active" : ""}`}
              onClick={() => onUpdateSettings({ temperatureUnit: "celsius" })}
            >
              Celsius (°C)
            </button>
            <button
              type="button"
              className={`settings-pill ${settings.temperatureUnit === "fahrenheit" ? "is-active" : ""}`}
              onClick={() => onUpdateSettings({ temperatureUnit: "fahrenheit" })}
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
            onChange={(event) => onUpdateSettings({ windSpeedUnit: event.target.value })}
          >
            <option value="kmh">km/h</option>
            <option value="mph">mph</option>
            <option value="ms">m/s</option>
          </select>
        </section>

        <section className="settings-group reveal-3">
          <h2>Default Location</h2>
          <form className="settings-location-form" onSubmit={onSaveDefaultLocation}>
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
      </aside>
    </main>
  );
}
