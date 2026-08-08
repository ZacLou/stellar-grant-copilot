"use client";

import { useState } from "react";
import { SECTIONS, SectionId, ProposalSections } from "@/lib/types";

interface Props {
  sectionId: SectionId;
  value: string;
  onChange: (text: string) => void;
  track: "SCF" | "Wave";
  fullContext: ProposalSections;
}

export default function SectionCard({ sectionId, value, onChange, track, fullContext }: Props) {
  const def = SECTIONS[sectionId];
  const [review, setReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestReview() {
    setLoading(true);
    setError(null);
    setReview(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          track,
          sectionText: value,
          fullContext,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Review failed.");
        return;
      }
      setReview(data.review);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Review failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 16, margin: 0 }}>{def.title}</h2>
          <p style={{ color: "var(--text-dim)", fontSize: 13, margin: "4px 0 10px" }}>
            {def.description}
          </p>
        </div>
        <button
          onClick={requestReview}
          disabled={loading || value.trim().length === 0}
          title={value.trim().length === 0 ? "Write something first" : "Get grounded feedback"}
          style={{
            flexShrink: 0,
            background: "var(--panel-2)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 13,
            color: "var(--accent-2)",
            fontWeight: 600,
            opacity: value.trim().length === 0 ? 0.5 : 1,
          }}
        >
          {loading ? "Reviewing…" : "🔍 Review this section"}
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={def.placeholder}
        rows={6}
        style={{
          width: "100%",
          resize: "vertical",
          background: "var(--panel-2)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 10,
          color: "var(--text)",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      />

      {error && (
        <p style={{ color: "var(--bad)", fontSize: 13, marginTop: 8 }}>⚠ {error}</p>
      )}

      {review && (
        <div
          style={{
            marginTop: 12,
            background: "var(--panel-2)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 12,
            fontSize: 13.5,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {review}
        </div>
      )}
    </section>
  );
}
