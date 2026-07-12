import { prisma } from "@/lib/prisma";
import { trustScore } from "@/core/trust-score";
import type { Veiculo } from "@prisma/client";

export type VeiculoComScore = Veiculo & { score: number | null };

export type Alerta = {
  nivel: "vencida" | "atencao";
  titulo: string;
  detalhe: string;
};

export async function getVeiculosDoUsuario(email: string): Promise<VeiculoComScore[]> {
  const veiculos = await prisma.veiculo.findMany({
    where: { user: { email } },
    include: { manutencoes: { select: { seloIntegridade: true } } },
    orderBy: { createdAt: "asc" },
  });
  return veiculos.map(({ manutencoes, ...v }) => ({
    ...v,
    score: trustScore(manutencoes.map((m) => m.seloIntegridade)),
  }));
}

export async function getVeiculo(id: string, email: string) {
  const veiculo = await prisma.veiculo.findFirst({
    where: { id, user: { email } },
    include: {
      manutencoes: { orderBy: { dataServico: "desc" } },
      esteticas: { orderBy: { dataServico: "desc" } },
      consultasDetran: { orderBy: { consultadoEm: "desc" }, take: 1 },
    },
  });
  if (!veiculo) return null;
  return {
    ...veiculo,
    score: trustScore(veiculo.manutencoes.map((m) => m.seloIntegridade)),
  };
}

const DIAS_MS = 86_400_000;

export async function getAlertas(email: string): Promise<Alerta[]> {
  const veiculos = await prisma.veiculo.findMany({
    where: { user: { email } },
    include: {
      manutencoes: {
        where: { tipo: "PREVENTIVA" },
        orderBy: { dataServico: "desc" },
        take: 1,
      },
      esteticas: { where: { dataValidade: { not: null } }, orderBy: { dataValidade: "desc" } },
    },
  });

  const agora = Date.now();
  const alertas: Alerta[] = [];

  for (const v of veiculos) {
    const nome = `${v.marca} ${v.modelo}`;
    // ponytail: heurística fixa (180d preventiva, 30d aviso estética); trocar por PlanoManutencao quando módulo de planos existir
    const ultima = v.manutencoes[0];
    if (ultima) {
      const dias = Math.floor((agora - ultima.dataServico.getTime()) / DIAS_MS);
      if (dias > 180)
        alertas.push({ nivel: "vencida", titulo: `Manutenção vencida — ${nome}`, detalhe: `Última preventiva há ${dias} dias.` });
      else if (dias > 150)
        alertas.push({ nivel: "atencao", titulo: `Manutenção próxima — ${nome}`, detalhe: `Última preventiva há ${dias} dias.` });
    }
    for (const e of v.esteticas) {
      const dias = Math.ceil((e.dataValidade!.getTime() - agora) / DIAS_MS);
      if (dias < 0)
        alertas.push({ nivel: "vencida", titulo: `Proteção estética expirada — ${nome}`, detalhe: `${e.tipo.replace(/_/g, " ").toLowerCase()} expirou há ${-dias} dias.` });
      else if (dias <= 30)
        alertas.push({ nivel: "atencao", titulo: `Proteção estética expirando — ${nome}`, detalhe: `${e.tipo.replace(/_/g, " ").toLowerCase()} expira em ${dias} dias.` });
    }
  }
  return alertas;
}
