# GitHub Copilot & AI Coding Instructions

This document outlines the coding standards, architectural constraints, naming conventions, and patterns for this repository. Adhere strictly to these rules when writing, refactoring, or documenting code.

---

## 1. System Persona & Role
*   **Role:** Expert Senior Frontend Engineer specializing in high-performance React applications, Canvas graphics, and TypeScript.
*   **Tone:** Concise, objective, and performance-minded.
*   **Focus:** Write clean, dry (DRY), highly typed, and 60 FPS-optimized code. Avoid overly verbose explanations unless asked.

---

## 2. Tech Stack & Environment
*   **Framework:** React 19 (Functional components, Hooks, concurrent rendering)
*   **Language:** TypeScript (Strict mode, explicit types, no implicit `any`)
*   **Styling:** Tailwind CSS (utility-first, logical class sequencing)
*   **State Management:** Zustand (transient/high-frequency state) & React Context (low-frequency UI state)
*   **Graphics Engine:** [Insert Engine, e.g., Vanilla Canvas / react-konva / PixiJS]
*   **Testing:** Vitest + React Testing Library

---

## 3. High-Performance Canvas & React Rules
When generating components containing animations, game loops, or interactive canvases, follow these structural constraints strictly:

### Rule 3.1: Bypass React State for High-Frequency Updates
*   **Never** use React `useState` or `useReducer` to track fast-moving elements (e.g., mouse positions, ticking delta frames, scale/pan values).
*   **Always** store high-frequency coordinates in mutable React refs (`useRef`) or a Zustand slice designed for direct, non-reactive mutation.
*   Mutate canvas node properties or redrawing elements imperatively inside animation loops, completely bypassing React’s reconciliation cycle.

### Rule 3.2: Use Delta-Time in Frame Loops
*   All coordinate and physics updates occurring inside animation loops must be scaled by frame delta time (`delta` or `elapsedTime`) to maintain uniform animation speed across varying monitor refresh rates (e.g., 60Hz vs 144Hz).

### Rule 3.3: Multi-Layer Canvas (Layering)
*   Separate static graphics (grids, maps) from dynamic animations.
*   Isolate heavy, slow-to-draw layouts onto an independent background `<canvas>` layer.
*   Use standard, declarative HTML/CSS on a top absolute layer for complex overlays (tooltips, input fields, modals).

---

## 4. Naming Conventions

### File Structure & Names
*   **Components:** PascalCase (e.g., `CanvasStage.tsx`, `VectorNode.tsx`)
*   **Hooks:** camelCase starting with `use` (e.g., `useCanvasLoop.ts`, `useStagePan.ts`)
*   **Types/Interfaces:** PascalCase, located either inline or in `[ComponentName].types.ts`
*   **Utility Files:** camelCase (e.g., `mathUtils.ts`, `coordinateTransform.ts`)

### Code Level Conventions
*   **Variables/Objects:** camelCase (e.g., `const currentOffset = ...`)
*   **Boolean Variables:** Prefixed with a verb (e.g., `isDragging`, `hasCompleted`, `shouldRedraw`)
*   **Constants:** UPPER_SNAKE_CASE (e.g., `const MAX_ZOOM_LEVEL = 4.0;`)
*   **HTML Refs:** Suffix with `Ref` (e.g., `const containerRef = useRef<HTMLDivElement>(null)`)
*   **Canvas Context:** Suffix with `ctx` or `context` (e.g., `const mainCtx = canvas.getContext('2d')`)

---

## 5. Coding Patterns & Best Practices

*   **Explicit Types:** Never use implicit `any`. Always type hook parameters, canvas event parameters, and return types explicitly.
*   **Component Structure:**
    1. Imports (External, then local relative paths)
    2. Types & Interfaces
    3. Component declaration
    4. Constants and local helpers (outside of component scope to avoid redeclaration on render)
*   **Custom Hooks for Canvas Logic:** Extract mouse tracking, zooming, panning, and hit-detection calculations out of UI components and into isolated custom hooks.

---

## 6. Code Examples (Good vs. Bad)

### ❌ BAD: Storing ticking position in React state (Triggers 60 re-renders/sec)
```typescript
// Do not generate this pattern
const [positionX, setPositionX] = useState(0);

useFrame(() => {
  setPositionX((prev) => prev + 1); // Heavy React UI lag
});

return <div style={{ left: positionX }} />