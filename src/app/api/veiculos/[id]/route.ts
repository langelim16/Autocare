import { NextResponse } from "next/server";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { getVeiculo } from "@/core/services/veiculos.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getDemoOrRealUser();
  const veiculo = await getVeiculo(id, user.email);
  if (!veiculo) return NextResponse.json({ erro: "Veículo não encontrado." }, { status: 404 });
  return NextResponse.json(veiculo);
}
