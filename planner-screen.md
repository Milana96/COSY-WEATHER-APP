# Planner Screen Specification

## 1) Document Control
- Screen Name: Daily Planner
- Feature ID: FEAT-PLANNER-001
- Product Area: Weather Experience
- Author: Senior Frontend Developer
- Date: 2026-07-13
- Status: Implemented

## 2) Business Goal
Turn forecast data into actionable day-planning guidance so users can decide when to go outside and what to bring.

- Problem Statement: Weather numbers alone are useful, but users also need practical recommendations.
- Target Users: Daily commuters, walkers/runners, and users planning short outdoor activities.
- Success Metrics:
  - Increased repeat use of the app for planning decisions.
  - Increased interaction with non-settings utility screens.

## 3) Current Context and Architecture
- App Type: SPA
- Current Layout Pattern: Split layout with animated weather scene and right-side data panel
- Existing Navigation Pattern: Floating vertical nav with icon links
- Relevant Existing Components:
  - Weather screen
  - Settings screen
  - WeatherCanvas
- Relevant Hooks/Helpers:
  - useWeather
  - useSettings
  - weather conversions helpers

## 4) Screen Scope
### In Scope
- New route and nav entry for planner screen
- Planner UI that derives comfort score, best outdoor hour, and packing tips
- 5-day activity signal content using forecast data

### Out of Scope
- Calendar integration
- Push notifications

## 5) Functional Requirements
1. Routing and Navigation
- Add route: /planner
- Add navigation icon in floating nav
- Navigation behavior: user switches among Weather, Settings, and Planner screens

2. Layout and UX
- Responsive split layout matching existing visual style
- WeatherCanvas background and panel styling consistent with project aesthetics

3. Screen Controls and Content
- Control: City input
  - Type: text input + submit
  - Values: any city name
  - Default: settings default location
- Content: Comfort score 0-100 with quality label
- Content: Best outdoor hour in next hours with converted units
- Content: Packing checklist based on conditions
- Content: 5-day activity signals with temperature ranges and guidance

4. Persistence and Application
- Persist settings in existing LocalStorage flow
- Planner consumes persisted settings (temperature unit and default location)
- On reload, planner reflects latest global settings automatically

## 6) Technical Implementation Constraints
- Complete, ready-to-run React code
- Existing naming conventions preserved
- UI in components; logic in hooks/helpers
- Dedicated planner stylesheet added

## 7) File/Folder Impact
- Updated: src/App.jsx
- Updated: src/components/navigation/FloatingNav.jsx
- Created: src/components/planner/PlannerScreen.jsx
- Created: src/components/planner/PlannerScreen.css
- Created: src/hooks/usePlannerAdvice.js
- Created: src/helpers/planner/insights.js

## 8) Data Contract
Planner insights generated from normalized weather object:

```js
{
  comfortScore: 0,
  comfortLabel: "Good",
  bestHourLabel: "2 PM",
  bestHourTemp: { value: 24, label: "°C" },
  packingList: ["Water bottle", "Light layers"],
  dailySignals: [
    {
      dayLabel: "Tue",
      maxTemp: { value: 28, label: "°C" },
      minTemp: { value: 18, label: "°C" },
      signal: "Stable conditions. Good for longer outdoor plans."
    }
  ]
}
```

## 9) UX Acceptance Criteria
1. User can open Planner from floating nav in one click.
2. Planner follows existing app look and responds on mobile and desktop.
3. Planner content updates after city search.
4. Unit choices from Settings are reflected in planner output.

## 10) Technical Acceptance Criteria
1. /planner route resolves without breaking existing routes.
2. Planner calculation logic isolated in helper and hook.
3. Screen-specific CSS isolated in planner stylesheet.
4. Production build passes.

## 11) Test Scenarios (Manual)
- Navigate to /planner from nav icon.
- Search city in planner and verify updated recommendations.
- Switch temperature unit in settings and verify planner values update.
- Verify mobile layout and desktop layout.

## 12) Risks and Mitigations
- Risk: Recommendations feel too generic in edge weather conditions.
  - Mitigation: Keep heuristics centralized in helper for iterative tuning.
- Risk: Forecast shape changes from API.
  - Mitigation: Reuse normalized weather model already used by weather screen.

## 13) Delivery Checklist
- [x] Route and navigation entry added
- [x] Screen component created
- [x] Logic split into helper/hook
- [x] Screen styles extracted
- [x] Build verified
