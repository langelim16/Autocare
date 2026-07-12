import type { Manutencao, PlanoManutencao } from "@prisma/client";
import type { TipoVeiculo } from "@/core/types";

export type StatusPlano = {
  status: "OK" | "ATENCAO" | "VENCIDA";
  progressoKm: number;
  progressoHoras?: number;
  progressoTempo: number;
};

const DIA_MS = 86_400_000;

/** Status de um plano: ATENCAO se qualquer eixo ≥80%, VENCIDA se ≥100%. Horas só para CAMINHAO. */
export function calcularStatusPlano(
  plano: PlanoManutencao,
  ultima: Pick<Manutencao, "kmNoMomento" | "horasNoMomento" | "dataServico">,
  telemetria: { km: number; horas?: number | null; tipoVeiculo: TipoVeiculo },
  agora: Date = new Date()
): StatusPlano {
  const pct = (consumido: number, intervalo: number) =>
    Math.round((consumido / intervalo) * 100);

  const progressoKm = plano.intervaloKm
    ? pct(telemetria.km - ultima.kmNoMomento, plano.intervaloKm)
    : 0;

  const progressoTempo = plano.intervaloDias
    ? pct((agora.getTime() - ultima.dataServico.getTime()) / DIA_MS, plano.intervaloDias)
    : 0;

  let progressoHoras: number | undefined;
  if (
    telemetria.tipoVeiculo === "CAMINHAO" &&
    plano.intervaloHoras &&
    telemetria.horas != null &&
    ultima.horasNoMomento != null
  ) {
    progressoHoras = pct(telemetria.horas - ultima.horasNoMomento, plano.intervaloHoras);
  }

  const eixos = [progressoKm, progressoTempo, ...(progressoHoras != null ? [progressoHoras] : [])];
  const max = Math.max(...eixos);
  const status = max >= 100 ? "VENCIDA" : max >= 80 ? "ATENCAO" : "OK";

  return { status, progressoKm, ...(progressoHoras != null ? { progressoHoras } : {}), progressoTempo };
}

// self-check: node --experimental-strip-types src/core/plano-status.ts
if (process.argv[1]?.endsWith("plano-status.ts")) {
  const plano = { id: "p", nome: "Troca de Óleo", tipoVeiculo: null, intervaloKm: 10_000, intervaloHoras: null, intervaloDias: 365, descricao: null };
  const agora = new Date("2026-07-12");
  const ultima = { kmNoMomento: 40_000, horasNoMomento: null, dataServico: new Date("2025-10-12") };
  const r = calcularStatusPlano(plano, ultima, { km: 47_200, tipoVeiculo: "CARRO" }, agora);
  console.assert(r.progressoKm === 72, `km ${r.progressoKm}`);
  console.assert(r.progressoHoras === undefined, "horas ignoradas p/ carro");
  console.assert(r.status === "OK", r.status);

  const r2 = calcularStatusPlano(plano, ultima, { km: 48_500, tipoVeiculo: "CARRO" }, agora);
  console.assert(r2.status === "ATENCAO", r2.status);

  const r3 = calcularStatusPlano(plano, ultima, { km: 50_000, tipoVeiculo: "CARRO" }, agora);
  console.assert(r3.status === "VENCIDA", r3.status);

  const planoCam = { ...plano, intervaloKm: 30_000, intervaloHoras: 500, intervaloDias: null };
  const r4 = calcularStatusPlano(
    planoCam,
    { kmNoMomento: 200_000, horasNoMomento: 6_000, dataServico: new Date("2026-01-01") },
    { km: 210_000, horas: 6_450, tipoVeiculo: "CAMINHAO" },
    agora
  );
  console.assert(r4.progressoHoras === 90 && r4.status === "ATENCAO", `${r4.progressoHoras} ${r4.status}`);
  console.log("plano-status OK");
}
