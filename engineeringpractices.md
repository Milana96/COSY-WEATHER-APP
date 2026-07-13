# Engineering Practices

## Purpose
This guide is for onboarding developers working on the current COSY Weather App implementation. It documents how the app is actually built today.

## Step 1: High-Level Technical Summary

### 1) Framework, Tools, Libraries
- Runtime framework: React 18 with functional components and hooks.
- Routing: react-router-dom v6 with BrowserRouter and route-based screens.
- Build tool: Vite 5 with @vitejs/plugin-react.
- Styling pipeline: Tailwind CSS v4 plugin is configured in Vite, and tailwindcss is imported in the global stylesheet.
- Styling approach in code: mostly handcrafted CSS classes (not utility-class-heavy Tailwind usage).
- Data source APIs:
  - Open-Meteo Geocoding API for city lookup.
  - Open-Meteo Forecast API for weather and forecast data.
- Persistence: localStorage for user settings.
- Rendering engine for scene: native HTML canvas 2D context with custom draw engine.
- No test runner scripts are currently defined in package.json.

### 2) Architecture, Folder Structure, Patterns
- App composition:
  - src/main.jsx wires BrowserRouter and global styles.
  - src/App.jsx maps routes and injects global settings into feature screens.
- Feature-first folders under src/components:
  - dashboard for weather + settings deck container.
  - weather for reusable weather-focused UI primitives.
  - planner for planner screen and local stylesheet.
  - settings for settings stylesheet (used by dashboard deck when /settings is active).
  - navigation for floating route switcher.
- Logic extraction pattern:
  - src/hooks for stateful orchestration logic.
  - src/helpers for pure and semi-pure domain logic (planner, settings, conversion, canvas subsystems).
- Data flow pattern:
  - useSettings is the root settings state owner, persisted + theme side effects.
  - settings object is passed down as props to screens.
  - useWeather encapsulates API calls and weather normalization pipeline.
- Shared model pattern:
  - src/weatherApi.js normalizes API payloads into a stable app weather shape consumed by dashboard and planner.
- Canvas architecture pattern:
  - WeatherCanvas component orchestrates lifecycle only.
  - Scene state and particle generation in sceneState.js.
  - Draw commands in drawEngine.js.
  - Strategy dispatcher in strategies.js routes weather visual behavior.
  - Theme token resolution in theme.js maps CSS variables to rendering palette.
- Screen architecture pattern:
  - DashboardDeck serves both weather and settings route variants using pathname-driven UI state.
  - PlannerScreen is a standalone route that reuses useWeather and WeatherCanvas.

### 3) Naming Conventions
- Components: PascalCase files and exported component names (example: DashboardDeck, WeatherCanvas, PlannerScreen).
- Hooks: camelCase with use prefix (example: useWeather, useSettingsForm, usePlannerAdvice).
- Helpers/utilities: camelCase file names (example: conversions.js, insights.js, sceneState.js).
- Constants:
  - UPPER_SNAKE_CASE for exported constants that are true constants (DEFAULT_SETTINGS, CANVAS_NUMBERS, WEATHER_CODES).
  - Some lower camel objects are also used as maps in weatherApi.js (weatherCodeMap, weatherLabelMap).
- CSS classes: kebab-case and BEM-like variants for component families (weather-button__title, weather-button--rainy, floating-nav__item).
- Event handlers and callbacks: onX naming in props and component scope (onSubmit, onUpdateSettings, onSaveDefaultLocation).
- Boolean-style values: prefixed with is in many places (isDay, isHeavyRain, isSettingsActive).

### 4) Styling Guidelines
- Primary styling is CSS-first with dedicated feature stylesheets and one global theme file.
- Core global tokens live in :root custom properties inside src/styles.css.
- Theme switching model:
  - Dark theme is default token set.
  - Light theme is enabled by toggling body.theme-light.
  - Component styles include theme overrides via body.theme-light selectors.
- Visual system conventions:
  - Glassmorphism-like panels with blur, alpha backgrounds, and thin borders.
  - Gradient-rich backgrounds and weather-specific accent variables.
  - Fixed floating navigation with active-state styles.
  - Reveal animation classes (reveal-1 to reveal-4) shared by screen blocks.
- Responsiveness:
  - Primary breakpoint around 980px in global and feature CSS.
  - Desktop uses split layout; mobile collapses to single-column and moves floating nav to bottom.
- Tailwind usage convention in current codebase:
  - Tailwind is configured and imported.
  - Utility classes are used selectively in JSX (mostly layout transitions), while most styling remains in CSS files.

## Step 2: Onboarding Guide for Junior Developers

### Codebase Orientation
1. Start with src/App.jsx to understand route-level composition.
2. Read src/components/dashboard/DashboardDeck.jsx and src/components/planner/PlannerScreen.jsx for screen behavior.
3. Read src/hooks/useWeather.js and src/weatherApi.js to understand weather fetch + normalization.
4. Read src/hooks/useSettings.js and src/helpers/settings/storage.js for persistence + theme behavior.
5. Read src/components/weather/WeatherCanvas.jsx and src/helpers/weatherCanvas/* for animation architecture.

### Working Rules Aligned to This Repository
- Keep UI and domain logic separated:
  - UI in components.
  - State orchestration in hooks.
  - reusable logic in helpers.
- Reuse normalized weather shape from weatherApi.js instead of consuming raw API payloads in components.
- When adding settings:
  - Extend DEFAULT_SETTINGS and validation lists in helpers/settings/constants.js.
  - Update readSavedSettings sanitation in helpers/settings/storage.js.
  - Keep persistence centralized through useSettings.
- When adding weather-derived UI:
  - Use useWeather output and existing conversion helpers for units.
  - Avoid duplicating conversion or weather-code interpretation logic in components.
- When extending planner recommendations:
  - Add/adjust heuristics in helpers/planner/insights.js.
  - Keep usePlannerAdvice as a thin hook layer.
- When changing canvas visuals:
  - Add values to constants.js.
  - Keep render behavior in strategies.js and draw details in drawEngine.js.
  - Keep WeatherCanvas.jsx focused on lifecycle and orchestration.

### State and Side-Effect Conventions
- Network state lives in hooks (loading, error, weather data).
- Route-driven visual state is derived from pathname where needed.
- Theme side effect is handled by body class toggling in useSettings.
- localStorage writes happen from useEffect in useSettings after state changes.

### Error Handling and UX Conventions
- API and geocoding failures are surfaced as user-readable string messages.
- Forms prevent empty submission using trim checks.
- Loading buttons switch labels (Sync/Plan -> Loading) and disable during request.

### Styling and Component Conventions
- Add new screen CSS near the feature component.
- Prefer existing tokens/variables before introducing new colors.
- Reuse panel, reveal, and card idioms for visual consistency.
- Keep class naming readable and consistent with existing kebab/BEM-like style.

### Build and Local Run
- Install dependencies: npm install
- Run dev server: npm run dev
- Build production bundle: npm run build
- Preview production build: npm run preview

### Current Gaps to Be Aware Of
- No automated tests are configured in scripts.
- No lint script is configured.
- README is minimal; this file and code are the primary onboarding references.

### Safe First Contributions
1. Add a small weather stat card by reusing StatCard and weather normalization output.
2. Add a planner heuristic in insights.js and validate behavior on planner screen.
3. Add a new visual token and consume it in both CSS and canvas theme mapping.
