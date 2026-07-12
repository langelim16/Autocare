import type { Manutencao } from "@prisma/client";
import { formatKm } from "@/core/trust-score";
import { SeloBadge } from "@/components/veiculos/SeloBadge";
import { ComprovanteThumb } from "./ComprovanteThumb";

export function HistoricoItem({ m }: { m: Manutencao }) {
  const itens = Array.isArray(m.itens) ? (m.itens as string[]) : null;
  return (
    <div className="flex items-start gap-4 rounded-xl border border-surface-border bg-surface p-4 backdrop-blur-xl">
      {m.comprovanteUrl && <ComprovanteThumb url={m.comprovanteUrl} descricao={m.descricao} />}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">
            {m.dataServico.toLocaleDateString("pt-BR")} · {formatKm(m.kmNoMomento)}
          </span>
          <SeloBadge selo={m.seloIntegridade} />
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-gray-100">{m.descricao}</p>
        {itens && itens.length > 0 && (
          <p className="truncate text-xs text-gray-400">{itens.join(", ")}</p>
        )}
        <p className="mt-1 text-sm text-gray-400">
          {m.custo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          {m.oficina && <> · {m.oficina}</>}
        </p>
      </div>
    </div>
  );
}
