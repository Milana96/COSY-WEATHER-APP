# Create Screen Template

## 1) Document Control
- Screen Name: `<SCREEN_NAME>`
- Feature ID: `<FEATURE_ID_OR_TICKET>`
- Product Area: `<AREA>`
- Author: `<AUTHOR>`
- Date: `<YYYY-MM-DD>`
- Status: `Draft | In Review | Approved | Implemented`

## 2) Business Goal
Describe why this screen exists and what business/user outcome it supports.

- Problem Statement: `<WHAT_PROBLEM_ARE_WE_SOLVING>`
- Target Users: `<USER_SEGMENT>`
- Success Metrics:
  - `<METRIC_1>`
  - `<METRIC_2>`

## 3) Current Context and Architecture
Summarize how the existing application is structured so the new screen fits naturally.

- App Type: `<SPA/MPA/etc.>`
- Current Layout Pattern: `<EXISTING_LAYOUT>`
- Existing Navigation Pattern: `<NAV_STRUCTURE>`
- Relevant Existing Components:
  - `<COMPONENT_1>`
  - `<COMPONENT_2>`
- Relevant Hooks/Helpers:
  - `<HOOK_OR_HELPER_1>`
  - `<HOOK_OR_HELPER_2>`

## 4) Screen Scope
### In Scope
- `<SCOPE_ITEM_1>`
- `<SCOPE_ITEM_2>`

### Out of Scope
- `<OUT_OF_SCOPE_ITEM_1>`
- `<OUT_OF_SCOPE_ITEM_2>`

## 5) Functional Requirements
List what the screen must do from a user perspective.

1. Routing and Navigation
- Add route: `<ROUTE_PATH>`
- Add navigation entry point: `<ICON/LINK/BUTTON>`
- Navigation behavior: `<HOW_USER_SWITCHES_SCREENS>`

2. Layout and UX
- Responsive layout behavior:
  - Desktop: `<DESKTOP_BEHAVIOR>`
  - Mobile: `<MOBILE_BEHAVIOR>`
- Visual consistency requirements: `<THEME/STYLE_ALIGNMENT>`

3. Screen Controls and Content
- Control: `<CONTROL_1>`
  - Type: `<TOGGLE/INPUT/SELECT>`
  - Values: `<VALUE_SET>`
  - Default: `<DEFAULT_VALUE>`
- Control: `<CONTROL_2>`
  - Type: `<TOGGLE/INPUT/SELECT>`
  - Values: `<VALUE_SET>`
  - Default: `<DEFAULT_VALUE>`
- Control: `<CONTROL_3>`
  - Type: `<TOGGLE/INPUT/SELECT>`
  - Values: `<VALUE_SET>`
  - Default: `<DEFAULT_VALUE>`

4. Persistence and Application
- Persist settings to: `LocalStorage`
- Storage key(s): `<KEY_NAMES>`
- Apply globally to app: `<YES/NO + HOW>`
- On reload, restore values and update UI state.

## 6) Technical Implementation Constraints
Capture engineering constraints clearly so implementation remains consistent.

- Use complete, ready-to-run code.
- Match existing naming conventions and style.
- Keep weather and settings as separate components inside `components/`.
- Move non-UI logic to `helpers/`.
- If state has reusable handling logic, create dedicated hooks in `hooks/`.
- Extract screen-specific styles into dedicated files (avoid bloating shared styles).

## 7) Proposed File/Folder Impact (Template)
- Update: `<APP_ENTRY_FILE>`
- Create/Update component files:
  - `components/<screen>/<ScreenName>.jsx`
  - `components/<screen>/<ScreenName>.css`
- Create/Update hooks:
  - `hooks/<hookName>.js`
- Create/Update helpers:
  - `helpers/<domain>/<file>.js`
- Update navigation component:
  - `components/<navigation>/<NavFile>.jsx`

## 8) Data Contract (If Needed)
Define settings/data shape and defaults.

```js
// Example shape
{
  theme: "light",
  temperatureUnit: "celsius",
  windSpeedUnit: "kmh",
  defaultLocation: ""
}
```

## 9) UX Acceptance Criteria
1. User can open `<SCREEN_NAME>` from navigation in one interaction.
2. Screen is responsive and visually aligned with existing app design.
3. Each control updates state immediately and shows current value.
4. Values persist after page reload.
5. Global behavior reflects selected settings where applicable.

## 10) Technical Acceptance Criteria
1. Routing works with no broken paths.
2. No logic duplication across components and helpers.
3. Hooks encapsulate stateful logic where appropriate.
4. Screen-specific CSS is isolated and organized.
5. App file remains readable, minimal, and orchestration-focused.

## 11) Test Scenarios (Manual)
- Route access:
  - Navigate to `<ROUTE_PATH>` directly and through UI.
- Persistence:
  - Change settings, reload page, verify values remain.
- Global application:
  - Verify selected units/theme are reflected across relevant screens.
- Responsiveness:
  - Validate at mobile, tablet, and desktop breakpoints.

## 12) Risks and Mitigations
- Risk: Inconsistent defaults between UI and storage.
  - Mitigation: Define and reuse a single defaults constant.
- Risk: Style regressions in existing screen.
  - Mitigation: Scope CSS by screen-specific class namespace.
- Risk: Tight coupling in `App`.
  - Mitigation: Keep `App` focused on routes/layout composition only.

## 13) Delivery Checklist
- [ ] Route and navigation entry added
- [ ] Screen component created
- [ ] State + persistence implemented
- [ ] Helpers/hooks extracted per conventions
- [ ] Styles extracted and scoped
- [ ] App file refactored and simplified
- [ ] Manual test scenarios completed

---

# Filled Example (Settings Screen)
Use this section as a reference and replace values for the next screen.

## Goal
Create a Settings screen in the weather SPA so users can control units, theme, and default location with persistence.

## Functional Inputs
- Route: `/settings`
- Navigation: subtle cog icon/link to switch between Weather and Settings
- Controls:
  - Temperature Unit: `Celsius | Fahrenheit`
  - Wind Speed Unit: `km/h | mph | m/s`
  - Default Location: text input or search input
  - Theme: `dark | light`
- Persistence: LocalStorage with global application of selected values

## Engineering Structure Expectations
- `Weather` and `Settings` live under `components/`
- Logic split into `helpers/` and `hooks/`
- `App` refactored for readability and separation of concerns
- Relevant weather/settings styles moved from shared stylesheet into dedicated files

## Definition of Done
- Screen is reachable, usable, responsive, and persists data
- Refactor respects existing conventions and app remains fully functional
