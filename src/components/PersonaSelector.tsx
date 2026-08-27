"use client"

import { PERSONAS, type ReviewerPersona } from "@/lib/reviewerPersona"

interface PersonaSelectorProps {
  selected: ReviewerPersona
  onSelect: (persona: ReviewerPersona) => void
}

export default function PersonaSelector({ selected, onSelect }: PersonaSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Reviewer Persona</label>
      <p className="text-xs text-muted-foreground">
        Choose the review voice to match the panel that will actually read your submission.
      </p>
      <div className="flex gap-2">
        {Object.values(PERSONAS).map((persona) => (
          <button
            key={persona.id}
            onClick={() => onSelect(persona.id)}
            className={`flex-1 rounded-lg border p-3 text-left transition-colors ${
              selected === persona.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:bg-muted/50"
            }`}
          >
            <div className="text-sm font-medium">{persona.label}</div>
            <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {persona.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
