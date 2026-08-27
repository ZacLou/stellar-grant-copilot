import { scoreProposal, type ReadinessLevel } from "@/lib/scoring";
import type { Proposal } from "@/lib/types";

const LEVEL_COLORS: Record<ReadinessLevel, string> = {
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  yellow: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const LEVEL_DOT: Record<ReadinessLevel, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
};

interface ReadinessChecklistProps {
  proposal: Proposal;
}

export default function ReadinessChecklist({ proposal }: ReadinessChecklistProps) {
  const score = scoreProposal(proposal);

  return (
    <div className="space-y-4">
      {/* Overall indicator */}
      <div className="flex items-center gap-3 rounded-lg border p-4">
        <span className={`h-4 w-4 rounded-full ${LEVEL_DOT[score.overall]}`} />
        <span className="text-sm font-semibold">
          Overall readiness:{" "}
          <span className="capitalize">{score.overall}</span>
        </span>
        <span className="text-xs text-muted-foreground">
          {score.sections.filter((s) => s.level === "green").length}/{score.sections.length} sections ready
        </span>
      </div>

      {/* Per-section scores */}
      {score.sections.map((section) => (
        <details key={section.sectionId} className="rounded-lg border">
          <summary className="flex cursor-pointer items-center gap-3 p-4">
            <span className={`h-3 w-3 rounded-full ${LEVEL_DOT[section.level]}`} />
            <span className="flex-1 text-sm font-medium">{section.title}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_COLORS[section.level]}`}>
              {section.level}
            </span>
          </summary>
          <ul className="space-y-1 border-t px-4 py-3">
            {section.checks.map((check, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className={check.passed ? "text-emerald-500" : "text-muted-foreground/40"}>
                  {check.passed ? "✓" : "✗"}
                </span>
                <span className={check.passed ? "text-foreground" : "text-muted-foreground"}>
                  {check.label}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
