import type { RiskLevel, Recommendation } from "@/lib/summarizer/types";

export const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  low: {
    label: "Low risk",
    color: "text-emerald",
    bg: "bg-emerald/10",
    border: "border-emerald/30",
    dot: "bg-emerald",
  },
  medium: {
    label: "Medium risk",
    color: "text-saffron",
    bg: "bg-saffron/10",
    border: "border-saffron/30",
    dot: "bg-saffron",
  },
  high: {
    label: "High risk",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/30",
    dot: "bg-orange-400",
  },
  critical: {
    label: "Critical",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    dot: "bg-destructive",
  },
};

export const RECOMMENDATION_CONFIG: Record<
  Recommendation,
  { label: string; color: string; bg: string; icon: string }
> = {
  sign: { label: "Safe to sign", color: "text-emerald", bg: "bg-emerald/15", icon: "✓" },
  negotiate: { label: "Negotiate first", color: "text-saffron", bg: "bg-saffron/15", icon: "↔" },
  seek_lawyer: { label: "Get legal advice", color: "text-signal", bg: "bg-signal/15", icon: "⚖" },
  reject: { label: "Do not sign", color: "text-destructive", bg: "bg-destructive/15", icon: "✕" },
  not_applicable: {
    label: "Not an agreement",
    color: "text-muted-foreground",
    bg: "bg-white/5",
    icon: "ℹ",
  },
};

export const CLAUSE_CATEGORIES = [
  "Payment",
  "Duration",
  "Termination",
  "Liability",
  "Confidentiality",
  "Dispute",
  "Other",
] as const;
