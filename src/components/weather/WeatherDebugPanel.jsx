import { weatherDataDebugConfig } from "../../services/weatherDataService";

export default function WeatherDebugPanel({ weather, visualMode }) {
  const modeLabel = weatherDataDebugConfig.useMockData ? "OFFLINE MOCK" : "LIVE API";
  const activeDataSource = weather?.dataSource === "live" ? "LIVE" : "SIMULATION";

  return (
    <section className="weather-debug-card reveal-1" aria-label="Weather simulation debug panel">
      <header className="weather-debug-card__header">
        <h3>Simulation Debug</h3>
        <span className={`weather-debug-pill ${weatherDataDebugConfig.useMockData ? "is-mock" : "is-live"}`}>
          {modeLabel}
        </span>
      </header>

      <div className="weather-debug-grid">
        <p>
          <span>Visual mode</span>
          <strong>{visualMode}</strong>
        </p>
        <p>
          <span>Weather profile</span>
          <strong>{weather?.current?.label ?? "Not loaded"}</strong>
        </p>
        <p>
          <span>Active data source</span>
          <strong>{activeDataSource}</strong>
        </p>
        <p>
          <span>Weather code</span>
          <strong>{weather?.current?.weatherCode ?? "-"}</strong>
        </p>
        <p>
          <span>Simulation speed (sec)</span>
          <strong>{weatherDataDebugConfig.simulationSpeedSec}</strong>
        </p>
        <p>
          <span>Simulation city</span>
          <strong>{weatherDataDebugConfig.simulatedCity}</strong>
        </p>
        <p>
          <span>Simulation location</span>
          <strong>{weatherDataDebugConfig.simulationLocation}</strong>
        </p>
      </div>
    </section>
  );
}
