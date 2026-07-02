export function seededRandom(seed) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function hashString(input) {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function projectPoint({ x, y, z, width, horizonY, fov }) {
  const depth = fov / (fov + z);

  return {
    x: width * 0.5 + x * depth,
    y: horizonY + y * depth,
    scale: depth,
  };
}
