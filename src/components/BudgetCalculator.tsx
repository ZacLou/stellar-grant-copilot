"use client"

import { useState } from "react"
import { calculateScfBudget, estimateWavePoints, type ScfBudgetInput, type WaveEstimateInput } from "@/lib/budgetCalculator"
import type { Proposal } from "@/lib/types"

interface BudgetCalculatorProps {
  proposal: Proposal
}

export default function BudgetCalculator({ proposal }: BudgetCalculatorProps) {
  const isWave = proposal.track === "Wave"
  
  // SCF state
  const [deliverables, setDeliverables] = useState<{ name: string; hours: number; rate: number }[]>([
    { name: "", hours: 0, rate: 50 }
  ])
  
  // Wave state
  const [trivial, setTrivial] = useState(0)
  const [medium, setMedium] = useState(0)
  const [high, setHigh] = useState(0)

  const scfResult = isWave ? null : calculateScfBudget({ deliverables: deliverables.filter(d => d.name) })
  const waveResult = isWave ? estimateWavePoints({ trivialIssues: trivial, mediumIssues: medium, highIssues: high }) : null

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <h3 className="text-sm font-semibold">
        {isWave ? "Wave Issue Point Estimator" : "SCF Budget Calculator"}
      </h3>

      {isWave ? (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Estimate how many Trivial (100pts), Medium (150pts), and High (200pts) issues your roadmap decomposes into. This helps reviewers understand your issue-scoping.
          </p>
          
          {["trivial", "medium", "high"].map((level) => (
            <div key={level} className="flex items-center gap-3">
              <label className="w-20 text-sm capitalize">{level}</label>
              <input
                type="number"
                min={0}
                value={level === "trivial" ? trivial : level === "medium" ? medium : high}
                onChange={(e) => {
                  const v = Math.max(0, parseInt(e.target.value) || 0)
                  if (level === "trivial") setTrivial(v)
                  else if (level === "medium") setMedium(v)
                  else setHigh(v)
                }}
                className="w-20 rounded border px-2 py-1 text-sm"
              />
              <span className="text-xs text-muted-foreground">× {level === "trivial" ? "100" : level === "medium" ? "150" : "200"} pts</span>
            </div>
          ))}

          {waveResult && waveResult.totalPoints > 0 && (
            <div className="rounded bg-muted/50 p-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Points:</span>
                <span className="font-semibold">{waveResult.totalPoints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Hours:</span>
                <span>{waveResult.estimatedHours.min}–{waveResult.estimatedHours.max}h</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Trivial: 2-8h each · Medium: 8-20h · High: 20-40h
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Derive your budget from deliverables × estimated hours × hourly rate, following SCF best practices.
          </p>

          {deliverables.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                placeholder="Deliverable name"
                value={d.name}
                onChange={(e) => {
                  const next = [...deliverables]
                  next[i] = { ...next[i], name: e.target.value }
                  setDeliverables(next)
                }}
                className="flex-1 rounded border px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Hours"
                min={0}
                value={d.hours || ""}
                onChange={(e) => {
                  const next = [...deliverables]
                  next[i] = { ...next[i], hours: parseInt(e.target.value) || 0 }
                  setDeliverables(next)
                }}
                className="w-16 rounded border px-2 py-1 text-sm"
              />
              <span className="text-xs text-muted-foreground">× $</span>
              <input
                type="number"
                placeholder="Rate"
                min={0}
                value={d.rate || ""}
                onChange={(e) => {
                  const next = [...deliverables]
                  next[i] = { ...next[i], rate: parseInt(e.target.value) || 0 }
                  setDeliverables(next)
                }}
                className="w-16 rounded border px-2 py-1 text-sm"
              />
              {deliverables.length > 1 && (
                <button
                  onClick={() => setDeliverables(deliverables.filter((_, j) => j !== i))}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => setDeliverables([...deliverables, { name: "", hours: 0, rate: 50 }])}
            className="text-xs text-primary hover:underline"
          >
            + Add deliverable
          </button>

          {scfResult && scfResult.total > 0 && (
            <div className="rounded bg-muted/50 p-3 space-y-1 text-sm">
              {scfResult.items.filter(i => i.cost > 0).map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.name || `Item ${i + 1}`}: {item.hours}h × ${item.rate}/h</span>
                  <span>${item.cost.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-1 font-semibold">
                <span>Total Budget:</span>
                <span>${scfResult.total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
