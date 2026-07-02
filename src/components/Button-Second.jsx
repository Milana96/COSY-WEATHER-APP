const WEATHER_MODE_COPY = {
  clear: {
    title: "Button-Second: Sun Mode",
    detailPrefix: "Bright skies and warm light",
  },
  cloudy: {
    title: "Button-Second: Cloud Mode",
    detailPrefix: "Soft clouds moving in",
  },
  rainy: {
    title: "Button-Second: Rain Mode",
    detailPrefix: "Rain is active right now",
  },
  snowy: {
    title: "Button-Second: Snow Mode",
    detailPrefix: "Snowfall conditions detected",
  },
  stormy: {
    title: "Button-Second: Storm Mode",
    detailPrefix: "Storm conditions in the area",
  },
};

function getModeCopy(mode) {
  return WEATHER_MODE_COPY[mode] ?? {
    title: "Button-Second: Live Mode",
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
