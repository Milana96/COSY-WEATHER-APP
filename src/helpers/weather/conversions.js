export const convertTemperature = (value, unit) => {
  if (unit === "fahrenheit") {
    return {
      value: Math.round((value * 9) / 5 + 32),
      label: "°F",
    };
  }

  return {
    value,
    label: "°C",
  };
};

export const convertWindSpeed = (value, unit) => {
  if (unit === "mph") {
    return {
      value: Math.round(value * 0.621371),
      label: "mph",
    };
  }

  if (unit === "ms") {
    return {
      value: Number((value / 3.6).toFixed(1)),
      label: "m/s",
    };
  }

  return {
    value,
    label: "km/h",
  };
};
