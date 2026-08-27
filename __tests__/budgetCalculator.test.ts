import { calculateScfBudget, estimateWavePoints } from "../lib/budgetCalculator"

describe("calculateScfBudget", () => {
  it("calculates total from deliverables", () => {
    const result = calculateScfBudget({
      deliverables: [
        { name: "Core SDK", hours: 80, hourlyRate: 50 },
        { name: "Frontend", hours: 40, hourlyRate: 60 },
      ],
    })
    expect(result.items).toHaveLength(2)
    expect(result.items[0].cost).toBe(4000)
    expect(result.items[1].cost).toBe(2400)
    expect(result.total).toBe(6400)
  })

  it("returns zero for empty deliverables", () => {
    const result = calculateScfBudget({ deliverables: [] })
    expect(result.total).toBe(0)
  })
})

describe("estimateWavePoints", () => {
  it("computes the Wave 8 point model correctly", () => {
    const result = estimateWavePoints({
      trivialIssues: 5,
      mediumIssues: 3,
      highIssues: 1,
    })
    expect(result.trivial.points).toBe(500)
    expect(result.medium.points).toBe(450)
    expect(result.high.points).toBe(200)
    expect(result.totalPoints).toBe(1150)
  })

  it("estimates hours", () => {
    const result = estimateWavePoints({
      trivialIssues: 1,
      mediumIssues: 0,
      highIssues: 0,
    })
    expect(result.estimatedHours.min).toBe(2)
    expect(result.estimatedHours.max).toBe(8)
  })

  it("handles zero issues", () => {
    const result = estimateWavePoints({
      trivialIssues: 0,
      mediumIssues: 0,
      highIssues: 0,
    })
    expect(result.totalPoints).toBe(0)
    expect(result.estimatedHours.max).toBe(0)
  })

  it("scales with multiple issues", () => {
    const result = estimateWavePoints({
      trivialIssues: 10,
      mediumIssues: 5,
      highIssues: 3,
    })
    expect(result.totalPoints).toBe(10 * 100 + 5 * 150 + 3 * 200)
    expect(result.estimatedHours.min).toBe(10 * 2 + 5 * 8 + 3 * 20)
    expect(result.estimatedHours.max).toBe(10 * 8 + 5 * 20 + 3 * 40)
  })
})
