import { NextResponse } from "next/server";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { registroSchema, type SeloPrevisto } from "@/core/registro-schema";
import { salvarRegistro } from "@/core/services/registro.service";

function preverSelo(chaveNfe?: string | null, cnpjOficina?: string | null): SeloPrevisto {
  if (chaveNfe && /^\d{44}$/.test(chaveNfe)) return "OURO_SEFAZ";
  if (cnpjOficina && cnpjOficina.replace(/\D/g, "").length === 14) return "PRATA_OCR";
  return "BRONZE_DECLARADO";
}

export async function POST(req: Request) {
  const user = await getDemoOrRealUser();
  const body = await req.json();

  const { veiculoId, chaveNfe, cnpjOficina, ...form } = body;
  if (!veiculoId)
    return NextResponse.json({ erro: "Informe o veículo." }, { status: 400 });

  const parsed = registroSchema.safeParse(form);
  if (!parsed.success)
    return NextResponse.json(
      { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );

  const chaveLimpa = typeof chaveNfe === "string" ? chaveNfe.replace(/\D/g, "") : null;
  const selo = preverSelo(chaveLimpa, cnpjOficina);

  const res = await salvarRegistro(
    { ...parsed.data, veiculoId, seloPrevisto: selo, chaveNfe: chaveLimpa || null },
    user.email
  );
  if (!res.ok) return NextResponse.json({ erro: res.erro }, { status: 422 });

  return NextResponse.json({ ok: true, selo }, { status: 201 });
}
