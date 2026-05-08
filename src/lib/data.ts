import { useQuery } from "@tanstack/react-query";

export type NivelRisco = "baixo" | "medio" | "alto";

export interface Previsao {
  servico: string;
  mes_previsto: string;
  previsao_furtos: number;
  previsao_roubos: number;
  previsao_tiroteios_30d: number;
  media_furtos_12m: number;
  media_roubos_12m: number;
  media_tiroteios_12m: number;
  score_risco: number;
  z_score: number;
  nivel_risco: NivelRisco;
}

export interface ItinerarioProps {
  servico: string;
  destino: string | null;
  extensao: number;
  consorcio: string | null;
  tipo_rota: string | null;
  shape_id: string;
  direcao: string | null;
  tipo_dia: string | null;
}

export interface ItinerarioFeature {
  type: "Feature";
  properties: ItinerarioProps;
  geometry: { type: "LineString"; coordinates: [number, number][] };
}

export interface LinhaAgrupada {
  servico: string;
  destino: string;
  extensao: number;
  consorcio: string;
  shapes: ItinerarioFeature[];
  previsao: Previsao | null;
}

async function fetchItinerarios(): Promise<ItinerarioFeature[]> {
  const res = await fetch("/data/itinerarios.json");
  const json = await res.json();
  return json.features as ItinerarioFeature[];
}

async function fetchPrevisoes(): Promise<Previsao[]> {
  const res = await fetch("/data/previsoes.json");
  return (await res.json()) as Previsao[];
}

function pickLatest(previsoes: Previsao[]): Map<string, Previsao> {
  const map = new Map<string, Previsao>();
  for (const p of previsoes) {
    const key = String(p.servico).trim();
    const existing = map.get(key);
    if (!existing || p.mes_previsto > existing.mes_previsto) {
      map.set(key, p);
    }
  }
  return map;
}

export function useLinhas() {
  return useQuery({
    queryKey: ["linhas"],
    staleTime: Infinity,
    queryFn: async (): Promise<LinhaAgrupada[]> => {
      const [features, previsoes] = await Promise.all([
        fetchItinerarios(),
        fetchPrevisoes(),
      ]);
      const previsaoMap = pickLatest(previsoes);
      const grupos = new Map<string, LinhaAgrupada>();
      for (const f of features) {
        const servico = String(f.properties.servico ?? "").trim();
        if (!servico) continue;
        let g = grupos.get(servico);
        if (!g) {
          g = {
            servico,
            destino: f.properties.destino ?? "—",
            extensao: f.properties.extensao ?? 0,
            consorcio: f.properties.consorcio ?? "—",
            shapes: [],
            previsao:
              previsaoMap.get(servico) ??
              previsaoMap.get(servico.replace(/^0+/, "")) ??
              null,
          };
          grupos.set(servico, g);
        }
        g.shapes.push(f);
      }
      return Array.from(grupos.values()).sort((a, b) =>
        a.servico.localeCompare(b.servico, "pt-BR", { numeric: true }),
      );
    },
  });
}
