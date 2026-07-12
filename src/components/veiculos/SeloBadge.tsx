import type { SeloIntegridade } from "@/core/types";
import { cn } from "@/lib/utils";

const ESTILOS: Record<string, { label: string; classe: string }> = {
  OURO_SEFAZ: {
    label: "Ouro",
    classe: "bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900",
  },
  PRATA_OCR: {
    label: "Prata",
    classe: "bg-gradient-to-r from-gray-400 to-gray-300 text-gray-900",
  },
  BRONZE_DECLARADO: {
    label: "Bronze",
    classe: "bg-gradient-to-r from-orange-700 to-orange-600 text-white",
  },
};

export function SeloBadge({ selo }: { selo: SeloIntegridade }) {
  const { label, classe } = ESTILOS[selo];
  return (
    <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", classe)}>
      {label}
    </span>
  );
}
