const FALLBACK_THEME = {
  palettes: {
    clear: {
      skyA: "#ffbb5c",
      skyB: "#f0723d",
      haze: "rgba(255, 218, 137, 0.24)",
    },
    cloudy: {
      skyA: "#597190",
      skyB: "#29364f",
      haze: "rgba(197, 224, 255, 0.2)",
    },
    rainy: {
      skyA: "#304968",
      skyB: "#101a2a",
      haze: "rgba(100, 154, 255, 0.14)",
    },
    snowy: {
      skyA: "#a3bedf",
      skyB: "#6e86a5",
      haze: "rgba(255, 255, 255, 0.2)",
    },
    stormy: {
      skyA: "#222640",
      skyB: "#080a17",
      haze: "rgba(144, 168, 255, 0.1)",
    },
  },
  clouds: {
    stormy: "rgba(197, 208, 224, 0.24)",
    rainy: "rgba(219, 231, 245, 0.28)",
    default: "rgba(241, 248, 255, 0.28)",
    whiteCore: "rgba(255, 255, 255, ",
    outer: "rgba(170, 187, 210, 0.04)",
    shadow: "rgba(49, 64, 89, 0.16)",
  },
  stars: {
    color: "rgba(214, 230, 255, ",
  },
  ground: {
    top: "rgba(255, 255, 255, 0.05)",
    bottom: "rgba(0, 0, 0, 0.28)",
  },
  sun: {
    haloStart: "rgba(255, 250, 190, 0.35)",
    haloEnd: "rgba(255, 210, 60, 0)",
    coreInner: "#fff9d7",
    coreOuter: "#ffb400",
    rayStroke: "rgba(255, 223, 150, 0.35)",
  },
  moon: {
    haloStart: "rgba(210, 224, 255, 0.38)",
    haloEnd: "rgba(189, 214, 255, 0)",
    body: "#eef3ff",
    shadow: "rgba(165, 185, 220, 0.44)",
  },
  rain: {
    stroke: "rgba(150, 198, 255, 0.72)",
  },
  snow: {
    fill: "rgba(240, 250, 255, 0.86)",
  },
  lightning: {
    flash: "rgba(255, 255, 255, 0.2)",
    stroke: "rgba(210, 226, 255, 0.9)",
  },
};

function readCssValue(styles, cssVarName, fallback) {
  const cssValue = styles.getPropertyValue(cssVarName).trim();
  return cssValue || fallback;
}

export function buildCanvasTheme() {
  const styles = getComputedStyle(document.documentElement);

  return {
    palettes: {
      clear: {
        skyA: readCssValue(styles, "--wc-sky-clear-a", FALLBACK_THEME.palettes.clear.skyA),
        skyB: readCssValue(styles, "--wc-sky-clear-b", FALLBACK_THEME.palettes.clear.skyB),
        haze: readCssValue(styles, "--wc-haze-clear", FALLBACK_THEME.palettes.clear.haze),
      },
      cloudy: {
        skyA: readCssValue(styles, "--wc-sky-cloudy-a", FALLBACK_THEME.palettes.cloudy.skyA),
        skyB: readCssValue(styles, "--wc-sky-cloudy-b", FALLBACK_THEME.palettes.cloudy.skyB),
        haze: readCssValue(styles, "--wc-haze-cloudy", FALLBACK_THEME.palettes.cloudy.haze),
      },
      rainy: {
        skyA: readCssValue(styles, "--wc-sky-rainy-a", FALLBACK_THEME.palettes.rainy.skyA),
        skyB: readCssValue(styles, "--wc-sky-rainy-b", FALLBACK_THEME.palettes.rainy.skyB),
        haze: readCssValue(styles, "--wc-haze-rainy", FALLBACK_THEME.palettes.rainy.haze),
      },
      snowy: {
        skyA: readCssValue(styles, "--wc-sky-snowy-a", FALLBACK_THEME.palettes.snowy.skyA),
        skyB: readCssValue(styles, "--wc-sky-snowy-b", FALLBACK_THEME.palettes.snowy.skyB),
        haze: readCssValue(styles, "--wc-haze-snowy", FALLBACK_THEME.palettes.snowy.haze),
      },
      stormy: {
        skyA: readCssValue(styles, "--wc-sky-stormy-a", FALLBACK_THEME.palettes.stormy.skyA),
        skyB: readCssValue(styles, "--wc-sky-stormy-b", FALLBACK_THEME.palettes.stormy.skyB),
        haze: readCssValue(styles, "--wc-haze-stormy", FALLBACK_THEME.palettes.stormy.haze),
      },
    },
    clouds: {
      stormy: readCssValue(styles, "--wc-cloud-stormy", FALLBACK_THEME.clouds.stormy),
      rainy: readCssValue(styles, "--wc-cloud-rainy", FALLBACK_THEME.clouds.rainy),
      default: readCssValue(styles, "--wc-cloud-default", FALLBACK_THEME.clouds.default),
      whiteCore: FALLBACK_THEME.clouds.whiteCore,
      outer: readCssValue(styles, "--wc-cloud-outer", FALLBACK_THEME.clouds.outer),
      shadow: readCssValue(styles, "--wc-cloud-shadow", FALLBACK_THEME.clouds.shadow),
    },
    stars: {
      color: FALLBACK_THEME.stars.color,
    },
    ground: {
      top: readCssValue(styles, "--wc-ground-top", FALLBACK_THEME.ground.top),
      bottom: readCssValue(styles, "--wc-ground-bottom", FALLBACK_THEME.ground.bottom),
    },
    sun: {
      haloStart: readCssValue(styles, "--wc-sun-halo-start", FALLBACK_THEME.sun.haloStart),
      haloEnd: readCssValue(styles, "--wc-sun-halo-end", FALLBACK_THEME.sun.haloEnd),
      coreInner: readCssValue(styles, "--wc-sun-core-inner", FALLBACK_THEME.sun.coreInner),
      coreOuter: readCssValue(styles, "--wc-sun-core-outer", FALLBACK_THEME.sun.coreOuter),
      rayStroke: readCssValue(styles, "--wc-sun-ray-stroke", FALLBACK_THEME.sun.rayStroke),
    },
    moon: {
      haloStart: readCssValue(styles, "--wc-moon-halo-start", FALLBACK_THEME.moon.haloStart),
      haloEnd: readCssValue(styles, "--wc-moon-halo-end", FALLBACK_THEME.moon.haloEnd),
      body: readCssValue(styles, "--wc-moon-body", FALLBACK_THEME.moon.body),
      shadow: readCssValue(styles, "--wc-moon-shadow", FALLBACK_THEME.moon.shadow),
    },
    rain: {
      stroke: readCssValue(styles, "--wc-rain-stroke", FALLBACK_THEME.rain.stroke),
    },
    snow: {
      fill: readCssValue(styles, "--wc-snow-fill", FALLBACK_THEME.snow.fill),
    },
    lightning: {
      flash: readCssValue(styles, "--wc-lightning-flash", FALLBACK_THEME.lightning.flash),
      stroke: readCssValue(styles, "--wc-lightning-stroke", FALLBACK_THEME.lightning.stroke),
    },
  };
}
