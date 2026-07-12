import { ShieldCheck } from "lucide-react";
import type { ConsultaDetran } from "@prisma/client";

export function DetranResumo({ consulta }: { consulta?: ConsultaDetran }) {
  if (!consulta) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-surface-border bg-surface p-8 text-center backdrop-blur-xl">
        <ShieldCheck className="h-8 w-8 text-gray-600" />
        <p className="text-sm text-gray-400">Nenhuma consulta DETRAN realizada.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl">
      <p className="text-sm text-gray-400">
        Última consulta: {consulta.consultadoEm.toLocaleDateString("pt-BR")}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-100">Multas</h4>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-400">
            {JSON.stringify(consulta.multasJson ?? "Sem dados", null, 2)}
          </pre>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-100">IPVA</h4>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-400">
            {JSON.stringify(consulta.ipvaStatus ?? "Sem dados", null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
