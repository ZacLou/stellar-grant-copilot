"use client";

import { useEffect, useState } from "react";
import { emptyProposal, Proposal, SECTION_ORDER } from "@/lib/types";
import SectionCard from "@/components/SectionCard";

const STORAGE_KEY = "stellar-grant-copilot:proposal";

export default function Home() {
  const [proposal, setProposal] = useState<Proposal>(emptyProposal);
  const [loaded, setLoaded] = useState(false);
  const [exporting, setExporting] = useState<"md" | "pdf" | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProposal(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposal));
  }, [proposal, loaded]);

  function updateSection(id: keyof Proposal["sections"], text: string) {
    setProposal((p) => ({
      ...p,
      sections: { ...p.sections, [id]: text },
      updatedAt: new Date().toISOString(),
    }));
  }

  async function exportAs(format: "md" | "pdf") {
    setExporting(format);
    try {
      const res = await fetch(`/api/export/${format === "md" ? "markdown" : "pdf"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposal),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ??
        `proposal.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(`Export failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setExporting(null);
    }
  }

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "32px 20px 80px" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>🛰️ Stellar Grant Copilot</h1>
        <p style={{ color: "var(--text-dim)", margin: 0 }}>
          Draft, get grounded feedback on, and export SCF Build and Drips Wave repo
          applications.
        </p>
      </header>

      <section
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: 2, minWidth: 220 }}>
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Proposal title</span>
          <input
            value={proposal.title}
            onChange={(e) => setProposal((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. SEP-24 Debug Toolkit"
            style={{
              background: "var(--panel-2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "8px 10px",
              color: "var(--text)",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 160 }}>
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Track</span>
          <select
            value={proposal.track}
            onChange={(e) =>
              setProposal((p) => ({ ...p, track: e.target.value as Proposal["track"] }))
            }
            style={{
              background: "var(--panel-2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "8px 10px",
              color: "var(--text)",
            }}
          >
            <option value="SCF">SCF Build Award</option>
            <option value="Wave">Drips Wave (repo application)</option>
          </select>
        </label>

        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <button
            onClick={() => exportAs("md")}
            disabled={exporting !== null}
            style={btnStyle()}
          >
            {exporting === "md" ? "Exporting…" : "Export Markdown"}
          </button>
          <button
            onClick={() => exportAs("pdf")}
            disabled={exporting !== null}
            style={btnStyle(true)}
          >
            {exporting === "pdf" ? "Exporting…" : "Export PDF"}
          </button>
        </div>
      </section>

      {proposal.track === "Wave" && (
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: -12, marginBottom: 24 }}>
          Note: Drips Wave approves <em>repositories</em> into the Stellar Wave Program rather
          than funding individual project proposals — use these sections to make the case for
          your repo and to show you know how to scope issues into complexity-tagged tasks.{" "}
          <a href="https://docs.drips.network/wave/maintainers/participating-in-a-wave/" target="_blank" rel="noreferrer">
            See maintainer docs ↗
          </a>
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {SECTION_ORDER.map((id) => (
          <SectionCard
            key={id}
            sectionId={id}
            value={proposal.sections[id]}
            onChange={(text) => updateSection(id, text)}
            track={proposal.track}
            fullContext={proposal.sections}
          />
        ))}
      </div>

      <footer style={{ marginTop: 40, color: "var(--text-dim)", fontSize: 12 }}>
        Built for the Drips Wave Stellar Program. See README.md for grounding sources used in
        review feedback.
      </footer>
    </main>
  );
}

function btnStyle(primary = false): React.CSSProperties {
  return {
    background: primary ? "var(--accent)" : "var(--panel-2)",
    color: primary ? "#0b0e14" : "var(--text)",
    border: `1px solid ${primary ? "var(--accent)" : "var(--border)"}`,
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 600,
    fontSize: 13,
  };
}
