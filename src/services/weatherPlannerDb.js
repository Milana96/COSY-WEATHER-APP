import {
  activitiesStore,
  plannerEntriesStore,
  readRecord,
  savedLocationsStore,
  userPreferencesStore,
  writeRecord,
} from "../db/client";
import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  TEMP_UNITS,
  THEMES,
  WIND_UNITS,
} from "../helpers/settings/constants";

const USER_PREFERENCES_KEY = "current";
const SAVED_LOCATIONS_KEY = "list";
const ACTIVITIES_KEY = "catalog";
const PLANNER_ENTRIES_KEY = "list";

const WEATHER_CONDITIONS = ["sunny", "rainy", "cloudy", "snowy"];

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

const sanitizeUserPreferences = (value = {}) => {
  const source = value ?? {};
  return {
    id: isString(source.id) && source.id.trim() ? source.id : USER_PREFERENCES_KEY,
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

const readLegacySettings = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return sanitizeUserPreferences(parsed);
  } catch {
    return null;
  }
};

const sanitizeCondition = (condition) => {
  const next = isString(condition) ? condition.toLowerCase().trim() : "";
  return WEATHER_CONDITIONS.includes(next) ? next : "cloudy";
};

const sanitizeSavedLocation = (location) => ({
  id: isString(location.id) && location.id.trim() ? location.id : makeId(),
  cityName: isString(location.cityName) ? location.cityName.trim() : "",
  latitude: Number(location.latitude),
  longitude: Number(location.longitude),
  addedAt:
    isString(location.addedAt) && location.addedAt.trim()
      ? location.addedAt
      : new Date().toISOString(),
});

const sanitizeActivity = (activity) => ({
  id: isString(activity.id) && activity.id.trim() ? activity.id : makeId(),
  name: isString(activity.name) ? activity.name.trim() : "",
  idealWeatherCondition: sanitizeCondition(activity.idealWeatherCondition),
  isOutdoor: Boolean(activity.isOutdoor),
});

const sanitizePlannerEntry = (entry) => ({
  id: isString(entry.id) && entry.id.trim() ? entry.id : makeId(),
  locationId: isString(entry.locationId) ? entry.locationId.trim() : "",
  activityId: isString(entry.activityId) ? entry.activityId.trim() : "",
  plannedDate: isString(entry.plannedDate) ? entry.plannedDate : new Date().toISOString(),
  notes: isString(entry.notes) ? entry.notes.trim() : "",
});

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const getSeededActivities = async () => {
  const existing = ensureArray(await readRecord(activitiesStore, ACTIVITIES_KEY, []));
  if (existing.length) return existing.map(sanitizeActivity);

  const seeded = DEFAULT_ACTIVITY_CATALOG.map(sanitizeActivity);
  await writeRecord(activitiesStore, ACTIVITIES_KEY, seeded);
  return seeded;
};

export const getAllActivities = async () => {
  return getSeededActivities();
};

export const getUserPreferences = async () => {
  const fromDb = await readRecord(userPreferencesStore, USER_PREFERENCES_KEY, null);

  if (fromDb) {
    return sanitizeUserPreferences(fromDb);
  }

  const fromLegacy = readLegacySettings();
  if (fromLegacy) {
    await writeRecord(userPreferencesStore, USER_PREFERENCES_KEY, fromLegacy);
    return fromLegacy;
  }

  const defaults = sanitizeUserPreferences({
    id: USER_PREFERENCES_KEY,
    ...DEFAULT_SETTINGS,
  });
  await writeRecord(userPreferencesStore, USER_PREFERENCES_KEY, defaults);
  return defaults;
};

export const saveOrUpdateUserPreferences = async (partialPreferences) => {
  const current = await getUserPreferences();
  const next = sanitizeUserPreferences({
    ...current,
    ...(partialPreferences ?? {}),
  });

  await writeRecord(userPreferencesStore, USER_PREFERENCES_KEY, next);
  return next;
};

export const getSavedLocations = async () => {
  const locations = ensureArray(await readRecord(savedLocationsStore, SAVED_LOCATIONS_KEY, []));
  return locations.map(sanitizeSavedLocation);
};

export const addSavedLocation = async (locationInput) => {
  const nextLocation = sanitizeSavedLocation(locationInput ?? {});

  if (!nextLocation.cityName || Number.isNaN(nextLocation.latitude) || Number.isNaN(nextLocation.longitude)) {
    throw new Error("SavedLocation requires cityName, latitude, and longitude.");
  }

  const current = await getSavedLocations();
  const withoutDuplicate = current.filter((location) => location.id !== nextLocation.id);
  const updated = [nextLocation, ...withoutDuplicate];

  await writeRecord(savedLocationsStore, SAVED_LOCATIONS_KEY, updated);
  return nextLocation;
};

export const removeSavedLocation = async (locationId) => {
  const current = await getSavedLocations();
  const updated = current.filter((location) => location.id !== locationId);

  await writeRecord(savedLocationsStore, SAVED_LOCATIONS_KEY, updated);
  return updated;
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

  const current = ensureArray(await readRecord(plannerEntriesStore, PLANNER_ENTRIES_KEY, []));
  const updated = [nextEntry, ...current.map(sanitizePlannerEntry)];

  await writeRecord(plannerEntriesStore, PLANNER_ENTRIES_KEY, updated);
  return nextEntry;
};

export const getPlannerEntries = async () => {
  const entries = ensureArray(await readRecord(plannerEntriesStore, PLANNER_ENTRIES_KEY, []));
  return entries.map(sanitizePlannerEntry);
};
