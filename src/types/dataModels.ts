export type TemperatureUnit = "C" | "F";
export type WindSpeedUnit = "kmh" | "mph" | "ms";
export type ThemeMode = "light" | "dark" | "system";
export type WeatherCondition = "sunny" | "rainy" | "cloudy" | "snowy";

export interface UserPreference {
  id: string;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  theme: ThemeMode;
}

export interface SavedLocation {
  id: string;
  cityName: string;
  latitude: number;
  longitude: number;
  addedAt: string;
}

export interface Activity {
  id: string;
  name: string;
  idealWeatherCondition: WeatherCondition;
  isOutdoor: boolean;
}

export interface PlannerEntry {
  id: string;
  locationId: string;
  activityId: string;
  plannedDate: string;
  notes: string;
}
