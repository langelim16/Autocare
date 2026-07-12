"use server";

import { redirect } from "next/navigation";
import { createClient, getDemoOrRealUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { veiculoSchema } from "@/core/veiculo-schema";

export async function criarVeiculo(formData: FormData) {
  const user = await getDemoOrRealUser();

  const parsed = veiculoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Dados inválidos." };
  const d = parsed.data;

  let fotoUrl: string | undefined;
  const foto = formData.get("foto");
  if (foto instanceof File && foto.size > 0) {
    if (foto.size > 5 * 1024 * 1024) return { error: "Foto acima de 5MB." };
    if (user.id !== "demo-user") {
      const supabase = await createClient();
      const path = `${user.id}/${Date.now()}-${foto.name.replace(/[^\w.-]/g, "_")}`;
      const { error } = await supabase.storage.from("veiculos").upload(path, foto);
      if (error) return { error: "Falha ao enviar a foto." };
      fotoUrl = supabase.storage.from("veiculos").getPublicUrl(path).data.publicUrl;
    }
  }

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
      fotoUrl,
    },
  });

  redirect(`/garagem/${veiculo.id}`);
}
