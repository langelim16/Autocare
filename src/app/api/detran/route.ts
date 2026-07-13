import { NextResponse } from "next/server";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { consultarDetran } from "@/integrations/detran/detran-mock.provider";

export async function GET(req: Request) {
  const user = await getDemoOrRealUser();
  const veiculoId = new URL(req.url).searchParams.get("veiculoId");
  if (!veiculoId) return NextResponse.json({ erro: "Informe o veículo." }, { status: 400 });

  const consulta = await prisma.consultaDetran.findFirst({
    where: { veiculoId, veiculo: { user: { email: user.email } } },
    orderBy: { consultadoEm: "desc" },
  });
  return NextResponse.json(consulta);
}

export async function POST(req: Request) {
  const user = await getDemoOrRealUser();

  const { veiculoId } = await req.json();
  const veiculo = await prisma.veiculo.findFirst({ where: { id: veiculoId, user: { email: user.email } } });
  if (!veiculo) return NextResponse.json({ erro: "Veículo não encontrado." }, { status: 404 });

  const resultado = await consultarDetran(veiculo.placa);
  await prisma.consultaDetran.create({
    data: {
      veiculoId: veiculo.id,
      multasJson: JSON.stringify(resultado.multas),
      ipvaStatus: JSON.stringify(resultado.ipva),
      licenciamento: JSON.stringify(resultado.licenciamento),
      totalDebitos: resultado.totalDebitos,
      provider: "mock",
    },
  });

  return NextResponse.json(resultado);
}
