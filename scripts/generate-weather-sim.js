import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const outputJsonPath = path.join(projectRoot, "public", "weather-simulation.json");
const outputEnvPath = path.join(projectRoot, ".env");

const SIMULATION_LOCATION = "Arctic_Circle";
const SIMULATED_CITY = "Adventure Town";
const SIMULATED_COUNTRY = "Simland";
const SIMULATED_TIMEZONE = "Arctic/Longyearbyen";

const WEATHER_PROFILES = {
  clear: {
    id: 800,
    main: "Clear",
    description: "clear sky",
    icon: "01d",
    tempMin: 18,
    tempMax: 29,
    windMin: 1,
    windMax: 6,
    humidityMin: 28,
    humidityMax: 48,
    popMin: 0,
    popMax: 0.1,
    rainMax: 0,
    snowMax: 0,
    uviMin: 6,
    uviMax: 10,
    alertLevel: 0,
  },
  heavy_rain: {
    id: 502,
    main: "Rain",
    description: "heavy intensity rain",
    icon: "10d",
    tempMin: 9,
    tempMax: 17,
    windMin: 6,
    windMax: 15,
    humidityMin: 76,
    humidityMax: 98,
    popMin: 0.75,
    popMax: 1,
    rainMax: 46,
    snowMax: 0,
    uviMin: 1,
    uviMax: 3,
    alertLevel: 2,
  },
  thunderstorm: {
    id: 211,
    main: "Thunderstorm",
    description: "thunderstorm",
    icon: "11d",
    tempMin: 16,
    tempMax: 26,
    windMin: 10,
    windMax: 22,
    humidityMin: 72,
    humidityMax: 96,
    popMin: 0.85,
    popMax: 1,
    rainMax: 58,
    snowMax: 0,
    uviMin: 0,
    uviMax: 2,
    alertLevel: 3,
  },
  heavy_snow: {
    id: 602,
    main: "Snow",
    description: "heavy snow",
    icon: "13d",
    tempMin: -19,
    tempMax: -3,
    windMin: 4,
    windMax: 12,
    humidityMin: 68,
    humidityMax: 92,
    popMin: 0.7,
    popMax: 1,
    rainMax: 0,
    snowMax: 32,
    uviMin: 0,
    uviMax: 1,
    alertLevel: 3,
  },
  extreme_heat: {
    id: 800,
    main: "Clear",
    description: "extreme heat",
    icon: "01d",
    tempMin: 35,
    tempMax: 45,
    windMin: 2,
    windMax: 10,
    humidityMin: 12,
    humidityMax: 33,
    popMin: 0,
    popMax: 0.05,
    rainMax: 0,
    snowMax: 0,
    uviMin: 9,
    uviMax: 12,
    alertLevel: 3,
  },
  cloudy: {
    id: 803,
    main: "Clouds",
    description: "broken clouds",
    icon: "04d",
    tempMin: 11,
    tempMax: 21,
    windMin: 3,
    windMax: 9,
    humidityMin: 52,
    humidityMax: 74,
    popMin: 0.1,
    popMax: 0.35,
    rainMax: 2,
    snowMax: 0,
    uviMin: 2,
    uviMax: 5,
    alertLevel: 0,
  },
};

const REQUIRED_PATTERN = ["extreme_heat", "thunderstorm", "heavy_snow", "heavy_rain", "clear"];

const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.round(rand(min, max));

const createTempPack = (min, max) => {
  const day = rand(min, max);
  const night = day - rand(3, 11);
  const morn = day - rand(1, 6);
  const eve = day - rand(0, 4);

  return {
    day: Number(day.toFixed(1)),
    min: Number(Math.min(day, night, morn, eve).toFixed(1)),
    max: Number(Math.max(day, night, morn, eve).toFixed(1)),
    night: Number(night.toFixed(1)),
    eve: Number(eve.toFixed(1)),
    morn: Number(morn.toFixed(1)),
  };
};

const getProfileSequence = () => {
  const profileKeys = Object.keys(WEATHER_PROFILES);
  const sequence = [...REQUIRED_PATTERN];

  while (sequence.length < 7) {
    const next = profileKeys[randInt(0, profileKeys.length - 1)];
    sequence.push(next);
  }

  return sequence.slice(0, 7);
};

const makeDailyEntry = (dt, profileName, idx) => {
  const profile = WEATHER_PROFILES[profileName];
  const temps = createTempPack(profile.tempMin, profile.tempMax);
  const feelsLikeOffset = rand(-2, 2);

  const rainAmount = profile.rainMax > 0 ? Number(rand(0, profile.rainMax).toFixed(2)) : undefined;
  const snowAmount = profile.snowMax > 0 ? Number(rand(0, profile.snowMax).toFixed(2)) : undefined;

  const entry = {
    dt,
    sunrise: dt - 4 * 3600,
    sunset: dt + 5 * 3600,
    moonrise: dt + 9 * 3600,
    moonset: dt + 19 * 3600,
    moon_phase: Number(rand(0, 1).toFixed(2)),
    summary: `Day ${idx + 1} simulation: ${profile.description}`,
    temp: temps,
    feels_like: {
      day: Number((temps.day + feelsLikeOffset).toFixed(1)),
      night: Number((temps.night + feelsLikeOffset).toFixed(1)),
      eve: Number((temps.eve + feelsLikeOffset).toFixed(1)),
      morn: Number((temps.morn + feelsLikeOffset).toFixed(1)),
    },
    pressure: randInt(980, 1038),
    humidity: randInt(profile.humidityMin, profile.humidityMax),
    dew_point: Number(rand(-18, 24).toFixed(1)),
    wind_speed: Number(rand(profile.windMin, profile.windMax).toFixed(1)),
    wind_deg: randInt(0, 359),
    wind_gust: Number(rand(profile.windMax, profile.windMax + 8).toFixed(1)),
    weather: [
      {
        id: profile.id,
        main: profile.main,
        description: profile.description,
        icon: profile.icon,
      },
    ],
    clouds: randInt(0, 100),
    pop: Number(rand(profile.popMin, profile.popMax).toFixed(2)),
    uvi: Number(rand(profile.uviMin, profile.uviMax).toFixed(1)),
    alert_level: profile.alertLevel,
  };

  if (rainAmount !== undefined) {
    entry.rain = rainAmount;
  }

  if (snowAmount !== undefined) {
    entry.snow = snowAmount;
  }

  return entry;
};

const makeHourlyEntries = (startDt, profileSequence) => {
  const hourly = [];

  for (let i = 0; i < 48; i += 1) {
    const hourDt = startDt + i * 3600;
    const dayIndex = Math.floor(i / 24);
    const profileName = profileSequence[Math.min(dayIndex, profileSequence.length - 1)];
    const profile = WEATHER_PROFILES[profileName];

    const baseTemp = rand(profile.tempMin, profile.tempMax);
    const tempDropAtNight = i % 24 >= 20 || i % 24 <= 5 ? rand(2, 6) : 0;

    hourly.push({
      dt: hourDt,
      temp: Number((baseTemp - tempDropAtNight).toFixed(1)),
      feels_like: Number((baseTemp - tempDropAtNight + rand(-1.5, 1.5)).toFixed(1)),
      pressure: randInt(980, 1038),
      humidity: randInt(profile.humidityMin, profile.humidityMax),
      dew_point: Number(rand(-18, 24).toFixed(1)),
      wind_speed: Number(rand(profile.windMin, profile.windMax).toFixed(1)),
      wind_deg: randInt(0, 359),
      wind_gust: Number(rand(profile.windMax, profile.windMax + 8).toFixed(1)),
      weather: [
        {
          id: profile.id,
          main: profile.main,
          description: profile.description,
          icon: profile.icon,
        },
      ],
      clouds: randInt(0, 100),
      pop: Number(rand(profile.popMin, profile.popMax).toFixed(2)),
      rain: profile.rainMax > 0 ? { "1h": Number(rand(0, profile.rainMax / 6).toFixed(2)) } : undefined,
      snow: profile.snowMax > 0 ? { "1h": Number(rand(0, profile.snowMax / 8).toFixed(2)) } : undefined,
      uvi: Number(rand(profile.uviMin, profile.uviMax).toFixed(1)),
    });
  }

  return hourly;
};

const buildSimulationPayload = () => {
  const nowUnix = Math.floor(Date.now() / 1000);
  const startOfTodayNoon = nowUnix - (nowUnix % 86400) + 12 * 3600;
  const profileSequence = getProfileSequence();

  const daily = profileSequence.map((profileName, idx) =>
    makeDailyEntry(startOfTodayNoon + idx * 86400, profileName, idx)
  );

  const first = daily[0];
  const currentWeather = first.weather[0];

  const alerts = daily
    .filter((entry) => entry.alert_level >= 2)
    .map((entry, idx) => ({
      sender_name: "Simulation Control Center",
      event: entry.alert_level >= 3 ? "Severe Weather Alert" : "Weather Advisory",
      start: entry.dt - 3600,
      end: entry.dt + 10 * 3600,
      description: `${entry.summary}. Alert level ${entry.alert_level}/3 for animation stress testing.`,
      tags: ["simulation", currentWeather.main.toLowerCase(), `level-${entry.alert_level}`],
      severity: entry.alert_level,
      alert_id: `sim-alert-${idx + 1}`,
    }));

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      generator: "generate-weather-sim.js",
      simulationLocation: SIMULATION_LOCATION,
      units: "metric",
      forecastDays: 7,
      profileSequence,
    },
    lat: 78.2232,
    lon: 15.6469,
    timezone: SIMULATED_TIMEZONE,
    timezone_offset: 7200,
    city: {
      name: SIMULATED_CITY,
      country: SIMULATED_COUNTRY,
    },
    current: {
      dt: nowUnix,
      sunrise: first.sunrise,
      sunset: first.sunset,
      temp: first.temp.day,
      feels_like: first.feels_like.day,
      pressure: first.pressure,
      humidity: first.humidity,
      dew_point: first.dew_point,
      uvi: first.uvi,
      clouds: first.clouds,
      visibility: 10000,
      wind_speed: first.wind_speed,
      wind_deg: first.wind_deg,
      wind_gust: first.wind_gust,
      weather: first.weather,
      alert_level: first.alert_level,
    },
    hourly: makeHourlyEntries(nowUnix, profileSequence),
    daily,
    alerts,
  };
};

const buildEnvContent = () => {
  return [
    "# Auto-generated by scripts/generate-weather-sim.js",
    "# Re-run npm run generate:weather-sim to refresh simulation data.",
    "VITE_USE_MOCK_DATA=true",
    `VITE_SIMULATED_CITY="${SIMULATED_CITY}"`,
    "VITE_SIMULATION_SPEED_SEC=10",
    `VITE_SIMULATION_LOCATION="${SIMULATION_LOCATION}"`,
    "VITE_SIM_WEATHER_FILE=/weather-simulation.json",
    "VITE_API_BASE_URL=/api",
    "",
  ].join("\n");
};

const main = async () => {
  const payload = buildSimulationPayload();

  await mkdir(path.dirname(outputJsonPath), { recursive: true });
  await writeFile(outputJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await writeFile(outputEnvPath, buildEnvContent(), "utf8");

  console.log("Simulation assets generated successfully.");
  console.log(`- JSON: ${path.relative(projectRoot, outputJsonPath)}`);
  console.log(`- ENV: ${path.relative(projectRoot, outputEnvPath)}`);
};

main().catch((error) => {
  console.error("Failed to generate simulation assets.");
  console.error(error);
  process.exitCode = 1;
});
