import { Wrench } from "lucide-react";
import type { Manutencao } from "@prisma/client";
import { formatKm } from "@/core/trust-score";
import { SeloBadge } from "./SeloBadge";

export function ManutencoesLista({ manutencoes }: { manutencoes: Manutencao[] }) {
  if (manutencoes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-surface-border bg-surface p-8 text-center backdrop-blur-xl">
        <Wrench className="h-8 w-8 text-gray-600" />
        <p className="text-sm text-gray-400">Nenhuma manutenção registrada.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {manutencoes.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-surface p-4 backdrop-blur-xl"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-100">{m.descricao}</p>
            <p className="text-sm text-gray-400">
              {m.dataServico.toLocaleDateString("pt-BR")} · {formatKm(m.kmNoMomento)}
              {m.oficina && <> · {m.oficina}</>} ·{" "}
              {m.custo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>
          <SeloBadge selo={m.seloIntegridade} />
        </div>
      ))}
    </div>
  );
}
