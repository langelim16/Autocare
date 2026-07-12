import { prisma } from "@/lib/prisma";
import type { Manutencao, PlanoManutencao } from "@prisma/client";
import { calcularStatusPlano, type StatusPlano } from "@/core/plano-status";

export { calcularStatusPlano, type StatusPlano };

export type PlanoComStatus = StatusPlano & {
  plano: PlanoManutencao;
  ultimaData: Date;
};

// ponytail: matching plano↔manutenção por palavra-chave no texto; trocar por planoId na Manutencao quando registro permitir escolher plano
const KEYWORDS: Record<string, string[]> = {
  "Troca de Óleo": ["óleo", "oleo"],
  "Filtro de Ar": ["filtro de ar", "filtros de ar"],
  "Correia Dentada": ["correia"],
  Pneus: ["pneu"],
};

function matchPlano(plano: PlanoManutencao, manutencoes: Manutencao[]): Manutencao | null {
  const keys = KEYWORDS[plano.nome] ?? [plano.nome.toLowerCase()];
  return (
    manutencoes.find((m) => {
      const d = m.descricao.toLowerCase();
      return keys.some((k) => d.includes(k));
    }) ?? null
  );
}

export async function getPlanosAtivos(veiculoId: string, email: string): Promise<PlanoComStatus[]> {
  const veiculo = await prisma.veiculo.findFirst({
    where: { id: veiculoId, user: { email } },
    include: { manutencoes: { orderBy: { dataServico: "desc" } } },
  });
  if (!veiculo) return [];

  const planos = await prisma.planoManutencao.findMany({
    where: { OR: [{ tipoVeiculo: null }, { tipoVeiculo: veiculo.tipo }] },
  });

  const resultado: PlanoComStatus[] = [];
  for (const plano of planos) {
    const ultima = matchPlano(plano, veiculo.manutencoes);
    if (!ultima) continue; // ponytail: plano sem manutenção prévia não aparece; exibir como "nunca realizado" quando houver baseline de compra
    resultado.push({
      plano,
      ultimaData: ultima.dataServico,
      ...calcularStatusPlano(plano, ultima, {
        km: veiculo.hodometroAtual,
        horas: veiculo.horimetroAtual,
        tipoVeiculo: veiculo.tipo,
      }),
    });
  }
  const ordem = { VENCIDA: 0, ATENCAO: 1, OK: 2 };
  return resultado.sort((a, b) => ordem[a.status] - ordem[b.status]);
}

export async function getHistorico(veiculoId: string, email: string): Promise<Manutencao[]> {
  return prisma.manutencao.findMany({
    where: { veiculoId, veiculo: { user: { email } } },
    orderBy: { dataServico: "desc" },
  });
}
