import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Multa } from "@/integrations/detran/detran-mock.provider";

export function MultasTable({ multas }: { multas: Multa[] }) {
  if (multas.length === 0) {
    return (
      <p className="rounded-xl border border-surface-border bg-surface p-6 text-sm text-gray-400 backdrop-blur-xl">
        Nenhuma multa registrada.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border bg-surface backdrop-blur-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border text-left text-xs text-gray-400">
            <th className="px-4 py-3 font-medium">Data</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Valor</th>
            <th className="px-4 py-3 font-medium">Pontos</th>
            <th className="px-4 py-3 font-medium">Local</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {multas.map((m, i) => (
            <tr key={i} className="border-b border-surface-border last:border-0">
              <td className="px-4 py-3 text-gray-300">{new Date(`${m.data}T12:00:00`).toLocaleDateString("pt-BR")}</td>
              <td className="px-4 py-3 text-gray-100">{m.tipo}</td>
              <td className="px-4 py-3 text-gray-300">{m.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
              <td className="px-4 py-3 text-gray-300">{m.pontos}</td>
              <td className="px-4 py-3 text-gray-400">{m.local}</td>
              <td className="px-4 py-3">
                <Badge
                  className={cn(
                    "border-0",
                    m.status === "paga" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  )}
                >
                  {m.status === "paga" ? "Paga" : "Pendente"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
