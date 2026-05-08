import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { LinhaAgrupada } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { RiskBadge } from "./RiskBadge";

interface Props {
  linhas: LinhaAgrupada[];
  selecionada: string | null;
  onSelect: (servico: string) => void;
}

export function LineSidebar({ linhas, selecionada, onSelect }: Props) {
  const [q, setQ] = useState("");

  const filtradas = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return linhas;
    return linhas.filter(
      (l) =>
        l.servico.toLowerCase().includes(t) ||
        (l.destino ?? "").toLowerCase().includes(t),
    );
  }, [linhas, q]);

  return (
    <aside className="flex h-full w-80 flex-col border-r bg-card">
      <div className="border-b p-4">
        <h1 className="text-lg font-bold tracking-tight text-primary">
          Rotas Seguras RJ
        </h1>
        <p className="text-xs text-muted-foreground">
          Previsão de risco em linhas de ônibus
        </p>
      </div>

      <div className="border-b p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar linha ou destino…"
            className="pl-8"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {filtradas.length} de {linhas.length} linhas
        </p>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {filtradas.slice(0, 500).map((l) => {
          const ativo = l.servico === selecionada;
          return (
            <li key={l.servico}>
              <button
                type="button"
                onClick={() => onSelect(l.servico)}
                className={`flex w-full items-center justify-between gap-2 border-b px-4 py-2.5 text-left transition-colors hover:bg-accent ${
                  ativo ? "bg-accent" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground">
                    {l.servico}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {l.destino || "—"}
                  </div>
                </div>
                <RiskBadge nivel={l.previsao?.nivel_risco ?? null} />
              </button>
            </li>
          );
        })}
        {filtradas.length > 500 && (
          <li className="px-4 py-3 text-center text-xs text-muted-foreground">
            Mostrando as primeiras 500. Refine a busca.
          </li>
        )}
      </ul>
    </aside>
  );
}
