import { Sparkles } from "lucide-react";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { getVeiculosDoUsuario } from "@/core/services/veiculos.service";
import { getEsteticaDados } from "@/core/services/estetica.service";
import { VeiculoFiltro } from "@/components/manutencoes/VeiculoFiltro";
import { ProtecaoCard } from "@/components/estetica/ProtecaoCard";
import { LavagensResumo } from "@/components/estetica/LavagensResumo";
import { EsteticaLista } from "@/components/veiculos/EsteticaLista";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ veiculo?: string }>;
}) {
  const user = await getDemoOrRealUser();
  const email = user.email;

  const veiculos = await getVeiculosDoUsuario(email);
  if (veiculos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-surface-border bg-surface p-8 text-center backdrop-blur-xl">
        <Sparkles className="h-8 w-8 text-gray-600" />
        <p className="text-sm text-gray-400">Cadastre um veículo para acompanhar serviços estéticos.</p>
      </div>
    );
  }

  const { veiculo: veiculoParam } = await searchParams;
  const veiculoId = veiculos.some((v) => v.id === veiculoParam) ? veiculoParam! : veiculos[0].id;

  const { protecoes, lavagens, historico } = await getEsteticaDados(veiculoId, email);

  return (
    <div className="flex animate-fade-in flex-col gap-6">
      <VeiculoFiltro
        veiculos={veiculos.map((v) => ({ id: v.id, placa: v.placa, modelo: `${v.marca} ${v.modelo}` }))}
        atual={veiculoId}
        basePath="/estetica"
      />

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-gray-100">Proteções Ativas</h2>
        {protecoes.length === 0 ? (
          <p className="rounded-xl border border-surface-border bg-surface p-6 text-sm text-gray-400 backdrop-blur-xl">
            Nenhuma proteção com validade registrada.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {protecoes.map((p) => (
              <ProtecaoCard key={p.registro.id} p={p} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-gray-100">Lavagens</h2>
        <LavagensResumo stats={lavagens} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-gray-100">Histórico</h2>
        <EsteticaLista registros={historico} />
      </section>
    </div>
  );
}
