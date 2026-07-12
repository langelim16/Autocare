import type { RegistroEstetico } from "@prisma/client";
import type { TipoEstetico } from "@/core/types";

export const LABELS_ESTETICO: Record<string, string> = {
  LAVAGEM_SIMPLES: "Lavagem simples",
  LAVAGEM_COMPLETA: "Lavagem completa",
  POLIMENTO: "Polimento",
  VITRIFICACAO: "Vitrificação",
  HIGIENIZACAO: "Higienização",
};

/** Meses de validade padrão por tipo (null = sem validade). ponytail: fixo; tornar configurável quando oficinas informarem garantia */
export const VALIDADE_PADRAO_MESES: Partial<Record<TipoEstetico, number>> = {
  VITRIFICACAO: 24,
  POLIMENTO: 6,
};

const DIA_MS = 86_400_000;

export type StatusProtecao = {
  status: "PROTEGIDO" | "VENCENDO" | "VENCIDA";
  pctConsumida: number;
};

/** Vencendo = <20% restante. Vencida = passou da validade. */
export function statusProtecao(aplicacao: Date, validade: Date, agora: Date = new Date()): StatusProtecao {
  const total = validade.getTime() - aplicacao.getTime();
  const consumido = agora.getTime() - aplicacao.getTime();
  const pct = Math.round((consumido / total) * 100);
  const status = pct >= 100 ? "VENCIDA" : pct > 80 ? "VENCENDO" : "PROTEGIDO";
  return { status, pctConsumida: Math.max(0, pct) };
}

export type LavagemStats = {
  mediaDias: number | null;
  diasDesdeUltima: number | null;
  ultimas: RegistroEstetico[];
};

const ehLavagem = (t: TipoEstetico) => t === "LAVAGEM_SIMPLES" || t === "LAVAGEM_COMPLETA";

/** Recebe registros ordenados por dataServico desc. */
export function lavagemStats(registros: RegistroEstetico[], agora: Date = new Date()): LavagemStats {
  const lavagens = registros.filter((r) => ehLavagem(r.tipo));
  if (lavagens.length === 0) return { mediaDias: null, diasDesdeUltima: null, ultimas: [] };

  const diasDesdeUltima = Math.floor((agora.getTime() - lavagens[0].dataServico.getTime()) / DIA_MS);

  let mediaDias: number | null = null;
  if (lavagens.length >= 2) {
    const span = lavagens[0].dataServico.getTime() - lavagens[lavagens.length - 1].dataServico.getTime();
    mediaDias = Math.round(span / DIA_MS / (lavagens.length - 1));
  }
  return { mediaDias, diasDesdeUltima, ultimas: lavagens.slice(0, 5) };
}

/** Cor do indicador "última lavagem": verde ≤14, amarelo 15-30, vermelho >30. */
export function corUltimaLavagem(dias: number): string {
  if (dias <= 14) return "text-green-400";
  if (dias <= 30) return "text-yellow-400";
  return "text-red-400";
}

// self-check: node --experimental-strip-types src/core/estetica-stats.ts
if (process.argv[1]?.endsWith("estetica-stats.ts")) {
  const agora = new Date("2026-07-12");
  // aplicada há 8 meses, validade 24 meses ≈ 33%
  const p = statusProtecao(new Date("2025-11-12"), new Date("2027-11-12"), agora);
  console.assert(p.status === "PROTEGIDO" && p.pctConsumida === 33, `${p.status} ${p.pctConsumida}`);
  const p2 = statusProtecao(new Date("2024-09-01"), new Date("2026-09-01"), agora);
  console.assert(p2.status === "VENCENDO", p2.status);
  const p3 = statusProtecao(new Date("2024-01-01"), new Date("2026-01-01"), agora);
  console.assert(p3.status === "VENCIDA", p3.status);

  const lav = (dias: number) =>
    ({ tipo: "LAVAGEM_SIMPLES", dataServico: new Date(agora.getTime() - dias * DIA_MS) }) as RegistroEstetico;
  const s = lavagemStats([lav(10), lav(24), lav(38)], agora);
  console.assert(s.diasDesdeUltima === 10 && s.mediaDias === 14, `${s.diasDesdeUltima} ${s.mediaDias}`);
  console.assert(lavagemStats([], agora).mediaDias === null);
  console.assert(corUltimaLavagem(10) === "text-green-400" && corUltimaLavagem(20) === "text-yellow-400" && corUltimaLavagem(40) === "text-red-400");
  console.log("estetica-stats OK");
}
