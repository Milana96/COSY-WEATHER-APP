import { Route, Routes } from "react-router-dom";
import DashboardDeck from "./components/dashboard/DashboardDeck";
import FloatingNav from "./components/navigation/FloatingNav";
import PlannerScreen from "./components/planner/PlannerScreen";
import useSettings from "./hooks/useSettings";

export default function App() {
  const { loading, settings, onUpdateSettings } = useSettings();

  if (loading) {
    return null;
  }

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
        <Route path="/planner" element={<PlannerScreen settings={settings} />} />
      </Routes>
      <FloatingNav />
    </>
  );
}
