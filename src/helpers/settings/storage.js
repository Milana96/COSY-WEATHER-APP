import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  TEMP_UNITS,
  THEMES,
  WIND_UNITS,
} from "./constants";

export const readSavedSettings = () => {
  try {
    const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!saved) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(saved);

    return {
      temperatureUnit: TEMP_UNITS.includes(parsed.temperatureUnit)
        ? parsed.temperatureUnit
        : DEFAULT_SETTINGS.temperatureUnit,
      windSpeedUnit: WIND_UNITS.includes(parsed.windSpeedUnit)
        ? parsed.windSpeedUnit
        : DEFAULT_SETTINGS.windSpeedUnit,
      defaultLocation:
        typeof parsed.defaultLocation === "string" && parsed.defaultLocation.trim()
          ? parsed.defaultLocation.trim()
          : DEFAULT_SETTINGS.defaultLocation,
      theme: THEMES.includes(parsed.theme) ? parsed.theme : DEFAULT_SETTINGS.theme,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};
