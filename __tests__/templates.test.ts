import { TEMPLATES, getTemplate, getTemplatesByTrack } from "../lib/templates"

describe("templates", () => {
  it("has all four template types", () => {
    expect(Object.keys(TEMPLATES)).toHaveLength(4)
    expect(TEMPLATES["scf-open"]).toBeDefined()
    expect(TEMPLATES["scf-integration"]).toBeDefined()
    expect(TEMPLATES["scf-rfp"]).toBeDefined()
    expect(TEMPLATES["wave-repo"]).toBeDefined()
  })

  it("getTemplate returns the correct template", () => {
    const t = getTemplate("scf-open")
    expect(t.id).toBe("scf-open")
    expect(t.track).toBe("SCF")
    expect(t.sections.problemStatement).toBeDefined()
  })

  it("getTemplatesByTrack filters correctly", () => {
    const scf = getTemplatesByTrack("SCF")
    expect(scf).toHaveLength(3)
    expect(scf.every((t) => t.track === "SCF")).toBe(true)

    const wave = getTemplatesByTrack("Wave")
    expect(wave).toHaveLength(1)
    expect(wave[0].id).toBe("wave-repo")
  })

  it("each template has at least one section override", () => {
    Object.values(TEMPLATES).forEach((t) => {
      expect(Object.keys(t.sections).length).toBeGreaterThan(0)
    })
  })
})
