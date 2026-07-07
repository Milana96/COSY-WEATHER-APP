import { Route, Routes } from "react-router-dom";
import DashboardDeck from "./components/dashboard/DashboardDeck";
import FloatingNav from "./components/navigation/FloatingNav";
import useSettings from "./hooks/useSettings";

export default function App() {
  const { settings, onUpdateSettings } = useSettings();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<DashboardDeck settings={settings} onUpdateSettings={onUpdateSettings} />}
        />
        <Route
          path="/settings"
          element={<DashboardDeck settings={settings} onUpdateSettings={onUpdateSettings} />}
        />
      </Routes>
      <FloatingNav />
    </>
  );
}
