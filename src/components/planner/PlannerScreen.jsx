import WeatherCanvas from "../weather/WeatherCanvas";
import useWeather from "../../hooks/useWeather";
import usePlannerAdvice from "../../hooks/usePlannerAdvice";
import "./PlannerScreen.css";

export default function PlannerScreen({ settings }) {
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

  const planner = usePlannerAdvice(weather, settings);

  return (
    <main className={`app visual-${visualMode}`}>
      <WeatherCanvas
        visual={visualMode}
        weatherCode={weather?.current.weatherCode ?? 0}
        isDay={weather?.current.isDay ?? 1}
        sceneSeed={`${sceneSeed}-planner`}
      />
      <div className="noise" />

      <section className="left-column panel">
        <header className="scene-header">
          <p className="mono-brand">COSY SKY STUDIO</p>
          <h1 className="scene-title">Daily Planner</h1>
        </header>
        <footer className="scene-footer">
          <p>Plan your day around comfort and weather shifts.</p>
          <p>Suggestions adapt to your unit preferences.</p>
        </footer>
      </section>

      <aside className="right-column panel planner-panel">
        <form className="search-form" onSubmit={onSubmit}>
          <label htmlFor="planner-city">Plan for city</label>
          <div className="search-row">
            <input
              id="planner-city"
              value={cityQuery}
              onChange={(event) => setCityQuery(event.target.value)}
              placeholder="Try Porto, Vancouver, Osaka..."
            />
            <button type="submit" disabled={loading}>
              {loading ? "Loading" : "Plan"}
            </button>
          </div>
        </form>

        {error && <p className="error-box">{error}</p>}

        {!error && weather && planner && (
          <>
            <section className="planner-card reveal-1">
              <p className="planner-kicker">Comfort score</p>
              <h2>{planner.comfortScore}/100</h2>
              <p className="planner-copy">
                {planner.comfortLabel} conditions in {weather.city}. Best outdoor slot: {planner.bestHourLabel}
                {planner.bestHourTemp
                  ? ` at ${planner.bestHourTemp.value}${planner.bestHourTemp.label}.`
                  : "."}
              </p>
            </section>

            <section className="planner-card reveal-2">
              <h3>Pack checklist</h3>
              <ul className="planner-list">
                {planner.packingList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="planner-card reveal-3">
              <h3>5-day activity signal</h3>
              <div className="planner-days">
                {planner.dailySignals.map((day) => (
                  <article key={day.dayLabel} className="planner-day-item">
                    <header>
                      <strong>{day.dayLabel}</strong>
                      <span>
                        {day.maxTemp.value}{day.maxTemp.label} / {day.minTemp.value}
                        {day.minTemp.label}
                      </span>
                    </header>
                    <p>{day.signal}</p>
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
