import { AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alerta } from "@/core/services/veiculos.service";

export function AlertaCard({ alerta }: { alerta: Alerta }) {
  const vencida = alerta.nivel === "vencida";
  const Icone = vencida ? AlertCircle : AlertTriangle;
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-surface-border border-l-4 bg-surface p-4 backdrop-blur-xl",
        vencida ? "border-l-red-500" : "border-l-yellow-500"
      )}
    >
      <Icone className={cn("h-5 w-5 shrink-0", vencida ? "text-red-400" : "text-yellow-400")} />
      <div>
        <p className="text-sm font-semibold text-gray-100">{alerta.titulo}</p>
        <p className="text-sm text-gray-400">{alerta.detalhe}</p>
      </div>
    </div>
  );
}
