import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProtecaoAtiva } from "@/core/services/estetica.service";
import { LABELS_ESTETICO } from "@/core/estetica-stats";

const STATUS = {
  PROTEGIDO: { label: "Protegido", classe: "bg-green-500/20 text-green-400 border-green-500", barra: "bg-green-500" },
  VENCENDO: { label: "Vencendo", classe: "bg-yellow-500/20 text-yellow-400 border-yellow-500", barra: "bg-yellow-500" },
  VENCIDA: { label: "Vencida", classe: "bg-red-500/20 text-red-400 border-red-500", barra: "bg-red-500" },
} as const;

export function ProtecaoCard({ p }: { p: ProtecaoAtiva }) {
  const s = STATUS[p.status];
  const r = p.registro;
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-500" />
          <h3 className="font-display text-sm font-semibold text-gray-100">{LABELS_ESTETICO[r.tipo]}</h3>
        </div>
        <span className={cn("rounded-full border px-2 py-1 text-xs font-semibold", s.classe)}>
          {s.label}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Validade</span>
          <span>{p.pctConsumida}% consumida</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
          <div
            className={cn("h-full rounded-full transition-all duration-200", s.barra)}
            style={{ width: `${Math.min(p.pctConsumida, 100)}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-gray-400">
        {r.dataServico.toLocaleDateString("pt-BR")} → {r.dataValidade!.toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}
