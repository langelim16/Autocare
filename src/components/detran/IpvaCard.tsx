import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Ipva } from "@/integrations/detran/detran-mock.provider";

const STATUS_STYLE: Record<Ipva["status"], { label: string; classe: string }> = {
  pago: { label: "Pago", classe: "bg-green-500/20 text-green-400" },
  pendente: { label: "Pendente", classe: "bg-red-500/20 text-red-400" },
  parcelado: { label: "Parcelado", classe: "bg-yellow-500/20 text-yellow-400" },
};

export function IpvaCard({ ipva }: { ipva: Ipva }) {
  const { label, classe } = STATUS_STYLE[ipva.status];
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">IPVA {ipva.ano}</p>
          <p className="font-display text-2xl font-bold text-gray-100">
            {ipva.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
        <Badge className={cn("border-0", classe)}>{label}</Badge>
      </div>

      {ipva.parcelas && ipva.parcelas.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-surface-border pt-4">
          {ipva.parcelas.map((p) => (
            <div key={p.numero} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Parcela {p.numero}/{ipva.parcelas!.length}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{p.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                <Badge
                  className={cn(
                    "border-0",
                    p.status === "paga" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  )}
                >
                  {p.status === "paga" ? "Paga" : "Pendente"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
