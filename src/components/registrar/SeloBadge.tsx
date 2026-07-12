import type { SeloPrevisto } from "@/core/registro-schema";

const ESTILOS: Record<SeloPrevisto, { classe: string; rotulo: string }> = {
  OURO_SEFAZ: {
    classe: "bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900",
    rotulo: "Selo Ouro",
  },
  PRATA_OCR: {
    classe: "bg-gradient-to-r from-gray-400 to-gray-300 text-gray-900",
    rotulo: "Selo Prata",
  },
  BRONZE_DECLARADO: {
    classe: "bg-gradient-to-r from-orange-700 to-orange-600 text-white",
    rotulo: "Selo Bronze",
  },
};

export function SeloBadge({ selo }: { selo: SeloPrevisto }) {
  const { classe, rotulo } = ESTILOS[selo];
  return (
    <span className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${classe}`}>
      {rotulo}
    </span>
  );
}
