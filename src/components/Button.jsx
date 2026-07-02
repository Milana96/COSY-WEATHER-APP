const WEATHER_BUTTON_COPY = {
  clear: "Sunny right now",
  cloudy: "Cloudy right now",
  rainy: "Rainy right now",
  snowy: "Snowy right now",
  stormy: "Stormy right now",
};

function getButtonCopy(mode) {
  return WEATHER_BUTTON_COPY[mode] ?? "Weather update";
}

export default function Button({ mode = "clear", detail = "", onClick, type = "button" }) {
  return (
    <button
      type={type}
      className={`weather-button weather-button--${mode}`}
      onClick={onClick}
    >
      <span className="weather-button__kicker">Current weather</span>
      <strong className="weather-button__title">{getButtonCopy(mode)}</strong>
      {detail ? <span className="weather-button__detail">{detail}</span> : null}
    </button>
  );
}
