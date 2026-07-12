import { Sparkles } from "lucide-react";
import type { RegistroEstetico } from "@prisma/client";
import { SeloBadge } from "./SeloBadge";

const LABELS: Record<string, string> = {
  LAVAGEM_SIMPLES: "Lavagem simples",
  LAVAGEM_COMPLETA: "Lavagem completa",
  POLIMENTO: "Polimento",
  VITRIFICACAO: "Vitrificação",
  HIGIENIZACAO: "Higienização",
};

export function EsteticaLista({ registros }: { registros: RegistroEstetico[] }) {
  if (registros.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-surface-border bg-surface p-8 text-center backdrop-blur-xl">
        <Sparkles className="h-8 w-8 text-gray-600" />
        <p className="text-sm text-gray-400">Nenhum serviço estético registrado.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {registros.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-surface p-4 backdrop-blur-xl"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-100">{LABELS[r.tipo]}</p>
            <p className="text-sm text-gray-400">
              {r.dataServico.toLocaleDateString("pt-BR")}
              {r.dataValidade && <> · válido até {r.dataValidade.toLocaleDateString("pt-BR")}</>}
              {r.custo != null && (
                <> · {r.custo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</>
              )}
            </p>
          </div>
          <SeloBadge selo={r.seloIntegridade} />
        </div>
      ))}
    </div>
  );
}
