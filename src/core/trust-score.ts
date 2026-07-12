import type { SeloIntegridade } from "@/core/types";

/** Trust Score: (ouro*1.0 + prata*0.7) / total * 100. Sem registros → null. */
export function trustScore(selos: SeloIntegridade[]): number | null {
  if (selos.length === 0) return null;
  const pontos = selos.reduce(
    (acc, s) =>
      acc + (s === "OURO_SEFAZ" ? 1.0 : s === "PRATA_OCR" ? 0.7 : 0),
    0
  );
  return Math.round((pontos / selos.length) * 100);
}

export function trustColor(score: number | null): string {
  if (score === null) return "text-gray-500 border-gray-600";
  if (score >= 80) return "text-green-400 border-green-500";
  if (score >= 50) return "text-yellow-400 border-yellow-500";
  return "text-red-400 border-red-500";
}

export function formatKm(km: number): string {
  return `${km.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} km`;
}

export function formatHoras(h: number): string {
  return `${h.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} h`;
}

// self-check: node --experimental-strip-types src/core/trust-score.ts
if (process.argv[1]?.endsWith("trust-score.ts")) {
  console.assert(trustScore([]) === null);
  console.assert(trustScore(["OURO_SEFAZ", "OURO_SEFAZ"]) === 100);
  console.assert(trustScore(["OURO_SEFAZ", "PRATA_OCR", "BRONZE_DECLARADO", "BRONZE_DECLARADO"]) === 43);
  console.log("trust-score OK");
}
