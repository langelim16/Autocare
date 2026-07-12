import { getDemoOrRealUser } from "@/lib/supabase/server";
import { getVeiculosDoUsuario } from "@/core/services/veiculos.service";
import { RegistrarCliente } from "@/components/registrar/RegistrarCliente";

export default async function Page() {
  const user = await getDemoOrRealUser();
  const veiculos = await getVeiculosDoUsuario(user.email);

  return (
    <RegistrarCliente
      veiculos={veiculos.map((v) => ({
        id: v.id,
        placa: v.placa,
        marca: v.marca,
        modelo: v.modelo,
        tipo: v.tipo,
        hodometroAtual: v.hodometroAtual,
      }))}
    />
  );
}
