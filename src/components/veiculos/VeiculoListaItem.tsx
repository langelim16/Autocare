import Link from "next/link";
import Image from "next/image";
import { formatKm, formatHoras } from "@/core/trust-score";
import type { VeiculoComScore } from "@/core/services/veiculos.service";
import { PlacaMercosul } from "./PlacaMercosul";
import { TrustScoreBadge } from "./TrustScoreBadge";
import { VeiculoTipoIcone } from "./VeiculoTipoIcone";

export function VeiculoListaItem({ veiculo }: { veiculo: VeiculoComScore }) {
  return (
    <Link
      href={`/garagem/${veiculo.id}`}
      className="flex items-center gap-4 rounded-xl border border-surface-border bg-surface p-4 backdrop-blur-xl transition-all duration-200 hover:border-brand-500 hover:bg-surface-hover lg:p-6"
    >
      <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-900">
        {veiculo.fotoUrl ? (
          <Image
            src={veiculo.fotoUrl}
            alt={`${veiculo.marca} ${veiculo.modelo}`}
            width={96}
            height={64}
            className="h-16 w-24 object-cover"
          />
        ) : (
          <VeiculoTipoIcone tipo={veiculo.tipo} className="h-8 w-8 text-gray-600" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-display font-semibold text-gray-100">
            {veiculo.marca} {veiculo.modelo}
          </h3>
          <PlacaMercosul placa={veiculo.placa} />
        </div>
        <p className="text-sm text-gray-400">
          {veiculo.anoFabricacao}/{veiculo.anoModelo} · {veiculo.cor} ·{" "}
          {formatKm(veiculo.hodometroAtual)}
          {veiculo.tipo === "CAMINHAO" && veiculo.horimetroAtual != null && (
            <> · {formatHoras(veiculo.horimetroAtual)}</>
          )}
        </p>
      </div>
      <TrustScoreBadge score={veiculo.score} />
    </Link>
  );
}
