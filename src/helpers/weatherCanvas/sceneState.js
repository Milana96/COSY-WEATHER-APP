import { CANVAS_NUMBERS, CLOUD_DENSITY_BY_VISUAL, VISUAL_FALLBACK } from "./constants";
import { hashString, seededRandom } from "./math";

function createCloudParticles(random, width, densityFactor) {
  const cloudConfig = CANVAS_NUMBERS.CLOUDS;
  const cloudCount = Math.max(
    cloudConfig.MIN_COUNT,
    Math.floor((width / cloudConfig.WIDTH_DENSITY_DIVISOR) * densityFactor)
  );

  return Array.from({ length: cloudCount }, (_, index) => {
    const puffCount = cloudConfig.PUFF_COUNT_MIN + Math.floor(random() * cloudConfig.PUFF_COUNT_RANDOM);
    const puffs = Array.from({ length: puffCount }, () => ({
      ox: (random() - CANVAS_NUMBERS.HALF) * cloudConfig.PUFF_OFFSET_X,
      oy: (random() - CANVAS_NUMBERS.HALF) * cloudConfig.PUFF_OFFSET_Y,
      radius: random() * cloudConfig.PUFF_RADIUS_RANDOM + cloudConfig.PUFF_RADIUS_MIN,
      alpha: random() * cloudConfig.PUFF_ALPHA_RANDOM + cloudConfig.PUFF_ALPHA_MIN,
    }));

    return {
      x: random() * (width + cloudConfig.START_X_PADDING * 2) - cloudConfig.START_X_PADDING,
      y:
        random() * cloudConfig.LAYER_Y_RANDOM +
        cloudConfig.LAYER_Y_BASE +
        (index % cloudConfig.LAYER_Y_MODULO) * cloudConfig.LAYER_Y_STEP,
      z: random() * cloudConfig.Z_RANDOM + cloudConfig.Z_MIN,
      speed: random() * cloudConfig.SPEED_RANDOM + cloudConfig.SPEED_MIN,
      puffs,
    };
  });
}

function createRainParticles(random, width, height, isHeavyRain) {
  const rainConfig = CANVAS_NUMBERS.RAIN;
  const density = isHeavyRain ? rainConfig.WIDTH_DENSITY_HEAVY : rainConfig.WIDTH_DENSITY_NORMAL;
  const speedRandom = isHeavyRain ? rainConfig.SPEED_RANDOM_HEAVY : rainConfig.SPEED_RANDOM_NORMAL;
  const speedBase = isHeavyRain ? rainConfig.SPEED_BASE_HEAVY : rainConfig.SPEED_BASE_NORMAL;

  return Array.from(
    { length: Math.max(rainConfig.MIN_COUNT, Math.floor(width * density)) },
    () => ({
      x: random() * (width + rainConfig.X_PADDING * 2) - rainConfig.X_PADDING,
      y: random() * (height + rainConfig.Y_PADDING) - rainConfig.Y_PADDING,
      z: random() * rainConfig.Z_MAX,
      speed: random() * speedRandom + speedBase,
    })
  );
}

function createSnowParticles(random, width, height, isHeavySnow) {
  const snowConfig = CANVAS_NUMBERS.SNOW;
  const density = isHeavySnow ? snowConfig.WIDTH_DENSITY_HEAVY : snowConfig.WIDTH_DENSITY_NORMAL;

  return Array.from(
    { length: Math.max(snowConfig.MIN_COUNT, Math.floor(width * density)) },
    () => ({
      x: random() * (width + snowConfig.X_PADDING * 2) - snowConfig.X_PADDING,
      y: random() * (height + snowConfig.Y_PADDING_BOTTOM) - snowConfig.Y_PADDING_TOP,
      z: random() * snowConfig.Z_MAX,
      drift: random() * snowConfig.DRIFT_RANDOM + snowConfig.DRIFT_MIN,
      speed: random() * snowConfig.SPEED_RANDOM + snowConfig.SPEED_MIN,
    })
  );
}

function createStarParticles(random, width, height, isDay) {
  const starConfig = CANVAS_NUMBERS.STARFIELD;
  const starCount = isDay ? 0 : Math.max(starConfig.MIN_COUNT, Math.floor(width * starConfig.WIDTH_DENSITY));

  return Array.from({ length: starCount }, () => ({
    x: random() * width,
    y: random() * (height * starConfig.HEIGHT_CEILING_RATIO),
    r: random() * starConfig.RADIUS_RANDOM + starConfig.RADIUS_MIN,
    twinkle: random() * CANVAS_NUMBERS.FULL_CIRCLE,
  }));
}

export function createInitialSceneState() {
  // Mutable animation state is kept in one object to avoid React re-renders.
  return {
    width: 0,
    height: 0,
    horizonY: 0,
    animationFrame: undefined,
    tick: 0,
    rainParticles: [],
    cloudParticles: [],
    snowParticles: [],
    starParticles: [],
    lightningFrames: 0,
    random: Math.random,
  };
}

export function resizeScene({
  canvas,
  ctx,
  sceneState,
  visual: visualModeInput,
  weatherCode,
  isDay,
  sceneSeed,
  isHeavyRain,
  isHeavySnow,
}) {
  // Rebuild canvas dimensions and particle fields for deterministic scene resets.
  const devicePixelRatio = window.devicePixelRatio || 1;
  const nextWidth = canvas.clientWidth;
  const nextHeight = canvas.clientHeight;

  sceneState.width = nextWidth;
  sceneState.height = nextHeight;
  sceneState.horizonY = nextHeight * CANVAS_NUMBERS.HORIZON_RATIO;

  canvas.width = Math.floor(nextWidth * devicePixelRatio);
  canvas.height = Math.floor(nextHeight * devicePixelRatio);
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  const visualMode = CLOUD_DENSITY_BY_VISUAL[visualModeInput] ? visualModeInput : VISUAL_FALLBACK;
  const seed = `${sceneSeed}-${weatherCode}-${visualMode}-${nextWidth}-${nextHeight}`;
  const random = seededRandom(hashString(seed));
  sceneState.random = random;

  sceneState.rainParticles = createRainParticles(random, nextWidth, nextHeight, isHeavyRain);
  sceneState.cloudParticles = createCloudParticles(random, nextWidth, CLOUD_DENSITY_BY_VISUAL[visualMode]);
  sceneState.snowParticles = createSnowParticles(random, nextWidth, nextHeight, isHeavySnow);
  sceneState.starParticles = createStarParticles(random, nextWidth, nextHeight, isDay);
}
