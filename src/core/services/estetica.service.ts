import { prisma } from "@/lib/prisma";
import type { RegistroEstetico } from "@prisma/client";
import { statusProtecao, lavagemStats, type StatusProtecao, type LavagemStats } from "@/core/estetica-stats";

export type ProtecaoAtiva = StatusProtecao & { registro: RegistroEstetico };

export type EsteticaDados = {
  protecoes: ProtecaoAtiva[];
  lavagens: LavagemStats;
  historico: RegistroEstetico[];
};

export async function getEsteticaDados(veiculoId: string, email: string): Promise<EsteticaDados> {
  const historico = await prisma.registroEstetico.findMany({
    where: { veiculoId, veiculo: { user: { email } } },
    orderBy: { dataServico: "desc" },
  });

  const protecoes = historico
    .filter((r) => r.dataValidade != null)
    .map((r) => ({ registro: r, ...statusProtecao(r.dataServico, r.dataValidade!) }));

  return { protecoes, lavagens: lavagemStats(historico), historico };
}
