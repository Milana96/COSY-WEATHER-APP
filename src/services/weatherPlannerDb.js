import {
  DEFAULT_SETTINGS,
  TEMP_UNITS,
  THEMES,
  WIND_UNITS,
} from "../helpers/settings/constants";

const USER_PREFERENCES_KEY = "current";
const SAVED_LOCATIONS_KEY = "list";
const ACTIVITIES_KEY = "catalog";
const PLANNER_ENTRIES_KEY = "list";

const WEATHER_CONDITIONS = ["sunny", "rainy", "cloudy", "snowy"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const DEFAULT_ACTIVITY_CATALOG = [
  { id: "act-run", name: "Go for a run", idealWeatherCondition: "sunny", isOutdoor: true },
  {
    id: "act-picnic",
    name: "Have a picnic in the park",
    idealWeatherCondition: "sunny",
    isOutdoor: true,
  },
  { id: "act-museum", name: "Visit a museum", idealWeatherCondition: "rainy", isOutdoor: false },
  { id: "act-reading", name: "Read at a cafe", idealWeatherCondition: "rainy", isOutdoor: false },
  { id: "act-walk", name: "Take a city walk", idealWeatherCondition: "cloudy", isOutdoor: true },
  { id: "act-photography", name: "Street photography", idealWeatherCondition: "cloudy", isOutdoor: true },
  {
    id: "act-hot-chocolate",
    name: "Hot chocolate break",
    idealWeatherCondition: "snowy",
    isOutdoor: false,
  },
  { id: "act-sledding", name: "Go sledding", idealWeatherCondition: "snowy", isOutdoor: true },
];

const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const isString = (value) => typeof value === "string";

const sanitizeTheme = (theme) => (THEMES.includes(theme) || theme === "system" ? theme : DEFAULT_SETTINGS.theme);

const extractId = (value, fallback = "") => {
  if (!value) return fallback;
  if (isString(value)) return value;
  if (isString(value.id)) return value.id;
  if (isString(value._id)) return value._id;
  return fallback;
};

const sanitizeUserPreferences = (value = {}) => {
  const source = value ?? {};
  return {
    id: extractId(source, USER_PREFERENCES_KEY),
    temperatureUnit: TEMP_UNITS.includes(source.temperatureUnit)
      ? source.temperatureUnit
      : DEFAULT_SETTINGS.temperatureUnit,
    windSpeedUnit: WIND_UNITS.includes(source.windSpeedUnit)
      ? source.windSpeedUnit
      : DEFAULT_SETTINGS.windSpeedUnit,
    theme: sanitizeTheme(source.theme),
    defaultLocation:
      isString(source.defaultLocation) && source.defaultLocation.trim()
        ? source.defaultLocation.trim()
        : DEFAULT_SETTINGS.defaultLocation,
  };
};

const sanitizeCondition = (condition) => {
  const next = isString(condition) ? condition.toLowerCase().trim() : "";
  return WEATHER_CONDITIONS.includes(next) ? next : "cloudy";
};

const sanitizeSavedLocation = (location = {}) => {
  const source = location ?? {};
  return {
    id: extractId(source, makeId()),
    cityName: isString(source.cityName) ? source.cityName.trim() : "",
    latitude: Number(source.latitude),
    longitude: Number(source.longitude),
    addedAt: isString(source.createdAt)
      ? source.createdAt
      : isString(source.addedAt)
        ? source.addedAt
        : new Date().toISOString(),
  };
};

const sanitizeActivity = (activity = {}) => {
  const source = activity ?? {};
  return {
    id: extractId(source, makeId()),
    name: isString(source.name) ? source.name.trim() : "",
    idealWeatherCondition: sanitizeCondition(source.idealWeatherCondition),
    isOutdoor: Boolean(source.isOutdoor),
  };
};

const sanitizePlannerEntry = (entry = {}) => {
  const source = entry ?? {};
  return {
    id: extractId(source, makeId()),
    locationId: extractId(source.locationId),
    activityId: extractId(source.activityId),
    plannedDate: isString(source.plannedDate) ? source.plannedDate : new Date().toISOString(),
    notes: isString(source.notes) ? source.notes.trim() : "",
  };
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const errorPayload = await response.json();
      if (isString(errorPayload.message) && errorPayload.message.trim()) {
        message = errorPayload.message;
      }
    } catch {
      // Leave fallback message when body is empty.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const getSeededActivities = async () => {
  const existing = ensureArray(await requestJson("/activities"));
  if (existing.length) return existing.map(sanitizeActivity);

  const seeded = await Promise.all(
    DEFAULT_ACTIVITY_CATALOG.map((activity) =>
      requestJson("/activities", {
        method: "POST",
        body: JSON.stringify({
          name: activity.name,
          idealWeatherCondition: activity.idealWeatherCondition,
          isOutdoor: activity.isOutdoor,
        }),
      })
    )
  );

  return seeded.map(sanitizeActivity);
};

export const getAllActivities = async () => {
  return getSeededActivities();
};

export const getUserPreferences = async () => {
  const fromApi = await requestJson("/user-preference");

  if (fromApi) {
    return sanitizeUserPreferences(fromApi);
  }

  const defaults = sanitizeUserPreferences({
    id: USER_PREFERENCES_KEY,
    ...DEFAULT_SETTINGS,
  });
  await requestJson("/user-preference", {
    method: "PUT",
    body: JSON.stringify(defaults),
  });
  return defaults;
};

export const saveOrUpdateUserPreferences = async (partialPreferences) => {
  const current = await getUserPreferences();
  const next = sanitizeUserPreferences({
    ...current,
    ...(partialPreferences ?? {}),
  });

  const saved = await requestJson("/user-preference", {
    method: "PUT",
    body: JSON.stringify(next),
  });

  return sanitizeUserPreferences(saved);
};

export const getSavedLocations = async () => {
  const locations = ensureArray(await requestJson("/saved-locations"));
  return locations.map(sanitizeSavedLocation);
};

export const addSavedLocation = async (locationInput) => {
  const nextLocation = sanitizeSavedLocation(locationInput ?? {});

  if (!nextLocation.cityName || Number.isNaN(nextLocation.latitude) || Number.isNaN(nextLocation.longitude)) {
    throw new Error("SavedLocation requires cityName, latitude, and longitude.");
  }

  const created = await requestJson("/saved-locations", {
    method: "POST",
    body: JSON.stringify({
      cityName: nextLocation.cityName,
      latitude: nextLocation.latitude,
      longitude: nextLocation.longitude,
    }),
  });

  return sanitizeSavedLocation(created);
};

export const removeSavedLocation = async (locationId) => {
  await requestJson(`/saved-locations/${locationId}`, { method: "DELETE" });
  return getSavedLocations();
};

export const getActivitiesByWeatherCondition = async (weatherCondition) => {
  const condition = sanitizeCondition(weatherCondition);
  const activities = await getSeededActivities();
  return activities.filter((activity) => activity.idealWeatherCondition === condition);
};

export const createPlannerEntry = async (entryInput) => {
  const nextEntry = sanitizePlannerEntry(entryInput ?? {});

  if (!nextEntry.locationId || !nextEntry.activityId) {
    throw new Error("PlannerEntry requires locationId and activityId.");
  }

  const created = await requestJson("/planner-entries", {
    method: "POST",
    body: JSON.stringify(nextEntry),
  });

  return sanitizePlannerEntry(created);
};

export const getPlannerEntries = async () => {
  const entries = ensureArray(await requestJson("/planner-entries"));
  return entries.map(sanitizePlannerEntry);
};
