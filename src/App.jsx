import { Route, Routes } from "react-router-dom";
import DashboardDeck from "./components/dashboard/DashboardDeck";
import FloatingNav from "./components/navigation/FloatingNav";
import PlannerScreen from "./components/planner/PlannerScreen";
import useSettings from "./hooks/useSettings";

export default function App() {
  const { loading, settings, onUpdateSettings } = useSettings();

  if (loading) {
    return (
      <div className="app" style={{ alignItems: "center", justifyContent: "center" }}>
        <div className="panel" style={{ padding: "1.5rem 2rem", minWidth: "280px" }}>
          <p style={{ margin: 0, fontSize: "1rem", opacity: 0.9 }}>Loading weather experience…</p>
        </div>
      </div>
    );
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
