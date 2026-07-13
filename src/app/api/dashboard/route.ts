import { NextResponse } from "next/server";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getAlertas } from "@/core/services/veiculos.service";

export async function GET() {
  const user = await getDemoOrRealUser();
  const email = user.email;

  const anoAtual = new Date().getFullYear();
  const inicioAno = new Date(anoAtual, 0, 1);

  const [veiculos, manutencoes, esteticas, alertas] = await Promise.all([
    prisma.veiculo.findMany({ where: { user: { email } }, select: { id: true, tipo: true } }),
    prisma.manutencao.findMany({
      where: { veiculo: { user: { email } } },
      orderBy: { dataServico: "desc" },
      include: { veiculo: { select: { marca: true, modelo: true } } },
    }),
    prisma.registroEstetico.findMany({
      where: { veiculo: { user: { email } } },
      orderBy: { dataServico: "desc" },
      include: { veiculo: { select: { marca: true, modelo: true } } },
    }),
    getAlertas(email),
  ]);

  const registros = [
    ...manutencoes.map((m) => ({
      id: m.id,
      origem: "manutencao" as const,
      descricao: m.descricao,
      veiculo: `${m.veiculo.marca} ${m.veiculo.modelo}`,
      custo: m.custo,
      km: m.kmNoMomento,
      dataServico: m.dataServico,
      selo: m.seloIntegridade,
      oficina: m.oficina,
    })),
    ...esteticas.map((e) => ({
      id: e.id,
      origem: "estetico" as const,
      descricao: e.descricao ?? e.tipo.replace(/_/g, " ").toLowerCase(),
      veiculo: `${e.veiculo.marca} ${e.veiculo.modelo}`,
      custo: e.custo ?? 0,
      km: null,
      dataServico: e.dataServico,
      selo: e.seloIntegridade,
      oficina: e.oficina,
    })),
  ].sort((a, b) => b.dataServico.getTime() - a.dataServico.getTime());

  const doAno = registros.filter((r) => r.dataServico >= inicioAno);
  const gastoAno = doAno.reduce((acc, r) => acc + (r.custo ?? 0), 0);

  const gastosPorMes = Array.from({ length: 12 }, (_, mes) =>
    doAno
      .filter((r) => r.dataServico.getMonth() === mes)
      .reduce((acc, r) => acc + (r.custo ?? 0), 0)
  );

  const selosOuro = registros.filter((r) => r.selo === "OURO_SEFAZ").length;

  return NextResponse.json({
    nome: user.nome,
    totalVeiculos: veiculos.length,
    tipos: veiculos.reduce<Record<string, number>>((acc, v) => {
      acc[v.tipo] = (acc[v.tipo] ?? 0) + 1;
      return acc;
    }, {}),
    gastoAno,
    gastosPorMes,
    selosOuro,
    alertas,
    ultimosRegistros: registros.slice(0, 5),
  });
}
