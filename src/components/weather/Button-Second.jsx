const WEATHER_MODE_COPY = {
  clear: {
    title: "Solar mode",
    detailPrefix: "Bright skies and warm light",
  },
  cloudy: {
    title: "Cloud mode",
    detailPrefix: "Soft clouds moving in",
  },
  rainy: {
    title: "Rain mode",
    detailPrefix: "Rain is active right now",
  },
  snowy: {
    title: "Snow mode",
    detailPrefix: "Snowfall conditions detected",
  },
  stormy: {
    title: "Storm mode",
    detailPrefix: "Storm conditions in the area",
  },
};

function getModeCopy(mode) {
  return WEATHER_MODE_COPY[mode] ?? {
    title: "Adaptive mode",
    detailPrefix: "Current weather conditions",
  };
}

export default function ButtonSecond({ mode = "clear", detail = "" }) {
  const copy = getModeCopy(mode);

  return (
    <button type="button" className={`weather-button-second weather-button-second--${mode}`}>
      <span className="weather-button-second__kicker">Adaptive mode</span>
      <strong className="weather-button-second__title">{copy.title}</strong>
      <span className="weather-button-second__detail">
        {copy.detailPrefix}
        {detail ? ` · ${detail}` : ""}
      </span>
    </button>
  );
}
