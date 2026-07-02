import { useEffect, useRef } from "react";
import { createDrawEngine } from "./helpers/weatherCanvas/drawEngine";
import { CANVAS_NUMBERS, WEATHER_CODES } from "./helpers/weatherCanvas/constants";
import { createInitialSceneState, resizeScene } from "./helpers/weatherCanvas/sceneState";
import { runVisualStrategy } from "./helpers/weatherCanvas/strategies";
import { buildCanvasTheme } from "./helpers/weatherCanvas/theme";

export default function WeatherCanvas({ visual, weatherCode = 0, isDay = 1, sceneSeed = "0" }) {
  const canvasRef = useRef(null);
  const visualMode = visual;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const sceneState = createInitialSceneState();
    const isHeavyRain = WEATHER_CODES.HEAVY_RAIN.includes(weatherCode);
    const isHeavySnow = WEATHER_CODES.HEAVY_SNOW.includes(weatherCode);
    const theme = buildCanvasTheme();

    const drawEngine = createDrawEngine({
      ctx,
      sceneState,
      theme,
      isDay,
      isHeavyRain,
    });

    // Rebuild particles when canvas size or weather input changes.
    const resize = () => {
      resizeScene({
        canvas,
        ctx,
        sceneState,
        visual: visualMode,
        weatherCode,
        isDay,
        sceneSeed,
        isHeavyRain,
        isHeavySnow,
      });
    };

    // Strategy dispatcher keeps per-weather behavior out of the component.
    const render = () => {
      sceneState.tick += CANVAS_NUMBERS.TIME_STEP;
      drawEngine.drawBackground(visualMode);

      runVisualStrategy(visualMode, {
        isDay,
        drawSun: drawEngine.drawSun,
        drawMoon: drawEngine.drawMoon,
        drawClouds: drawEngine.drawClouds,
        drawRain: drawEngine.drawRain,
        drawSnow: drawEngine.drawSnow,
        drawLightning: drawEngine.drawLightning,
      });

      sceneState.animationFrame = requestAnimationFrame(render);
    };

    resize();
    render();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(sceneState.animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [visualMode, weatherCode, isDay, sceneSeed]);

  return <canvas ref={canvasRef} className="weather-canvas" aria-label="Animated weather scene" />;
}
