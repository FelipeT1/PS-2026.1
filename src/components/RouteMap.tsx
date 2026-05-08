import { useEffect, useRef, useState } from "react";
import type { LinhaAgrupada } from "@/lib/data";
import { corRiscoHex } from "@/lib/risk";

interface Props {
  linhas: LinhaAgrupada[];
  selecionada: string | null;
  onSelect: (servico: string) => void;
}

export function RouteMap({ linhas, selecionada, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const polylineMapRef = useRef<Map<string, any[]>>(new Map());
  const [ready, setReady] = useState(false);

  // Init map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center: [-22.91, -43.45],
        zoom: 11,
        preferCanvas: true,
      });
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        },
      ).addTo(map);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      setReady(true);
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Draw all polylines once linhas loaded
  useEffect(() => {
    if (!ready || !mapRef.current || !layerRef.current || linhas.length === 0)
      return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;
      layerRef.current.clearLayers();
      polylineMapRef.current.clear();

      for (const linha of linhas) {
        const cor = corRiscoHex(linha.previsao?.nivel_risco ?? null);
        const lista: any[] = [];
        for (const shape of linha.shapes) {
          const latlngs = shape.geometry.coordinates.map(
            ([lng, lat]) => [lat, lng] as [number, number],
          );
          const pl = L.polyline(latlngs, {
            color: cor,
            weight: 1.5,
            opacity: 0.55,
          });
          pl.on("click", () => onSelect(linha.servico));
          pl.bindTooltip(`${linha.servico} — ${linha.destino ?? ""}`, {
            sticky: true,
          });
          pl.addTo(layerRef.current);
          lista.push(pl);
        }
        polylineMapRef.current.set(linha.servico, lista);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, linhas, onSelect]);

  // Highlight selected
  useEffect(() => {
    if (!ready) return;
    polylineMapRef.current.forEach((plList, servico) => {
      const ativo = servico === selecionada;
      for (const pl of plList) {
        pl.setStyle({
          weight: ativo ? 5 : 1.5,
          opacity: ativo ? 1 : selecionada ? 0.2 : 0.55,
        });
        if (ativo) pl.bringToFront();
      }
    });

    if (selecionada && mapRef.current) {
      const plList = polylineMapRef.current.get(selecionada);
      if (plList && plList.length > 0) {
        const bounds = plList[0].getBounds();
        for (let i = 1; i < plList.length; i++) {
          bounds.extend(plList[i].getBounds());
        }
        mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      }
    }
  }, [selecionada, ready]);

  return <div ref={containerRef} className="h-full w-full" />;
}
