import { useMemo } from "react";
import { generatePlannerInsights } from "../helpers/planner/insights";

export default function usePlannerAdvice(weather, settings) {
  return useMemo(() => generatePlannerInsights(weather, settings), [weather, settings]);
}
