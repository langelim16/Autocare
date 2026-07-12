import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Licenciamento } from "@/integrations/detran/detran-mock.provider";

export function LicenciamentoCard({ licenciamento }: { licenciamento: Licenciamento }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl">
      <div>
        <p className="text-sm text-gray-400">Licenciamento {licenciamento.ano}</p>
        <p className="font-display text-2xl font-bold text-gray-100">
          {licenciamento.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <p className="mt-1 text-xs text-gray-400">Prazo: {licenciamento.prazo}</p>
      </div>
      <Badge
        className={cn(
          "border-0",
          licenciamento.status === "pago" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        )}
      >
        {licenciamento.status === "pago" ? "Pago" : "Pendente"}
      </Badge>
    </div>
  );
}
