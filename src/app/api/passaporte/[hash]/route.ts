import { NextResponse } from "next/server";
import { getPassaporte } from "@/core/services/passaporte.service";

// Rota pública: qualquer pessoa com o hash pode ver o passaporte.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;
  const passaporte = await getPassaporte(hash);
  if (!passaporte)
    return NextResponse.json({ erro: "Passaporte não encontrado." }, { status: 404 });
  return NextResponse.json(passaporte);
}
