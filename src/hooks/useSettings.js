import { useEffect, useState } from "react";
import { readSavedSettings, saveSettings } from "../helpers/settings/storage";

export default function useSettings() {
  const [settings, setSettings] = useState(readSavedSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    document.body.classList.toggle("theme-light", settings.theme === "light");

    return () => {
      document.body.classList.remove("theme-light");
    };
  }, [settings.theme]);

  const onUpdateSettings = (partial) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return {
    settings,
    onUpdateSettings,
  };
}
