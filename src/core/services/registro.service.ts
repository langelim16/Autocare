import { prisma } from "@/lib/prisma";
import { validarMonotonia, type PontoKm } from "@/core/monotonia";
import { VALIDADE_PADRAO_MESES } from "@/core/estetica-stats";
import type { RegistroFormData, SeloPrevisto } from "@/core/registro-schema";

export type SalvarInput = RegistroFormData & {
  veiculoId: string;
  chaveNfe?: string | null;
  seloPrevisto: SeloPrevisto;
};

type Resultado = { ok: true } | { ok: false; erro: string };

export async function salvarRegistro(input: SalvarInput, email: string): Promise<Resultado> {
  const veiculo = await prisma.veiculo.findFirst({
    where: { id: input.veiculoId, user: { email } },
    include: {
      manutencoes: { select: { kmNoMomento: true, horasNoMomento: true, dataServico: true } },
      telemetria: { select: { km: true, horasMotor: true, dataServico: true } },
    },
  });
  if (!veiculo) return { ok: false, erro: "Veículo não encontrado." };

  const dataServico = new Date(`${input.dataServico}T12:00:00`);
  const pontos: PontoKm[] = [
    ...veiculo.manutencoes.map((m) => ({ km: m.kmNoMomento, horasMotor: m.horasNoMomento, dataServico: m.dataServico })),
    ...veiculo.telemetria,
  ];

  const vKm = validarMonotonia(input.km, dataServico, pontos, "km");
  if (!vKm.ok) return vKm;
  if (veiculo.tipo === "CAMINHAO" && input.horasMotor != null) {
    const vH = validarMonotonia(input.horasMotor, dataServico, pontos, "horasMotor");
    if (!vH.ok) return vH;
  }

  const selo = input.seloPrevisto;
  await prisma.$transaction(async (tx) => {
    if (input.tipoRegistro === "MANUTENCAO") {
      await tx.manutencao.create({
        data: {
          veiculoId: veiculo.id,
          tipo: input.tipo,
          descricao: input.descricao,
          itens: typeof input.itens === "string" ? input.itens : JSON.stringify(input.itens ?? []),
          oficina: input.oficina || null,
          custo: input.custo,
          kmNoMomento: input.km,
          horasNoMomento: input.horasMotor ?? null,
          dataServico,
          chaveNfeSefaz: input.chaveNfe || null,
          seloIntegridade: selo,
        },
      });
    } else {
      const validadeMeses = VALIDADE_PADRAO_MESES[input.tipoEstetico] ?? null;
      const dataValidade = validadeMeses
        ? new Date(new Date(dataServico).setMonth(dataServico.getMonth() + validadeMeses))
        : null;
      await tx.registroEstetico.create({
        data: {
          veiculoId: veiculo.id,
          tipo: input.tipoEstetico,
          descricao: input.descricao,
          custo: input.custo,
          oficina: input.oficina || null,
          dataServico,
          seloIntegridade: selo,
          validadeMeses,
          dataValidade,
        },
      });
    }
    await tx.registroTelemetria.create({
      data: {
        veiculoId: veiculo.id,
        km: input.km,
        horasMotor: input.horasMotor ?? null,
        dataServico,
        origem: "REGISTRO_SERVICO",
      },
    });
    // Atualiza hodômetro/horímetro só se registro é o mais recente
    if (input.km >= veiculo.hodometroAtual) {
      await tx.veiculo.update({
        where: { id: veiculo.id },
        data: {
          hodometroAtual: input.km,
          ...(input.horasMotor != null ? { horimetroAtual: input.horasMotor } : {}),
        },
      });
    }
  });
  return { ok: true };
}
