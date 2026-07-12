import { cn } from "@/lib/utils";
import type { PlanoComStatus } from "@/core/services/manutencao.service";
import { BarraProgresso } from "./BarraProgresso";

const STATUS = {
  OK: { label: "OK", classe: "bg-green-500/20 text-green-400 border-green-500" },
  ATENCAO: { label: "ATENÇÃO", classe: "bg-yellow-500/20 text-yellow-400 border-yellow-500" },
  VENCIDA: { label: "VENCIDA", classe: "animate-pulse bg-red-500/20 text-red-400 border-red-500" },
} as const;

export function PlanoCard({ p }: { p: PlanoComStatus }) {
  const s = STATUS[p.status];
  const { intervaloKm, intervaloHoras, intervaloDias } = p.plano;
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-sm font-semibold text-gray-100">{p.plano.nome}</h3>
        <span className={cn("rounded-full border px-2 py-1 text-xs font-semibold", s.classe)}>
          {s.label}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {intervaloKm != null && (
          <BarraProgresso
            label="Km"
            pct={p.progressoKm}
            detalhe={`${Math.round((p.progressoKm / 100) * intervaloKm).toLocaleString("pt-BR")} de ${intervaloKm.toLocaleString("pt-BR")} km (${p.progressoKm}%)`}
          />
        )}
        {p.progressoHoras != null && intervaloHoras != null && (
          <BarraProgresso
            label="Horas"
            pct={p.progressoHoras}
            detalhe={`${Math.round((p.progressoHoras / 100) * intervaloHoras).toLocaleString("pt-BR")} de ${intervaloHoras.toLocaleString("pt-BR")} h (${p.progressoHoras}%)`}
          />
        )}
        {intervaloDias != null && (
          <BarraProgresso
            label="Tempo"
            pct={p.progressoTempo}
            detalhe={`${Math.round((p.progressoTempo / 100) * intervaloDias)} de ${intervaloDias} dias (${p.progressoTempo}%)`}
          />
        )}
      </div>
      <p className="text-xs text-gray-400">
        Última realização: {p.ultimaData.toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}
