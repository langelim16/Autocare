"use client";

import { useRouter } from "next/navigation";

type Opcao = { id: string; placa: string; modelo: string };

export function VeiculoFiltro({
  veiculos,
  atual,
  basePath = "/manutencoes",
}: {
  veiculos: Opcao[];
  atual: string;
  basePath?: string;
}) {
  const router = useRouter();
  return (
    <select
      value={atual}
      onChange={(e) => router.push(`${basePath}?veiculo=${e.target.value}`)}
      aria-label="Filtrar por veículo"
      className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm text-gray-100 backdrop-blur-xl focus:border-brand-500 focus:outline-none sm:max-w-xs"
    >
      {veiculos.map((v) => (
        <option key={v.id} value={v.id} className="bg-gray-950">
          {v.placa} — {v.modelo}
        </option>
      ))}
    </select>
  );
}
