import { getDemoOrRealUser } from "@/lib/supabase/server";
import { getVeiculosDoUsuario, getAlertas } from "@/core/services/veiculos.service";
import { VeiculoCard } from "@/components/veiculos/VeiculoCard";
import { GaragemVazia } from "@/components/veiculos/GaragemVazia";
import { AlertaCard } from "@/components/dashboard/AlertaCard";

export default async function Page() {
  const user = await getDemoOrRealUser();
  const email = user.email;

  const [veiculos, alertas] = await Promise.all([
    getVeiculosDoUsuario(email),
    getAlertas(email),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {alertas.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-lg font-semibold text-gray-100">Alertas</h2>
          {alertas.map((a, i) => (
            <AlertaCard key={i} alerta={a} />
          ))}
        </section>
      )}

      {veiculos.length === 0 ? (
        <GaragemVazia />
      ) : (
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-semibold text-gray-100">
            Meus Veículos
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {veiculos.map((v) => (
              <VeiculoCard key={v.id} veiculo={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
