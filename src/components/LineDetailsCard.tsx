import { X } from "lucide-react";
import type { LinhaAgrupada } from "@/lib/data";
import { fmtInt, fmtKm, fmtNum, rotuloRisco } from "@/lib/risk";
import { RiskBadge } from "./RiskBadge";

interface Props {
  linha: LinhaAgrupada;
  onClose: () => void;
}

export function LineDetailsCard({ linha, onClose }: Props) {
  const p = linha.previsao;
  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 z-[1000] w-[360px] max-w-[calc(100vw-2rem)] rounded-lg border bg-card/95 p-4 shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Linha
          </div>
          <h2 className="text-xl font-bold leading-tight text-foreground">
            {linha.servico}
          </h2>
          <p className="text-sm text-muted-foreground">
            {linha.destino || "—"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
        <dt className="text-muted-foreground">Extensão</dt>
        <dd className="text-right font-medium">{fmtKm(linha.extensao)}</dd>
        <dt className="text-muted-foreground">Consórcio</dt>
        <dd className="text-right font-medium">{linha.consorcio || "—"}</dd>
      </dl>

      <div className="mt-3 rounded-md border bg-background p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Nível de risco
            </div>
            <div className="text-base font-semibold">
              {rotuloRisco(p?.nivel_risco)}
            </div>
          </div>
          <RiskBadge nivel={p?.nivel_risco ?? null} />
        </div>
        {p && (
          <div className="mt-1 text-xs text-muted-foreground">
            Score: {fmtNum(p.score_risco)} · Z-score: {fmtNum(p.z_score)}
          </div>
        )}
      </div>

      {p ? (
        <>
          <div className="mt-3">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Previsão · {p.mes_previsto}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Furtos" value={fmtInt(p.previsao_furtos)} />
              <Stat label="Roubos" value={fmtInt(p.previsao_roubos)} />
              <Stat
                label="Tiroteios (30d)"
                value={fmtInt(p.previsao_tiroteios_30d)}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Média últimos 12 meses
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Furtos" value={fmtNum(p.media_furtos_12m)} muted />
              <Stat label="Roubos" value={fmtNum(p.media_roubos_12m)} muted />
              <Stat
                label="Tiroteios"
                value={fmtNum(p.media_tiroteios_12m)}
                muted
              />
            </div>
          </div>
        </>
      ) : (
        <p className="mt-3 rounded-md bg-muted p-3 text-center text-sm text-muted-foreground">
          Sem previsão disponível para esta linha.
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-2 ${muted ? "bg-muted/50" : "bg-card"}`}
    >
      <div className="text-base font-bold leading-tight">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
