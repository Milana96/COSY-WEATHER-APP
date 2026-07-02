import { VISUAL_FALLBACK } from "./constants";

const VISUAL_STRATEGIES = {
  clear: ({ isDay, drawSun, drawMoon, drawClouds }) => {
    if (isDay) {
      drawSun();
    } else {
      drawMoon();
    }

    drawClouds("clear");
  },
  cloudy: ({ drawClouds }) => {
    drawClouds("cloudy");
  },
  rainy: ({ drawClouds, drawRain }) => {
    drawClouds("rainy");
    drawRain();
  },
  snowy: ({ drawClouds, drawSnow }) => {
    drawClouds("snowy");
    drawSnow();
  },
  stormy: ({ drawClouds, drawRain, drawLightning }) => {
    drawClouds("stormy");
    drawRain();
    drawLightning();
  },
};

export function runVisualStrategy(visualMode, strategyContext) {
  // Strategy pattern: each weather mode owns its own render behavior.
  const strategy = VISUAL_STRATEGIES[visualMode] ?? VISUAL_STRATEGIES[VISUAL_FALLBACK];
  strategy(strategyContext);
}
