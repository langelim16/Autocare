import Link from "next/link";
import { Car } from "lucide-react";

export function GaragemVazia() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-surface-border bg-surface p-8 py-16 text-center backdrop-blur-xl">
      <Car className="h-20 w-20 text-gray-600" />
      <h2 className="font-display text-xl font-semibold text-gray-100">
        Adicione seu primeiro veículo
      </h2>
      <p className="text-sm text-gray-400">
        Cadastre seu veículo para começar a construir o histórico dele.
      </p>
      <Link
        href="/garagem/novo"
        className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-400 active:scale-[0.98]"
      >
        Adicionar veículo
      </Link>
    </div>
  );
}
