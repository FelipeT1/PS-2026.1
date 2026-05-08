import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useLinhas } from "@/lib/data";
import { LineSidebar } from "@/components/LineSidebar";
import { LineDetailsCard } from "@/components/LineDetailsCard";
import { RouteMap } from "@/components/RouteMap";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: linhas, isLoading, error } = useLinhas();
  const [selecionada, setSelecionada] = useState<string | null>(null);

  const linhaSelecionada =
    linhas?.find((l) => l.servico === selecionada) ?? null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {isLoading || !linhas ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Carregando linhas e previsões…
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-destructive">
            Erro ao carregar dados: {(error as Error).message}
          </p>
        </div>
      ) : (
        <>
          <LineSidebar
            linhas={linhas}
            selecionada={selecionada}
            onSelect={setSelecionada}
          />
          <main className="relative flex-1">
            <RouteMap
              linhas={linhas}
              selecionada={selecionada}
              onSelect={setSelecionada}
            />
            {linhaSelecionada && (
              <LineDetailsCard
                linha={linhaSelecionada}
                onClose={() => setSelecionada(null)}
              />
            )}
            <div className="pointer-events-none absolute right-3 top-3 z-[1000] rounded-md border bg-card/95 p-3 text-xs shadow-md backdrop-blur">
              <div className="mb-1 font-semibold">Nível de risco</div>
              <LegItem color="#16a34a" label="Baixo" />
              <LegItem color="#d97706" label="Médio" />
              <LegItem color="#dc2626" label="Alto" />
              <LegItem color="#94a3b8" label="Sem dados" />
            </div>
          </main>
        </>
      )}
    </div>
  );
}

function LegItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-1 w-5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}
