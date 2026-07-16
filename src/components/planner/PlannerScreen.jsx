import WeatherCanvas from "../weather/WeatherCanvas";
import { useEffect, useMemo, useState } from "react";
import useWeather from "../../hooks/useWeather";
import usePlannerAdvice from "../../hooks/usePlannerAdvice";
import useWeatherPlannerStore from "../../hooks/useWeatherPlannerStore";
import "./PlannerScreen.css";

const RAINY_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
const SNOWY_CODES = [71, 73, 75, 77, 85, 86];

const getConditionFromWeatherCode = (code) => {
  if (SNOWY_CODES.includes(code)) return "snowy";
  if (RAINY_CODES.includes(code)) return "rainy";
  if (code >= 0 && code <= 2) return "sunny";
  return "cloudy";
};

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

  const {
    addLocation,
    addPlannerEntry,
    getActivitiesForCondition,
    activityCatalog,
    plannerEntries,
    savedLocations,
  } = useWeatherPlannerStore();
  const [activities, setActivities] = useState([]);
  const [entryNote, setEntryNote] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const planner = usePlannerAdvice(weather, settings);
  const activeCondition = useMemo(() => {
    return getConditionFromWeatherCode(weather?.current.weatherCode ?? 3);
  }, [weather?.current.weatherCode]);

  const activityNameById = useMemo(() => {
    return Object.fromEntries(activityCatalog.map((activity) => [activity.id, activity.name]));
  }, [activityCatalog]);

  const cityNameByLocationId = useMemo(() => {
    return Object.fromEntries(savedLocations.map((location) => [location.id, location.cityName]));
  }, [savedLocations]);

  useEffect(() => {
    const loadActivities = async () => {
      const list = await getActivitiesForCondition(activeCondition);
      setActivities(list);
    };

    loadActivities();
  }, [activeCondition, getActivitiesForCondition]);

  const onSaveCurrentCity = async () => {
    if (!weather) return;

    await addLocation({
      cityName: weather.city,
      latitude: weather.latitude,
      longitude: weather.longitude,
    });
    setSaveMessage(`${weather.city} saved to your locations.`);
  };

  const onCreatePlan = async (activityId) => {
    if (!weather) return;

    const location = await addLocation({
      cityName: weather.city,
      latitude: weather.latitude,
      longitude: weather.longitude,
    });

    await addPlannerEntry({
      locationId: location.id,
      activityId,
      plannedDate: new Date().toISOString(),
      notes: entryNote,
    });

    setEntryNote("");
    setSaveMessage("Planner entry created successfully.");
  };

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

            <section className="planner-card reveal-4">
              <h3>Smart activity suggestions</h3>
              <p className="planner-copy">
                Weather right now is <strong>{activeCondition}</strong>, so these ideas are pre-filtered for you.
              </p>
              <div className="search-row" style={{ marginTop: 12 }}>
                <button type="button" onClick={onSaveCurrentCity}>
                  Save current city
                </button>
              </div>
              <label htmlFor="planner-note" style={{ display: "block", marginTop: 12 }}>
                Optional note for new planner entry
              </label>
              <input
                id="planner-note"
                value={entryNote}
                onChange={(event) => setEntryNote(event.target.value)}
                placeholder="Example: Bring sunscreen and water"
              />

              <div className="planner-days" style={{ marginTop: 12 }}>
                {activities.map((activity) => (
                  <article key={activity.id} className="planner-day-item">
                    <header>
                      <strong>{activity.name}</strong>
                      <span>{activity.isOutdoor ? "Outdoor" : "Indoor"}</span>
                    </header>
                    <button type="button" onClick={() => onCreatePlan(activity.id)}>
                      Add to planner
                    </button>
                  </article>
                ))}
              </div>

              {saveMessage ? <p className="planner-copy" style={{ marginTop: 12 }}>{saveMessage}</p> : null}
            </section>

            <section className="planner-card reveal-4">
              <h3>Saved planner history</h3>
              {!plannerEntries.length ? (
                <p className="planner-copy">No entries yet. Add one from the suggestion cards above.</p>
              ) : (
                <div className="planner-days">
                  {plannerEntries.slice(0, 6).map((entry) => {
                    const activityName = activityNameById[entry.activityId] ?? "Unknown activity";
                    const cityName = cityNameByLocationId[entry.locationId] ?? "Unknown city";
                    const plannedLabel = new Date(entry.plannedDate).toLocaleDateString();

                    return (
                      <article key={entry.id} className="planner-day-item">
                        <header>
                          <strong>{activityName}</strong>
                          <span>{plannedLabel}</span>
                        </header>
                        <p>{cityName}</p>
                        {entry.notes ? <p>{entry.notes}</p> : null}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </aside>
    </main>
  );
}
