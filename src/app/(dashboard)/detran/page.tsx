import { ShieldCheck } from "lucide-react";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { getVeiculosDoUsuario } from "@/core/services/veiculos.service";
import { DetranPainel } from "@/components/detran/DetranPainel";

export default async function Page() {
  const user = await getDemoOrRealUser();
  const email = user.email;

  const veiculos = await getVeiculosDoUsuario(email);
  if (veiculos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-surface-border bg-surface p-8 text-center backdrop-blur-xl">
        <ShieldCheck className="h-8 w-8 text-gray-600" />
        <p className="text-sm text-gray-400">Cadastre um veículo para consultar o DETRAN.</p>
      </div>
    );
  }

  return (
    <div className="flex animate-fade-in flex-col gap-6">
      <DetranPainel
        veiculos={veiculos.map((v) => ({ id: v.id, placa: v.placa, modelo: `${v.marca} ${v.modelo}` }))}
      />
    </div>
  );
}
