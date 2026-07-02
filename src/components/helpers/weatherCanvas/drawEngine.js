import { CANVAS_NUMBERS, CLOUD_COLOR_TOKEN_BY_VISUAL, VISUAL_FALLBACK } from "./constants";
import { projectPoint } from "./math";

function resolveCloudColor(theme, visualMode) {
  const colorToken = CLOUD_COLOR_TOKEN_BY_VISUAL[visualMode] ?? CLOUD_COLOR_TOKEN_BY_VISUAL.default;
  return theme.clouds[colorToken] ?? theme.clouds.default;
}

export function createDrawEngine({ ctx, sceneState, theme, isDay, isHeavyRain }) {
  const fullCircle = CANVAS_NUMBERS.FULL_CIRCLE;

  // Shared projection keeps all particle layers aligned with the same pseudo-3D depth.
  const project = (x, y, z) =>
    projectPoint({
      x,
      y,
      z,
      width: sceneState.width,
      horizonY: sceneState.horizonY,
      fov: CANVAS_NUMBERS.FOV,
    });

  function drawStarField() {
    const starConfig = CANVAS_NUMBERS.STARFIELD;

    sceneState.starParticles.forEach((star) => {
      const alpha =
        starConfig.ALPHA_BASE +
        Math.abs(Math.sin(sceneState.tick * starConfig.TWINKLE_SPEED + star.twinkle)) *
          starConfig.ALPHA_RANGE;

      ctx.fillStyle = `${theme.stars.color}${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, CANVAS_NUMBERS.COLOR_STOP.START, fullCircle);
      ctx.fill();
    });
  }

  function drawHaze(hazeColor) {
    const hazeConfig = CANVAS_NUMBERS.HAZE;
    const { width, height } = sceneState;

    ctx.fillStyle = hazeColor;
    ctx.beginPath();
    ctx.ellipse(
      width * hazeConfig.FIRST_X_RATIO,
      height * hazeConfig.FIRST_Y_RATIO,
      width * hazeConfig.FIRST_RX_RATIO,
      height * hazeConfig.FIRST_RY_RATIO,
      CANVAS_NUMBERS.COLOR_STOP.START,
      CANVAS_NUMBERS.COLOR_STOP.START,
      fullCircle
    );
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
      width * hazeConfig.SECOND_X_RATIO,
      height * hazeConfig.SECOND_Y_RATIO,
      width * hazeConfig.SECOND_RX_RATIO,
      height * hazeConfig.SECOND_RY_RATIO,
      CANVAS_NUMBERS.COLOR_STOP.START,
      CANVAS_NUMBERS.COLOR_STOP.START,
      fullCircle
    );
    ctx.fill();
  }

  function drawGroundGlow() {
    const groundGradient = ctx.createLinearGradient(
      CANVAS_NUMBERS.COLOR_STOP.START,
      sceneState.horizonY,
      CANVAS_NUMBERS.COLOR_STOP.START,
      sceneState.height
    );
    groundGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.START, theme.ground.top);
    groundGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.END, theme.ground.bottom);

    ctx.fillStyle = groundGradient;
    ctx.fillRect(
      CANVAS_NUMBERS.COLOR_STOP.START,
      sceneState.horizonY,
      sceneState.width,
      sceneState.height - sceneState.horizonY
    );
  }

  function drawBackground(visualMode) {
    const palette = theme.palettes[visualMode] ?? theme.palettes[VISUAL_FALLBACK];

    const skyGradient = ctx.createLinearGradient(
      CANVAS_NUMBERS.COLOR_STOP.START,
      CANVAS_NUMBERS.COLOR_STOP.START,
      sceneState.width,
      sceneState.height
    );
    skyGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.START, palette.skyA);
    skyGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.SKY_MID, palette.skyB);
    skyGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.END, palette.skyB);

    ctx.fillStyle = skyGradient;
    ctx.fillRect(
      CANVAS_NUMBERS.COLOR_STOP.START,
      CANVAS_NUMBERS.COLOR_STOP.START,
      sceneState.width,
      sceneState.height
    );

    if (!isDay) {
      drawStarField();
    }

    drawHaze(palette.haze);
    drawGroundGlow();
  }

  function drawSun() {
    const sunConfig = CANVAS_NUMBERS.SUN;
    const x = sceneState.width * sunConfig.X_RATIO;
    const y = sceneState.height * sunConfig.Y_RATIO;
    const baseRadius = Math.min(sceneState.width, sceneState.height) * sunConfig.RADIUS_RATIO;

    for (let index = 0; index < sunConfig.HALO_COUNT; index += 1) {
      const pulse =
        Math.sin(sceneState.tick * sunConfig.HALO_PULSE_SPEED + index) * sunConfig.HALO_PULSE_AMPLITUDE +
        index * sunConfig.HALO_GROW_STEP;

      const haloRadius = baseRadius + sunConfig.HALO_BASE_GROWTH + pulse;
      const haloGradient = ctx.createRadialGradient(
        x,
        y,
        baseRadius * sunConfig.HALO_INNER_RADIUS_RATIO,
        x,
        y,
        haloRadius
      );
      haloGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.START, theme.sun.haloStart);
      haloGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.END, theme.sun.haloEnd);

      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(x, y, haloRadius, CANVAS_NUMBERS.COLOR_STOP.START, fullCircle);
      ctx.fill();
    }

    const coreGradient = ctx.createRadialGradient(x, y, sunConfig.CORE_INNER_RADIUS, x, y, baseRadius);
    coreGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.START, theme.sun.coreInner);
    coreGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.END, theme.sun.coreOuter);

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(x, y, baseRadius, CANVAS_NUMBERS.COLOR_STOP.START, fullCircle);
    ctx.fill();

    ctx.strokeStyle = theme.sun.rayStroke;
    ctx.lineWidth = sunConfig.RAY_STROKE_WIDTH;

    for (let rayIndex = 0; rayIndex < sunConfig.RAY_COUNT; rayIndex += 1) {
      const angle = (fullCircle * rayIndex) / sunConfig.RAY_COUNT + sceneState.tick * sunConfig.RAY_SPIN_SPEED;
      const innerRadius = baseRadius + sunConfig.RAY_INNER_OFFSET;
      const outerRadius =
        baseRadius +
        sunConfig.RAY_OUTER_OFFSET +
        Math.sin(sceneState.tick * sunConfig.RAY_PULSE_SPEED + rayIndex) * sunConfig.RAY_PULSE_AMPLITUDE;

      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * innerRadius, y + Math.sin(angle) * innerRadius);
      ctx.lineTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius);
      ctx.stroke();
    }
  }

  function drawMoon() {
    const moonConfig = CANVAS_NUMBERS.MOON;
    const x = sceneState.width * moonConfig.X_RATIO;
    const y = sceneState.height * moonConfig.Y_RATIO;
    const radius = Math.min(sceneState.width, sceneState.height) * moonConfig.RADIUS_RATIO;

    const haloGradient = ctx.createRadialGradient(
      x,
      y,
      radius * moonConfig.HALO_INNER_RATIO,
      x,
      y,
      radius * moonConfig.HALO_OUTER_RATIO
    );
    haloGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.START, theme.moon.haloStart);
    haloGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.END, theme.moon.haloEnd);

    ctx.fillStyle = haloGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * moonConfig.HALO_OUTER_RATIO, CANVAS_NUMBERS.COLOR_STOP.START, fullCircle);
    ctx.fill();

    ctx.fillStyle = theme.moon.body;
    ctx.beginPath();
    ctx.arc(x, y, radius, CANVAS_NUMBERS.COLOR_STOP.START, fullCircle);
    ctx.fill();

    ctx.fillStyle = theme.moon.shadow;
    ctx.beginPath();
    ctx.arc(
      x + radius * moonConfig.SHADOW_OFFSET_X,
      y + radius * moonConfig.SHADOW_OFFSET_Y,
      radius * moonConfig.SHADOW_RADIUS_RATIO,
      CANVAS_NUMBERS.COLOR_STOP.START,
      fullCircle
    );
    ctx.fill();
  }

  function drawClouds(visualMode = VISUAL_FALLBACK) {
    const cloudConfig = CANVAS_NUMBERS.CLOUDS;
    const cloudColor = resolveCloudColor(theme, visualMode);

    sceneState.cloudParticles.sort((left, right) => right.z - left.z);

    // Draw from far to near to preserve depth cues when cloud puffs overlap.
    sceneState.cloudParticles.forEach((cloud, cloudIndex) => {
      cloud.x +=
        cloud.speed *
        (cloudConfig.X_SPEED_BASE +
          (cloudConfig.Z_SPEED_REFERENCE - cloud.z) / cloudConfig.X_SPEED_Z_SCALE);

      if (cloud.x > sceneState.width + cloudConfig.WRAP_RIGHT) {
        cloud.x = cloudConfig.WRAP_LEFT;
        cloud.y =
          ((cloudIndex % cloudConfig.WRAP_Y_MODULO) - cloudConfig.LAYER_Y_CENTER_OFFSET) *
            cloudConfig.WRAP_Y_BAND +
          cloudConfig.WRAP_Y_OFFSET;
      }

      const bobOffset =
        Math.sin((sceneState.tick + cloudIndex * cloudConfig.Y_BOB_INDEX_FACTOR) * cloudConfig.Y_BOB_SPEED) *
        cloudConfig.Y_BOB_AMPLITUDE;
      const projectedCloud = project(
        cloud.x - sceneState.width * CANVAS_NUMBERS.HALF,
        cloud.y + bobOffset,
        cloud.z
      );

      cloud.puffs.forEach((puff) => {
        const puffX = projectedCloud.x + puff.ox * projectedCloud.scale;
        const puffY = projectedCloud.y + puff.oy * projectedCloud.scale;
        const puffRadius = puff.radius * projectedCloud.scale;

        const puffGradient = ctx.createRadialGradient(
          puffX - puffRadius * cloudConfig.GRADIENT_CENTER_X_FACTOR,
          puffY - puffRadius * cloudConfig.GRADIENT_CENTER_Y_FACTOR,
          puffRadius * cloudConfig.GRADIENT_INNER_RADIUS_FACTOR,
          puffX,
          puffY,
          puffRadius
        );

        puffGradient.addColorStop(
          CANVAS_NUMBERS.COLOR_STOP.START,
          `${theme.clouds.whiteCore}${puff.alpha + cloudConfig.GRADIENT_WHITE_BOOST})`
        );
        puffGradient.addColorStop(cloudConfig.GRADIENT_MID_STOP, cloudColor);
        puffGradient.addColorStop(CANVAS_NUMBERS.COLOR_STOP.END, theme.clouds.outer);

        ctx.fillStyle = puffGradient;
        ctx.beginPath();
        ctx.arc(puffX, puffY, puffRadius, CANVAS_NUMBERS.COLOR_STOP.START, fullCircle);
        ctx.fill();
      });

      ctx.fillStyle = theme.clouds.shadow;
      ctx.beginPath();
      ctx.ellipse(
        projectedCloud.x,
        projectedCloud.y + cloudConfig.SHADOW_Y_OFFSET * projectedCloud.scale,
        cloudConfig.SHADOW_RX * projectedCloud.scale,
        cloudConfig.SHADOW_RY * projectedCloud.scale,
        CANVAS_NUMBERS.COLOR_STOP.START,
        CANVAS_NUMBERS.COLOR_STOP.START,
        fullCircle
      );
      ctx.fill();
    });
  }

  function drawRain() {
    const rainConfig = CANVAS_NUMBERS.RAIN;

    ctx.strokeStyle = theme.rain.stroke;
    ctx.lineCap = "round";

    sceneState.rainParticles.forEach((drop) => {
      const fallDistance = drop.speed * (rainConfig.FALL_BASE - drop.z / rainConfig.FALL_Z_DIVISOR);
      drop.y += fallDistance;
      drop.x -= rainConfig.X_DRIFT_BASE + (rainConfig.Z_MAX - drop.z) * rainConfig.X_DRIFT_Z_SCALE;

      if (drop.y > sceneState.height + rainConfig.RESET_Y_LIMIT || drop.x < rainConfig.RESET_X_LIMIT) {
        drop.y = rainConfig.RESET_Y;
        drop.x = sceneState.random() * (sceneState.width + rainConfig.RESET_X_PADDING) + rainConfig.RESET_X_OFFSET;
        drop.z = sceneState.random() * rainConfig.Z_MAX;
      }

      const projectedDrop = project(
        drop.x - sceneState.width * CANVAS_NUMBERS.HALF,
        drop.y - sceneState.horizonY,
        drop.z
      );

      const heavyBonus = isHeavyRain ? rainConfig.STREAK_HEAVY_BONUS : 0;
      const streakLength =
        Math.max(rainConfig.STREAK_MIN_LENGTH, (rainConfig.STREAK_BASE_LENGTH + heavyBonus) * projectedDrop.scale);
      const lineWidthScale = isHeavyRain ? rainConfig.LINE_WIDTH_HEAVY : rainConfig.LINE_WIDTH_NORMAL;

      ctx.lineWidth = Math.max(rainConfig.LINE_WIDTH_MIN, projectedDrop.scale * lineWidthScale);
      ctx.beginPath();
      ctx.moveTo(projectedDrop.x, projectedDrop.y);
      ctx.lineTo(projectedDrop.x - streakLength * rainConfig.STREAK_SLOPE, projectedDrop.y + streakLength);
      ctx.stroke();
    });
  }

  function drawSnow() {
    const snowConfig = CANVAS_NUMBERS.SNOW;

    ctx.fillStyle = theme.snow.fill;

    sceneState.snowParticles.forEach((flake, flakeIndex) => {
      flake.y += flake.speed * (snowConfig.FALL_BASE - flake.z / snowConfig.FALL_Z_DIVISOR);
      flake.x += Math.sin(sceneState.tick * snowConfig.DRIFT_SWAY_SPEED + flakeIndex) * flake.drift;

      if (flake.y > sceneState.height + snowConfig.RESET_Y_LIMIT) {
        flake.y = snowConfig.RESET_Y;
        flake.x = sceneState.random() * sceneState.width;
        flake.z = sceneState.random() * snowConfig.Z_MAX;
      }

      const projectedFlake = project(
        flake.x - sceneState.width * CANVAS_NUMBERS.HALF,
        flake.y - sceneState.horizonY,
        flake.z
      );

      const flakeRadius = Math.max(
        snowConfig.FLAKE_RADIUS_MIN,
        projectedFlake.scale * snowConfig.FLAKE_RADIUS_SCALE
      );

      ctx.beginPath();
      ctx.arc(
        projectedFlake.x,
        projectedFlake.y,
        flakeRadius,
        CANVAS_NUMBERS.COLOR_STOP.START,
        fullCircle
      );
      ctx.fill();
    });
  }

  function drawLightning() {
    const lightningConfig = CANVAS_NUMBERS.LIGHTNING;

    if (sceneState.lightningFrames > 0) {
      sceneState.lightningFrames -= 1;
    } else if (sceneState.random() > lightningConfig.TRIGGER_THRESHOLD) {
      sceneState.lightningFrames = lightningConfig.FLASH_FRAMES;
    }

    if (sceneState.lightningFrames <= 0) {
      return;
    }

    ctx.fillStyle = theme.lightning.flash;
    ctx.fillRect(
      CANVAS_NUMBERS.COLOR_STOP.START,
      CANVAS_NUMBERS.COLOR_STOP.START,
      sceneState.width,
      sceneState.height
    );

    ctx.strokeStyle = theme.lightning.stroke;
    ctx.lineWidth = lightningConfig.STROKE_WIDTH;
    ctx.beginPath();

    lightningConfig.BOLT_POINTS.forEach(([xRatio, yRatio], index) => {
      const x = sceneState.width * xRatio;
      const y = sceneState.height * yRatio;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }

  return {
    drawBackground,
    drawSun,
    drawMoon,
    drawClouds,
    drawRain,
    drawSnow,
    drawLightning,
  };
}
