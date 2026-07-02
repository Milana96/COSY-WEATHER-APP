import { useEffect, useRef } from "react";

const palettes = {
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
};

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function project(x, y, z, width, horizonY, fov = 680) {
  const depth = fov / (fov + z);
  return {
    x: width * 0.5 + x * depth,
    y: horizonY + y * depth,
    scale: depth,
  };
}

export default function WeatherCanvas({ visual, weatherCode = 0, isDay = 1, sceneSeed = "0" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let horizonY = 0;
    let animationFrame;
    let t = 0;

    let rainDrops = [];
    let cloudBodies = [];
    let snowNodes = [];
    let starNodes = [];
    let lightningFrames = 0;

    const isHeavyRain = [65, 67, 82, 99].includes(weatherCode);
    const isHeavySnow = [75, 86].includes(weatherCode);
    const cloudDensityFactor =
      visual === "clear" ? 0.5 : visual === "cloudy" ? 1 : visual === "rainy" ? 0.9 : 0.8;

    const makeCloudBodies = (random) => {
      const amount = Math.max(18, Math.floor((width / 90) * cloudDensityFactor));
      return Array.from({ length: amount }, (_, idx) => {
        const puffCount = 5 + Math.floor(random() * 6);
        const puffs = Array.from({ length: puffCount }, () => ({
          ox: (random() - 0.5) * 120,
          oy: (random() - 0.5) * 42,
          radius: random() * 42 + 34,
          alpha: random() * 0.18 + 0.12,
        }));

        return {
          x: random() * (width + 400) - 200,
          y: random() * 220 - 180 + (idx % 3) * 24,
          z: random() * 980 + 80,
          speed: random() * 0.24 + 0.08,
          puffs,
        };
      });
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      horizonY = height * 0.42;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const random = seededRandom(hashString(`${sceneSeed}-${weatherCode}-${visual}-${width}-${height}`));

      rainDrops = Array.from(
        { length: Math.max(240, Math.floor(width * (isHeavyRain ? 0.92 : 0.68))) },
        () => ({
          x: random() * (width + 300) - 150,
          y: random() * (height + 220) - 220,
          z: random() * 1200,
          speed: random() * (isHeavyRain ? 10 : 7) + (isHeavyRain ? 16 : 11),
        })
      );

      cloudBodies = makeCloudBodies(random);

      snowNodes = Array.from(
        { length: Math.max(220, Math.floor(width * (isHeavySnow ? 0.56 : 0.42))) },
        () => ({
          x: random() * (width + 220) - 110,
          y: random() * (height + 220) - 180,
          z: random() * 1200,
          drift: random() * 1.4 + 0.35,
          speed: random() * 1.6 + 0.8,
        })
      );

      starNodes = Array.from({ length: isDay ? 0 : Math.max(80, Math.floor(width * 0.12)) }, () => ({
        x: random() * width,
        y: random() * (height * 0.55),
        r: random() * 1.8 + 0.4,
        twinkle: random() * Math.PI * 2,
      }));
    };

    const drawBackground = (mode) => {
      const colors = palettes[mode] || palettes.clear;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, colors.skyA);
      grad.addColorStop(0.54, colors.skyB);
      grad.addColorStop(1, colors.skyB);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      if (!isDay) {
        starNodes.forEach((star) => {
          const alpha = 0.24 + Math.abs(Math.sin(t * 0.018 + star.twinkle)) * 0.5;
          ctx.fillStyle = `rgba(214, 230, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.fillStyle = colors.haze;
      ctx.beginPath();
      ctx.ellipse(width * 0.22, height * 0.88, width * 0.56, height * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(width * 0.82, height * 0.28, width * 0.34, height * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      const groundGlow = ctx.createLinearGradient(0, horizonY, 0, height);
      groundGlow.addColorStop(0, "rgba(255,255,255,0.05)");
      groundGlow.addColorStop(1, "rgba(0,0,0,0.28)");
      ctx.fillStyle = groundGlow;
      ctx.fillRect(0, horizonY, width, height - horizonY);
    };

    const drawSun = () => {
      const x = width * 0.74;
      const y = height * 0.25;
      const baseRadius = Math.min(width, height) * 0.09;

      for (let i = 0; i < 3; i += 1) {
        const pulse = Math.sin(t * 0.02 + i) * 4 + i * 8;
        const ring = ctx.createRadialGradient(x, y, baseRadius * 0.4, x, y, baseRadius + 30 + pulse);
        ring.addColorStop(0, "rgba(255,250,190,0.35)");
        ring.addColorStop(1, "rgba(255,210,60,0)");
        ctx.fillStyle = ring;
        ctx.beginPath();
        ctx.arc(x, y, baseRadius + 30 + pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      const core = ctx.createRadialGradient(x, y, 2, x, y, baseRadius);
      core.addColorStop(0, "#fff9d7");
      core.addColorStop(1, "#ffb400");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 223, 150, 0.35)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 18; i += 1) {
        const angle = (Math.PI * 2 * i) / 18 + t * 0.001;
        const r1 = baseRadius + 8;
        const r2 = baseRadius + 22 + Math.sin(t * 0.02 + i) * 6;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * r1, y + Math.sin(angle) * r1);
        ctx.lineTo(x + Math.cos(angle) * r2, y + Math.sin(angle) * r2);
        ctx.stroke();
      }
    };

    const drawMoon = () => {
      const x = width * 0.77;
      const y = height * 0.22;
      const radius = Math.min(width, height) * 0.07;

      const halo = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2.6);
      halo.addColorStop(0, "rgba(210, 224, 255, 0.38)");
      halo.addColorStop(1, "rgba(189, 214, 255, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#eef3ff";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(165, 185, 220, 0.44)";
      ctx.beginPath();
      ctx.arc(x + radius * 0.4, y - radius * 0.1, radius * 0.82, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawClouds = (mode = visual) => {
      const cloudColor =
        mode === "stormy"
          ? "rgba(197, 208, 224, 0.24)"
          : mode === "rainy"
            ? "rgba(219, 231, 245, 0.28)"
            : "rgba(241, 248, 255, 0.28)";

      cloudBodies.sort((a, b) => b.z - a.z);

      cloudBodies.forEach((cloud, idx) => {
        cloud.x += cloud.speed * (1.1 + (1200 - cloud.z) / 2100);
        if (cloud.x > width + 220) {
          cloud.x = -240;
          cloud.y = ((idx % 4) - 2) * 40 - 100;
        }

        const bob = Math.sin((t + idx * 13) * 0.01) * 8;
        const projected = project(cloud.x - width * 0.5, cloud.y + bob, cloud.z, width, horizonY);

        cloud.puffs.forEach((puff) => {
          const px = projected.x + puff.ox * projected.scale;
          const py = projected.y + puff.oy * projected.scale;
          const r = puff.radius * projected.scale;

          const gradient = ctx.createRadialGradient(
            px - r * 0.28,
            py - r * 0.25,
            r * 0.1,
            px,
            py,
            r
          );
          gradient.addColorStop(0, `rgba(255,255,255,${puff.alpha + 0.18})`);
          gradient.addColorStop(0.66, cloudColor);
          gradient.addColorStop(1, "rgba(170, 187, 210, 0.04)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = "rgba(49, 64, 89, 0.16)";
        ctx.beginPath();
        ctx.ellipse(projected.x, projected.y + 14 * projected.scale, 80 * projected.scale, 18 * projected.scale, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawRain = () => {
      ctx.strokeStyle = "rgba(150, 198, 255, 0.72)";
      ctx.lineCap = "round";

      rainDrops.forEach((drop) => {
        const fall = drop.speed * (1.2 - drop.z / 1700);
        drop.y += fall;
        drop.x -= 0.18 + (1200 - drop.z) * 0.00045;

        if (drop.y > height + 80 || drop.x < -220) {
          drop.y = -40;
          drop.x = Math.random() * (width + 160) + 20;
          drop.z = Math.random() * 1200;
        }

        const p = project(drop.x - width * 0.5, drop.y - horizonY, drop.z, width, horizonY);
        const len = Math.max(8, (26 + (isHeavyRain ? 10 : 0)) * p.scale);

        ctx.lineWidth = Math.max(1, p.scale * (isHeavyRain ? 2.9 : 2.2));
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - len * 0.28, p.y + len);
        ctx.stroke();
      });
    };

    const drawSnow = () => {
      ctx.fillStyle = "rgba(240, 250, 255, 0.86)";
      snowNodes.forEach((flake, idx) => {
        flake.y += flake.speed * (1.1 - flake.z / 1600);
        flake.x += Math.sin(t * 0.015 + idx) * flake.drift;

        if (flake.y > height + 28) {
          flake.y = -20;
          flake.x = Math.random() * width;
          flake.z = Math.random() * 1200;
        }

        const p = project(flake.x - width * 0.5, flake.y - horizonY, flake.z, width, horizonY);
        const r = Math.max(1, p.scale * 3.6);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawLightning = () => {
      if (lightningFrames > 0) {
        lightningFrames -= 1;
      } else if (Math.random() > 0.992) {
        lightningFrames = 2;
      }

      if (lightningFrames > 0) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "rgba(210, 226, 255, 0.9)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.58, 0);
        ctx.lineTo(width * 0.53, height * 0.2);
        ctx.lineTo(width * 0.61, height * 0.34);
        ctx.lineTo(width * 0.52, height * 0.58);
        ctx.lineTo(width * 0.58, height * 0.76);
        ctx.stroke();
      }
    };

    const render = () => {
      t += 1;
      drawBackground(visual);

      if (visual === "clear") {
        if (isDay) {
          drawSun();
        } else {
          drawMoon();
        }
        drawClouds("clear");
      }

      if (visual === "cloudy") {
        drawClouds("cloudy");
      }

      if (visual === "rainy") {
        drawClouds("rainy");
        drawRain();
      }

      if (visual === "snowy") {
        drawClouds("snowy");
        drawSnow();
      }

      if (visual === "stormy") {
        drawClouds("stormy");
        drawRain();
        drawLightning();
      }

      animationFrame = requestAnimationFrame(render);
    };

    resize();
    render();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [visual, weatherCode, isDay, sceneSeed]);

  return <canvas ref={canvasRef} className="weather-canvas" aria-label="Animated weather scene" />;
}
