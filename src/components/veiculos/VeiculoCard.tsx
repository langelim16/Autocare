import Link from "next/link";
import Image from "next/image";
import { formatKm, formatHoras } from "@/core/trust-score";
import type { VeiculoComScore } from "@/core/services/veiculos.service";
import { PlacaMercosul } from "./PlacaMercosul";
import { TrustScoreBadge } from "./TrustScoreBadge";
import { VeiculoTipoIcone } from "./VeiculoTipoIcone";

export function VeiculoCard({ veiculo }: { veiculo: VeiculoComScore }) {
  return (
    <Link
      href={`/garagem/${veiculo.id}`}
      className="group block overflow-hidden rounded-xl border border-surface-border bg-surface backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-brand-500 hover:bg-surface-hover hover:shadow-lg"
    >
      <div className="flex h-40 items-center justify-center bg-gray-900">
        {veiculo.fotoUrl ? (
          <Image
            src={veiculo.fotoUrl}
            alt={`${veiculo.marca} ${veiculo.modelo}`}
            width={400}
            height={160}
            className="h-40 w-full object-cover"
          />
        ) : (
          <VeiculoTipoIcone tipo={veiculo.tipo} className="h-16 w-16 text-gray-600" />
        )}
      </div>
      <div className="flex items-start justify-between gap-4 p-6">
        <div className="flex flex-col gap-2">
          <PlacaMercosul placa={veiculo.placa} />
          <h3 className="font-display font-semibold text-gray-100">
            {veiculo.marca} {veiculo.modelo}{" "}
            <span className="text-gray-400">{veiculo.anoModelo}</span>
          </h3>
          <p className="text-sm text-gray-400">
            {formatKm(veiculo.hodometroAtual)}
            {veiculo.tipo === "CAMINHAO" && veiculo.horimetroAtual != null && (
              <> · {formatHoras(veiculo.horimetroAtual)}</>
            )}
          </p>
        </div>
        <TrustScoreBadge score={veiculo.score} />
      </div>
    </Link>
  );
}
