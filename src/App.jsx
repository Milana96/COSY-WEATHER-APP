import { Route, Routes } from "react-router-dom";
import SettingsScreen from "./components/settings/SettingsScreen";
import WeatherScreen from "./components/weather/WeatherScreen";
import useSettings from "./hooks/useSettings";

export default function App() {
  const { settings, onUpdateSettings } = useSettings();

  return (
    <Routes>
      <Route path="/" element={<WeatherScreen settings={settings} />} />
      <Route
        path="/settings"
        element={<SettingsScreen settings={settings} onUpdateSettings={onUpdateSettings} />}
      />
    </Routes>
  );
}
