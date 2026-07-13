import { NavLink } from "react-router-dom";

function WeatherIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.5 18.5a3.5 3.5 0 0 1 0-7 4.8 4.8 0 0 1 9.2-1.7A4 4 0 1 1 17 18.5z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20 13.1v-2.2l-2-.5a6.9 6.9 0 0 0-.9-1.8l1.1-1.8-1.5-1.6-1.9 1a7 7 0 0 0-1.7-.7L12.6 3h-2.2L9.9 5.1a7.2 7.2 0 0 0-1.7.7l-1.9-1-1.6 1.6 1.1 1.8c-.4.6-.7 1.2-.9 1.8l-2 .5v2.2l2 .5c.2.6.5 1.2.9 1.8l-1.1 1.8 1.6 1.6 1.9-1c.5.3 1.1.5 1.7.7l.5 2.1h2.2l.5-2.1c.6-.2 1.2-.4 1.7-.7l1.9 1 1.5-1.6-1.1-1.8c.4-.6.7-1.2.9-1.8zM11.5 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
    </svg>
  );
}

function PlannerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 4.7A1.7 1.7 0 0 1 5.7 3h12.6A1.7 1.7 0 0 1 20 4.7v14.6a1.7 1.7 0 0 1-1.7 1.7H5.7A1.7 1.7 0 0 1 4 19.3zm2 1.3v12h12V6zm2 2h8v2H8zm0 4h5v2H8zm0 4h8v2H8z" />
    </svg>
  );
}

export default function FloatingNav() {
  return (
    <nav className="floating-nav" aria-label="Primary navigation">
      <NavLink
        to="/"
        className={({ isActive }) => `floating-nav__item ${isActive ? "is-active" : ""}`}
        aria-label="Weather dashboard"
      >
        <WeatherIcon />
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) => `floating-nav__item ${isActive ? "is-active" : ""}`}
        aria-label="Settings"
      >
        <SettingsIcon />
      </NavLink>

      <NavLink
        to="/planner"
        className={({ isActive }) => `floating-nav__item ${isActive ? "is-active" : ""}`}
        aria-label="Daily planner"
      >
        <PlannerIcon />
      </NavLink>
    </nav>
  );
}