import { useCallback, useEffect, useState } from "react";
import {
  getAllActivities,
  addSavedLocation,
  createPlannerEntry,
  getActivitiesByWeatherCondition,
  getPlannerEntries,
  getSavedLocations,
  getUserPreferences,
  removeSavedLocation,
  saveOrUpdateUserPreferences,
} from "../services/weatherPlannerDb";

export default function useWeatherPlannerStore() {
  const [preferences, setPreferences] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [plannerEntries, setPlannerEntries] = useState([]);
  const [activityCatalog, setActivityCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [nextPreferences, nextLocations, nextEntries, nextCatalog] = await Promise.all([
        getUserPreferences(),
        getSavedLocations(),
        getPlannerEntries(),
        getAllActivities(),
      ]);

      setPreferences(nextPreferences);
      setSavedLocations(nextLocations);
      setPlannerEntries(nextEntries);
      setActivityCatalog(nextCatalog);
      setLoading(false);
    };

    load();
  }, []);

  const savePreferences = useCallback(async (partial) => {
    const next = await saveOrUpdateUserPreferences(partial);
    setPreferences(next);
    return next;
  }, []);

  const addLocation = useCallback(async (location) => {
    const created = await addSavedLocation(location);
    setSavedLocations((previous) => [created, ...previous.filter((item) => item.id !== created.id)]);
    return created;
  }, []);

  const removeLocation = useCallback(async (locationId) => {
    const updated = await removeSavedLocation(locationId);
    setSavedLocations(updated);
    return updated;
  }, []);

  const getActivitiesForCondition = useCallback((condition) => {
    return getActivitiesByWeatherCondition(condition);
  }, []);

  const addPlannerEntry = useCallback((entry) => {
    return createPlannerEntry(entry).then((created) => {
      setPlannerEntries((previous) => [created, ...previous]);
      return created;
    });
  }, []);

  const refreshPlannerEntries = useCallback(async () => {
    const entries = await getPlannerEntries();
    setPlannerEntries(entries);
    return entries;
  }, []);

  return {
    loading,
    preferences,
    savedLocations,
    plannerEntries,
    activityCatalog,
    savePreferences,
    addLocation,
    removeLocation,
    getActivitiesForCondition,
    addPlannerEntry,
    refreshPlannerEntries,
  };
}
