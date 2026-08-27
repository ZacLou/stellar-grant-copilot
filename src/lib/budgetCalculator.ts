export interface ScfBudgetInput {
  deliverables: { name: string; hours: number; hourlyRate: number }[];
}

export interface ScfBudgetOutput {
  items: { name: string; hours: number; rate: number; cost: number }[];
  total: number;
}

export interface WaveEstimateInput {
  trivialIssues: number;   // 100 points each
  mediumIssues: number;    // 150 points each
  highIssues: number;      // 200 points each
}

export interface WaveEstimateOutput {
  trivial: { count: number; points: number };
  medium: { count: number; points: number };
  high: { count: number; points: number };
  totalPoints: number;
  // Rough hour estimates based on Wave issue scoring model
  estimatedHours: { min: number; max: number };
  // Trivial: 2-8hrs, Medium: 8-20hrs, High: 20-40hrs
}

const POINTS = { trivial: 100, medium: 150, high: 200 };
const HOURS = {
  trivial: { min: 2, max: 8 },
  medium: { min: 8, max: 20 },
  high: { min: 20, max: 40 },
};

export function calculateScfBudget(input: ScfBudgetInput): ScfBudgetOutput {
  const items = input.deliverables.map((d) => ({
    name: d.name,
    hours: d.hours,
    rate: d.hourlyRate,
    cost: d.hours * d.hourlyRate,
  }));
  return {
    items,
    total: items.reduce((sum, i) => sum + i.cost, 0),
  };
}

export function estimateWavePoints(input: WaveEstimateInput): WaveEstimateOutput {
  const trivial = { count: input.trivialIssues, points: input.trivialIssues * POINTS.trivial };
  const medium = { count: input.mediumIssues, points: input.mediumIssues * POINTS.medium };
  const high = { count: input.highIssues, points: input.highIssues * POINTS.high };

  const totalPoints = trivial.points + medium.points + high.points;

  const estimatedHours = {
    min:
      input.trivialIssues * HOURS.trivial.min +
      input.mediumIssues * HOURS.medium.min +
      input.highIssues * HOURS.high.min,
    max:
      input.trivialIssues * HOURS.trivial.max +
      input.mediumIssues * HOURS.medium.max +
      input.highIssues * HOURS.high.max,
  };

  return { trivial, medium, high, totalPoints, estimatedHours };
}
