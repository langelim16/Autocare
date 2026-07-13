import { NextResponse } from "next/server";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { veiculoSchema } from "@/core/veiculo-schema";
import { trustScore } from "@/core/trust-score";

export async function GET() {
  const user = await getDemoOrRealUser();
  const veiculos = await prisma.veiculo.findMany({
    where: { user: { email: user.email } },
    include: {
      manutencoes: { select: { seloIntegridade: true } },
      esteticas: { select: { seloIntegridade: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    veiculos.map(({ manutencoes, esteticas, ...v }) => {
      const selos = [...manutencoes, ...esteticas].map((r) => r.seloIntegridade);
      const conta = (s: string) => selos.filter((x) => x === s).length;
      return {
        ...v,
        score: trustScore(selos),
        selos: {
          ouro: conta("OURO_SEFAZ"),
          prata: conta("PRATA_OCR"),
          bronze: conta("BRONZE_DECLARADO"),
          total: selos.length,
        },
      };
    })
  );
}

export async function POST(req: Request) {
  const user = await getDemoOrRealUser();
  const body = await req.json();

  const parsed = veiculoSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  const d = parsed.data;

  const dbUser = await prisma.user.upsert({
    where: { email: user.email },
    update: {},
    create: { email: user.email, nome: user.nome },
  });

  const veiculo = await prisma.veiculo.create({
    data: {
      userId: dbUser.id,
      tipo: d.tipo,
      placa: d.placa,
      marca: d.marca,
      modelo: d.modelo,
      anoFabricacao: d.anoFabricacao,
      anoModelo: d.anoModelo,
      cor: d.cor,
      hodometroAtual: d.hodometroInicial,
      horimetroAtual: d.tipo === "CAMINHAO" ? d.horimetroInicial : null,
    },
  });

  return NextResponse.json(veiculo, { status: 201 });
}
