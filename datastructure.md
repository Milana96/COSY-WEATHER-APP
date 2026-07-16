# Data Structure & DB Design: Weather App Planner

## App Overview
A single-page React Weather application featuring:
1. **Weather Screen**: 3D animations reflecting real-time weather data.
2. **Settings Screen**: User preferences (Units: Celsius/Fahrenheit, Wind speed, etc.).
3. **Planner Screen**: Suggests activities based on current/forecasted weather.

---

## Suggested Data Structures

### 1. UserPreference (Local Settings)
Stores how the user prefers to view their data.
* `id`: String (UUID or simple unique key)
* `temperatureUnit`: String ('C' | 'F')
* `windSpeedUnit`: String ('kmh' | 'mph' | 'ms')
* `theme`: String ('light' | 'dark' | 'system')

### 2. SavedLocation (Core App State)
Allows users to bookmark cities/locations they search for frequently.
* `id`: String/Number
* `cityName`: String
* `latitude`: Float
* `longitude`: Float
* `addedAt`: DateTime

### 3. Activity (Planner Recommendations)
A static or user-customizable list of activities suggested based on weather types.
* `id`: String
* `name`: String (e.g., "Go for a run", "Read a book indoors", "Go snowboarding")
* `idealWeatherCondition`: String ('sunny' | 'rainy' | 'cloudy' | 'snowy')
* `isOutdoor`: Boolean

### 4. PlannerEntry (User's Schedule)
Allows users to plan an activity for a specific day.
* `id`: String
* `locationId`: String (references SavedLocation)
* `activityId`: String (references Activity)
* `plannedDate`: Date
* `notes`: String