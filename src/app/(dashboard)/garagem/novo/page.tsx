import { NovoVeiculoForm } from "@/components/veiculos/NovoVeiculoForm";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-semibold text-gray-100">
        Novo Veículo
      </h2>
      <NovoVeiculoForm />
    </div>
  );
}
