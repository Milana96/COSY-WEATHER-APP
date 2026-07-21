import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS } from "../helpers/settings/constants";
import {
  getUserPreferences,
  saveOrUpdateUserPreferences,
} from "../services/weatherPlannerDb";

export default function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const persisted = await getUserPreferences();
        if (!mounted) return;

        setSettings((current) => ({ ...current, ...persisted }));
      } catch (error) {
        if (!mounted) return;
        setSettings(DEFAULT_SETTINGS);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("theme-light", settings.theme === "light");

    return () => {
      document.body.classList.remove("theme-light");
    };
  }, [settings.theme]);

  const onUpdateSettings = (partial) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    saveOrUpdateUserPreferences(partial).catch(() => {
      // Keep UI responsive even if persistence fails unexpectedly.
    });
  };

  return {
    loading,
    settings,
    onUpdateSettings,
  };
}
