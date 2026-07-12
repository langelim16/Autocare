import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LavagemStats } from "@/core/estetica-stats";
import { LABELS_ESTETICO, corUltimaLavagem } from "@/core/estetica-stats";

export function LavagensResumo({ stats }: { stats: LavagemStats }) {
  if (stats.diasDesdeUltima === null) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-surface-border bg-surface p-8 text-center backdrop-blur-xl">
        <Droplets className="h-8 w-8 text-gray-600" />
        <p className="text-sm text-gray-400">Nenhuma lavagem registrada.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="font-display text-2xl font-semibold text-gray-100">
            {stats.mediaDias !== null ? `a cada ${stats.mediaDias} dias` : "—"}
          </p>
          <p className="text-sm text-gray-400">Frequência média de lavagem</p>
        </div>
        <div>
          <p className={cn("font-display text-2xl font-semibold", corUltimaLavagem(stats.diasDesdeUltima))}>
            há {stats.diasDesdeUltima} {stats.diasDesdeUltima === 1 ? "dia" : "dias"}
          </p>
          <p className="text-sm text-gray-400">Última lavagem</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {stats.ultimas.map((l) => (
          <div key={l.id} className="flex justify-between text-sm">
            <span className="text-gray-100">{LABELS_ESTETICO[l.tipo]}</span>
            <span className="text-gray-400">{l.dataServico.toLocaleDateString("pt-BR")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
