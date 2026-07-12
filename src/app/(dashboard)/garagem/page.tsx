import Link from "next/link";
import { Plus } from "lucide-react";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { getVeiculosDoUsuario } from "@/core/services/veiculos.service";
import { GaragemVazia } from "@/components/veiculos/GaragemVazia";
import { VeiculoListaItem } from "@/components/veiculos/VeiculoListaItem";

export default async function Page() {
  const user = await getDemoOrRealUser();
  const veiculos = await getVeiculosDoUsuario(user.email);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-gray-100">
          Minha Garagem
        </h2>
        <Link
          href="/garagem/novo"
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-400 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Novo veículo
        </Link>
      </div>

      {veiculos.length === 0 ? (
        <GaragemVazia />
      ) : (
        <div className="flex flex-col gap-4">
          {veiculos.map((v) => (
            <VeiculoListaItem key={v.id} veiculo={v} />
          ))}
        </div>
      )}
    </div>
  );
}
