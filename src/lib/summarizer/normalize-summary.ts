import {
  agreementSummarySchema,
  type AgreementSummary,
  type Recommendation,
  type RiskLevel,
} from "./types";

const RECOMMENDATIONS: Recommendation[] = [
  "sign",
  "negotiate",
  "reject",
  "seek_lawyer",
  "not_applicable",
];

const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high", "critical"];

const NON_AGREEMENT_HINTS =
  /resume|résumé|curriculum vitae|\bcv\b|cover letter|invoice|receipt|marksheet|transcript|id card|aadhaar card|pan card|passport|birth certificate|utility bill|bank statement|salary slip|payslip|menu|brochure|presentation|slides/i;

function normalizeRisk(value: unknown): RiskLevel {
  if (typeof value === "string" && RISK_LEVELS.includes(value as RiskLevel)) {
    return value as RiskLevel;
  }
  return "low";
}

function normalizeRecommendation(value: unknown, isAgreement: boolean): Recommendation {
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (RECOMMENDATIONS.includes(trimmed as Recommendation)) {
      return trimmed as Recommendation;
    }
    if (
      !isAgreement ||
      trimmed.includes("not applicable") ||
      trimmed.includes("no recommendation") ||
      trimmed.includes("n/a") ||
      trimmed.includes("none")
    ) {
      return "not_applicable";
    }
    if (trimmed.includes("reject") || trimmed.includes("do not")) return "reject";
    if (trimmed.includes("negotiat")) return "negotiate";
    if (trimmed.includes("lawyer") || trimmed.includes("legal advice")) return "seek_lawyer";
    if (trimmed.includes("sign") || trimmed.includes("safe")) return "sign";
  }
  return isAgreement ? "seek_lawyer" : "not_applicable";
}

function detectNonAgreement(raw: Record<string, unknown>, fileName: string): boolean {
  const meta = raw.meta as Record<string, unknown> | undefined;
  if (meta?.isAgreement === false) return true;

  const docType = String(meta?.documentType ?? "");
  const headline = String((raw.verdict as Record<string, unknown> | undefined)?.headline ?? "");
  const haystack = `${fileName} ${docType} ${headline}`;

  return NON_AGREEMENT_HINTS.test(haystack);
}

function asString(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
}

/** Coerce messy model JSON before Zod validation */
export function normalizeSummaryPayload(
  raw: unknown,
  fileName: string,
): Record<string, unknown> {
  if (!raw || typeof raw !== "object") {
    throw new Error("Could not read the analysis. Please try again.");
  }

  const data = { ...(raw as Record<string, unknown>) };
  const meta = { ...((data.meta as Record<string, unknown>) ?? {}) };
  const verdict = { ...((data.verdict as Record<string, unknown>) ?? {}) };

  const isAgreement =
    meta.isAgreement === false ? false : !detectNonAgreement(data, fileName);

  meta.isAgreement = isAgreement;
  meta.documentType = String(meta.documentType || "Document");
  meta.confidence =
    typeof meta.confidence === "number" ? Math.min(1, Math.max(0, meta.confidence)) : 0.5;
  meta.outputLanguage = String(meta.outputLanguage || "en");
  meta.wordCount = typeof meta.wordCount === "number" ? meta.wordCount : 0;

  verdict.overallRisk = normalizeRisk(verdict.overallRisk);
  verdict.riskScore =
    typeof verdict.riskScore === "number"
      ? Math.min(100, Math.max(0, verdict.riskScore))
      : isAgreement
        ? 50
        : 0;
  verdict.recommendation = normalizeRecommendation(verdict.recommendation, isAgreement);
  verdict.headline = String(verdict.headline || (isAgreement ? "Review this document carefully." : "This doesn't look like an agreement."));
  verdict.summary = String(
    verdict.summary ||
      (isAgreement
        ? "We analyzed your document."
        : "LegalHai is built for agreements you sign — rental contracts, offer letters, NDAs, and similar documents."),
  );
  verdict.recommendationReason = String(
    verdict.recommendationReason ||
      (isAgreement
        ? "Read the breakdown below before deciding."
        : "Try uploading a contract, offer letter, rent agreement, or NDA instead."),
  );

  if (!isAgreement) {
    verdict.recommendation = "not_applicable";
    verdict.overallRisk = "low";
    verdict.riskScore = 0;
  }

  const clauses = Array.isArray(data.clauses) ? data.clauses : [];
  const normalizedClauses = clauses.map((clause, index) => {
    const c = (clause as Record<string, unknown>) ?? {};
    return {
      id: asString(c.id, `clause-${index + 1}`),
      title: asString(c.title, `Clause ${index + 1}`),
      category: asString(c.category, "Other"),
      originalExcerpt: asString(c.originalExcerpt ?? c.excerpt).slice(0, 300),
      plainLanguage: asString(c.plainLanguage ?? c.summary ?? c.explanation, "See the original document."),
      risk: normalizeRisk(c.risk),
      riskReason: c.riskReason != null ? asString(c.riskReason) : undefined,
      realWorldExample: asString(c.realWorldExample ?? c.example, "Imagine signing without reading this — that's the risk."),
      whatToWatch: asString(c.whatToWatch ?? c.watch, "Read this carefully before signing."),
      negotiable: Boolean(c.negotiable),
    };
  });

  const redFlags = Array.isArray(data.redFlags) ? data.redFlags : [];
  const normalizedFlags = redFlags.map((flag, index) => {
    const f = (flag as Record<string, unknown>) ?? {};
    return {
      title: String(f.title || `Issue ${index + 1}`),
      severity: normalizeRisk(f.severity),
      explanation: String(f.explanation || f.description || "This clause needs a closer look."),
      clauseRef: f.clauseRef ? String(f.clauseRef) : undefined,
      action: String(f.action || "Ask the other party to clarify or negotiate this point."),
    };
  });

  const keyTerms = Array.isArray(data.keyTerms) ? data.keyTerms : [];
  const normalizedTerms = keyTerms.map((term, index) => {
    const t = (term as Record<string, unknown>) ?? {};
    return {
      label: String(t.label || `Term ${index + 1}`),
      value: String(t.value || "—"),
      importance: normalizeRisk(t.importance),
    };
  });

  const parties = Array.isArray(data.parties) ? data.parties : [];
  const normalizedParties = parties.map((party, index) => {
    const p = (party as Record<string, unknown>) ?? {};
    return {
      name: String(p.name || `Party ${index + 1}`),
      role: String(p.role || "Participant"),
    };
  });

  const keyDates = Array.isArray(data.keyDates) ? data.keyDates : [];
  const normalizedDates = keyDates.map((entry, index) => {
    const d = (entry as Record<string, unknown>) ?? {};
    const dateVal = d.date;
    return {
      label: String(d.label || `Date ${index + 1}`),
      date: typeof dateVal === "string" ? dateVal : dateVal === null ? null : null,
      note: d.note ? String(d.note) : undefined,
    };
  });

  const glossary = Array.isArray(data.glossary) ? data.glossary : [];
  const normalizedGlossary = glossary.map((entry) => {
    const g = (entry as Record<string, unknown>) ?? {};
    return {
      term: String(g.term || ""),
      definition: String(g.definition || ""),
    };
  }).filter((g) => g.term && g.definition);

  const obligations = (data.obligations as Record<string, unknown>) ?? {};

  return {
    ...data,
    meta,
    verdict,
    parties: normalizedParties,
    keyDates: normalizedDates,
    keyTerms: normalizedTerms,
    clauses: normalizedClauses,
    redFlags: normalizedFlags,
    obligations: {
      yours: asStringArray(obligations.yours),
      theirs: asStringArray(obligations.theirs),
    },
    beforeYouSign: {
      questions: asStringArray((data.beforeYouSign as Record<string, unknown>)?.questions),
      checklist: asStringArray((data.beforeYouSign as Record<string, unknown>)?.checklist),
    },
    glossary: normalizedGlossary,
  };
}

export function parseAgreementSummary(raw: unknown, fileName: string): AgreementSummary {
  const normalized = normalizeSummaryPayload(raw, fileName);
  const result = agreementSummarySchema.safeParse(normalized);

  if (!result.success) {
    console.error("Summary validation failed:", result.error.flatten());
    throw new Error(
      "We couldn't finish analyzing this document. Please try again — or upload a shorter PDF with fewer pages.",
    );
  }

  return result.data;
}
