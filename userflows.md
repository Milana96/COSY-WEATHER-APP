# User Flows

## Purpose
This document explains the implemented user flows for the current COSY Weather App.

## Navigation Model
- The app has three route destinations:
  - / : Weather dashboard view.
  - /settings : Settings view rendered through the same dashboard deck container.
  - /planner : Planner view.
- A persistent floating navigation is visible across routes and is the primary route switch mechanism.

## App Startup Flow
1. App boots through src/main.jsx and mounts BrowserRouter.
2. App.jsx initializes settings through useSettings.
3. useSettings reads localStorage and sanitizes values with defaults fallback.
4. Theme side effect runs and applies/removes body.theme-light.
5. Route renders:
  - / or /settings -> DashboardDeck.
  - /planner -> PlannerScreen.
6. DashboardDeck and PlannerScreen each start weather fetch flow using settings.defaultLocation.

## Core Weather Retrieval Flow (Used by Dashboard and Planner)
1. useWeather initializes cityQuery from defaultLocation and sets loading.
2. On mount/defaultLocation change, useWeather calls fetchWeather(defaultLocation).
3. fetchWeather sequence:
  - Geocode city using getCityCoordinates.
  - Fetch forecast using getWeatherByCoords.
  - Normalize data through normalizeWeather.
4. Success path:
  - weather state updated with normalized object.
  - visualMode derived from weather.current.visual.
  - sceneSeed derived from rounded latitude/longitude.
5. Failure path:
  - error string set (for example: City not found, Could not fetch weather).
6. UI path:
  - Loading disables submit button and changes label.
  - Error shows error box.
  - Success renders weather/planner content blocks.

## Weather Dashboard Flow (/)
1. User lands on /.
2. DashboardDeck detects route is not settings mode.
3. Left side shows animated WeatherCanvas using current weather visual mode.
4. Right panel shows:
  - Search form.
  - Condition chips/buttons.
  - Current temperature and feels-like values in selected unit.
  - Wind/humidity/sunrise/sunset stat cards.
  - Hourly and 5-day forecast lists.
5. User can search another city:
  - Enter city and submit.
  - useWeather fetches and replaces weather data.
  - Canvas and all weather cards update from new normalized data.

## Settings Flow (/settings)
1. User taps/clicks settings icon in floating nav.
2. Route changes to /settings but still renders DashboardDeck.
3. DashboardDeck switches into settings mode based on pathname.
4. Visual behavior changes:
  - Right panel slides to settings side.
  - Left canvas forces clear/day seed for stable settings backdrop.
  - Left footer text changes to settings copy.
5. User setting actions:
  - Temperature unit toggle updates settings.temperatureUnit.
  - Wind unit select updates settings.windSpeedUnit.
  - Default location form updates settings.defaultLocation when saved.
  - Theme toggle updates settings.theme.
6. Persistence and global effect:
  - useSettings writes settings to localStorage after each change.
  - Theme change toggles body.theme-light immediately.
  - New default location triggers fresh weather load in screens using useWeather(defaultLocation).

## Planner Flow (/planner)
1. User taps/clicks planner icon.
2. PlannerScreen loads with same weather fetch behavior as dashboard.
3. Planner derives insights via usePlannerAdvice(weather, settings).
4. Insights generation (generatePlannerInsights) computes:
  - comfortScore and comfortLabel.
  - best outdoor hour from upcoming hourly forecast.
  - packing list based on temp/wind/humidity/weather code.
  - 5-day activity signals based on min/max spread and thresholds.
5. Planner UI shows:
  - Comfort score card.
  - Packing checklist.
  - 5-day signal cards with converted temperature units.
6. Unit preferences from settings directly affect planner displayed values.

## Theme Flow
1. User toggles theme in settings.
2. settings.theme changes in state.
3. useSettings effect toggles body.theme-light class.
4. CSS token overrides for light theme apply globally.
5. Canvas theme builder reads computed CSS variables, so weather scene colors also adapt.

## LocalStorage Flow
1. On first load with no saved data:
  - DEFAULT_SETTINGS are used.
2. On load with saved data:
  - readSavedSettings validates each field against allowed values.
  - Invalid/missing values are replaced by defaults.
3. On every settings update:
  - saveSettings serializes full settings object under cosy-weather-settings key.

## Error and Recovery Flows
- Empty city submission:
  - Form submission returns early and no request is made.
- City not found:
  - Error message is displayed in panel.
  - Existing weather content is hidden until successful fetch.
- API/network issue:
  - Generic fetch/geocode error message is displayed.
  - User can retry by submitting another query.

## Data Contracts Used by Flows
- Settings object:
  - temperatureUnit: celsius | fahrenheit
  - windSpeedUnit: kmh | mph | ms
  - defaultLocation: string
  - theme: dark | light
- Normalized weather object includes:
  - city/country/coords/timezone
  - current (temp, feelsLike, weatherCode, label, visual, humidity, wind, isDay, sunrise, sunset)
  - hourlyForecast (label, temp, code)
  - dailyForecast (dayLabel, max, min)

## Practical Trace Examples

### Example A: Change default location
1. Open /settings.
2. Enter new city in Default Location and press Save.
3. settings.defaultLocation updates and persists.
4. Navigating to / or /planner starts weather fetch for new default city automatically.

### Example B: Compare units
1. Open /settings and switch temperature to Fahrenheit.
2. Return to / and /planner.
3. All temperatures shown through conversion helpers now display in °F.

### Example C: Light theme adaptation
1. Open /settings and switch theme to Light.
2. App background, panels, cards, and floating nav update through CSS theme-light selectors.
3. Canvas scene colors adapt because render theme pulls updated CSS variables.
