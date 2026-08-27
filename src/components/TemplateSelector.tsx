"use client"

import { TEMPLATES, type TemplateId } from "@/lib/templates"

export default function TemplateSelector({
  selected,
  onSelect,
}: {
  selected: TemplateId | null
  onSelect: (id: TemplateId) => void
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Starter Template</label>
      <p className="text-xs text-muted-foreground">
        Choose a template with grant-specific placeholder copy and guidance.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.values(TEMPLATES).map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => onSelect(tmpl.id)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              selected === tmpl.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:bg-muted/50"
            }`}
          >
            <div className="text-sm font-medium">{tmpl.label}</div>
            <div className="mt-1 text-xs text-muted-foreground">{tmpl.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
