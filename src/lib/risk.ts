import type { NivelRisco } from "./data";

export function rotuloRisco(nivel: NivelRisco | null | undefined): string {
  if (nivel === "baixo") return "Baixo";
  if (nivel === "medio") return "Médio";
  if (nivel === "alto") return "Alto";
  return "Sem dados";
}

export function corRiscoHex(nivel: NivelRisco | null | undefined): string {
  // Cores fixas para o Leaflet (não aceita CSS vars facilmente)
  if (nivel === "baixo") return "#16a34a";
  if (nivel === "medio") return "#d97706";
  if (nivel === "alto") return "#dc2626";
  return "#94a3b8";
}

export function classeBadgeRisco(nivel: NivelRisco | null | undefined): string {
  if (nivel === "baixo") return "bg-risk-low text-risk-low-foreground";
  if (nivel === "medio") return "bg-risk-medium text-risk-medium-foreground";
  if (nivel === "alto") return "bg-risk-high text-risk-high-foreground";
  return "bg-risk-unknown text-white";
}

const nf0 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export const fmtNum = (n: number) => nf1.format(n);
export const fmtInt = (n: number) => nf0.format(Math.round(n));

export function fmtKm(metros: number): string {
  return `${nf1.format(metros / 1000)} km`;
}
