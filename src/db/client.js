import { createStore, get, set } from "idb-keyval";

export const DB_NAME = "cosy-weather-db";

export const userPreferencesStore = createStore(DB_NAME, "user_preferences");
export const savedLocationsStore = createStore(DB_NAME, "saved_locations");
export const activitiesStore = createStore(DB_NAME, "activities");
export const plannerEntriesStore = createStore(DB_NAME, "planner_entries");

export const readRecord = async (store, key, fallbackValue) => {
  const value = await get(key, store);
  return value ?? fallbackValue;
};

export const writeRecord = async (store, key, value) => {
  await set(key, value, store);
  return value;
};