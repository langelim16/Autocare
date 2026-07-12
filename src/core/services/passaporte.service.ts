import { prisma } from "@/lib/prisma";
import { trustScore } from "@/core/trust-score";

export type ItemTimeline = {
  id: string;
  origem: "manutencao" | "estetico";
  descricao: string;
  km: number | null;
  custo: number | null;
  dataServico: Date;
  dataCadastro: Date;
  seloIntegridade: string;
  comprovanteUrl: string | null;
};

export async function getPassaporte(hash: string) {
  const veiculo = await prisma.veiculo.findUnique({
    where: { hashPassaporte: hash },
    include: {
      manutencoes: { orderBy: { dataServico: "desc" } },
      esteticas: { orderBy: { dataServico: "desc" } },
      consultasDetran: { orderBy: { consultadoEm: "desc" }, take: 1 },
    },
  });
  if (!veiculo) return null;

  const timeline: ItemTimeline[] = [
    ...veiculo.manutencoes.map((m) => ({
      id: m.id,
      origem: "manutencao" as const,
      descricao: m.descricao,
      km: m.kmNoMomento,
      custo: m.custo,
      dataServico: m.dataServico,
      dataCadastro: m.dataCadastro,
      seloIntegridade: m.seloIntegridade,
      comprovanteUrl: m.comprovanteUrl,
    })),
    ...veiculo.esteticas.map((e) => ({
      id: e.id,
      origem: "estetico" as const,
      descricao: e.descricao ?? e.tipo.replace(/_/g, " ").toLowerCase(),
      km: null,
      custo: e.custo,
      dataServico: e.dataServico,
      dataCadastro: e.dataCadastro,
      seloIntegridade: e.seloIntegridade,
      comprovanteUrl: e.comprovanteUrl,
    })),
  ].sort((a, b) => b.dataServico.getTime() - a.dataServico.getTime());

  const score = trustScore([
    ...veiculo.manutencoes.map((m) => m.seloIntegridade),
    ...veiculo.esteticas.map((e) => e.seloIntegridade),
  ]);

  return {
    veiculo,
    timeline,
    score,
    ultimaConsultaDetran: veiculo.consultasDetran[0] ?? null,
  };
}
