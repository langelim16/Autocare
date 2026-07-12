import Image from "next/image";
import { formatKm, formatHoras } from "@/core/trust-score";
import type { Veiculo } from "@prisma/client";
import { PlacaMercosul } from "./PlacaMercosul";
import { TrustScoreBadge } from "./TrustScoreBadge";
import { VeiculoTipoIcone } from "./VeiculoTipoIcone";

export function VeiculoResumo({
  veiculo,
  score,
}: {
  veiculo: Veiculo;
  score: number | null;
}) {
  const dados: [string, string][] = [
    ["Tipo", (({ CARRO: "Carro", MOTO: "Moto", CAMINHAO: "Caminhão" } as Record<string, string>)[veiculo.tipo] ?? veiculo.tipo)],
    ["Ano", `${veiculo.anoFabricacao}/${veiculo.anoModelo}`],
    ["Cor", veiculo.cor],
    ["Km atual", formatKm(veiculo.hodometroAtual)],
    ...(veiculo.tipo === "CAMINHAO" && veiculo.horimetroAtual != null
      ? ([["Horas de motor", formatHoras(veiculo.horimetroAtual)]] as [string, string][])
      : []),
    ["Cadastrado em", veiculo.createdAt.toLocaleDateString("pt-BR")],
  ];

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl lg:flex-row">
      <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-900 lg:w-72 lg:shrink-0">
        {veiculo.fotoUrl ? (
          <Image
            src={veiculo.fotoUrl}
            alt={`${veiculo.marca} ${veiculo.modelo}`}
            width={288}
            height={192}
            className="h-48 w-full object-cover"
          />
        ) : (
          <VeiculoTipoIcone tipo={veiculo.tipo} className="h-20 w-20 text-gray-600" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-4">
          <h3 className="font-display text-xl font-semibold text-gray-100">
            {veiculo.marca} {veiculo.modelo}
          </h3>
          <PlacaMercosul placa={veiculo.placa} />
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          {dados.map(([k, v]) => (
            <div key={k}>
              <dt className="text-gray-400">{k}</dt>
              <dd className="text-gray-100">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-col items-center gap-2">
        <TrustScoreBadge score={score} size="lg" />
        <span className="text-sm text-gray-400">Trust Score</span>
      </div>
    </div>
  );
}
