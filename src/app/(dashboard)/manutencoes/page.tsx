import { Wrench } from "lucide-react";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { getVeiculosDoUsuario } from "@/core/services/veiculos.service";
import { getPlanosAtivos, getHistorico } from "@/core/services/manutencao.service";
import { VeiculoFiltro } from "@/components/manutencoes/VeiculoFiltro";
import { PlanoCard } from "@/components/manutencoes/PlanoCard";
import { HistoricoItem } from "@/components/manutencoes/HistoricoItem";

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
        <Wrench className="h-8 w-8 text-gray-600" />
        <p className="text-sm text-gray-400">Cadastre um veículo para acompanhar manutenções.</p>
      </div>
    );
  }

  const { veiculo: veiculoParam } = await searchParams;
  const veiculoId = veiculos.some((v) => v.id === veiculoParam) ? veiculoParam! : veiculos[0].id;

  const [planos, historico] = await Promise.all([
    getPlanosAtivos(veiculoId, email),
    getHistorico(veiculoId, email),
  ]);

  return (
    <div className="flex animate-fade-in flex-col gap-6">
      <VeiculoFiltro
        veiculos={veiculos.map((v) => ({ id: v.id, placa: v.placa, modelo: `${v.marca} ${v.modelo}` }))}
        atual={veiculoId}
      />

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-gray-100">Planos Ativos</h2>
        {planos.length === 0 ? (
          <p className="rounded-xl border border-surface-border bg-surface p-6 text-sm text-gray-400 backdrop-blur-xl">
            Nenhum plano com manutenção registrada para este veículo.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {planos.map((p) => (
              <PlanoCard key={p.plano.id} p={p} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-gray-100">Histórico</h2>
        {historico.length === 0 ? (
          <p className="rounded-xl border border-surface-border bg-surface p-6 text-sm text-gray-400 backdrop-blur-xl">
            Nenhuma manutenção registrada.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {historico.map((m) => (
              <HistoricoItem key={m.id} m={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
