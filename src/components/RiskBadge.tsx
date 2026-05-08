import type { NivelRisco } from "@/lib/data";
import { classeBadgeRisco, rotuloRisco } from "@/lib/risk";

export function RiskBadge({
  nivel,
  className = "",
}: {
  nivel: NivelRisco | null | undefined;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${classeBadgeRisco(nivel)} ${className}`}
    >
      {rotuloRisco(nivel)}
    </span>
  );
}
