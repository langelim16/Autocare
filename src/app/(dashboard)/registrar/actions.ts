"use server";

import { revalidatePath } from "next/cache";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { registroSchema, type RegistroFormInput, type SeloPrevisto } from "@/core/registro-schema";
import { salvarRegistro } from "@/core/services/registro.service";

export async function salvarRegistroAction(
  veiculoId: string,
  form: RegistroFormInput,
  seloPrevisto: SeloPrevisto,
  chaveNfe?: string | null
): Promise<{ ok: true } | { ok: false; erro: string }> {
  const user = await getDemoOrRealUser();

  const parsed = registroSchema.safeParse(form);
  if (!parsed.success)
    return { ok: false, erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const res = await salvarRegistro(
    { ...parsed.data, veiculoId, seloPrevisto, chaveNfe },
    user.email
  );
  if (res.ok) {
    revalidatePath("/registrar");
    revalidatePath("/garagem");
    revalidatePath("/dashboard");
  }
  return res;
}
