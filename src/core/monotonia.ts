export type PontoKm = { km: number; horasMotor?: number | null; dataServico: Date };

type Resultado = { ok: true } | { ok: false; erro: string };

const fmt = (d: Date) => d.toLocaleDateString("pt-BR");
const fmtKm = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

/** Km deve ser ≥ último registro anterior e ≤ próximo posterior (por dataServico). */
export function validarMonotonia(
  km: number,
  dataServico: Date,
  registros: PontoKm[],
  campo: "km" | "horasMotor" = "km"
): Resultado {
  const valor = (r: PontoKm) => (campo === "km" ? r.km : r.horasMotor ?? null);
  const validos = registros.filter((r) => valor(r) != null);

  const anterior = validos
    .filter((r) => r.dataServico.getTime() <= dataServico.getTime())
    .sort((a, b) => b.dataServico.getTime() - a.dataServico.getTime())[0];
  const posterior = validos
    .filter((r) => r.dataServico.getTime() > dataServico.getTime())
    .sort((a, b) => a.dataServico.getTime() - b.dataServico.getTime())[0];

  const unidade = campo === "km" ? "km" : "h";
  if (anterior && km < valor(anterior)!) {
    return {
      ok: false,
      erro: `O ${campo === "km" ? "km" : "horímetro"} informado (${fmtKm(km)}) é menor que o último registro (${fmtKm(valor(anterior)!)} ${unidade} em ${fmt(anterior.dataServico)}). Verifique o valor.`,
    };
  }
  if (posterior && km > valor(posterior)!) {
    return {
      ok: false,
      erro: `O ${campo === "km" ? "km" : "horímetro"} informado (${fmtKm(km)}) é maior que o registro seguinte (${fmtKm(valor(posterior)!)} ${unidade} em ${fmt(posterior.dataServico)}). Verifique o valor.`,
    };
  }
  return { ok: true };
}

// self-check: npx tsx src/core/monotonia.ts
if (process.argv[1]?.endsWith("monotonia.ts")) {
  const regs: PontoKm[] = [
    { km: 10000, dataServico: new Date("2026-01-01") },
    { km: 20000, dataServico: new Date("2026-06-01") },
  ];
  console.assert(validarMonotonia(15000, new Date("2026-03-01"), regs).ok);
  console.assert(!validarMonotonia(9000, new Date("2026-03-01"), regs).ok);
  console.assert(!validarMonotonia(25000, new Date("2026-03-01"), regs).ok);
  console.assert(validarMonotonia(25000, new Date("2026-07-01"), regs).ok);
  console.assert(validarMonotonia(1, new Date(), []).ok);
  console.log("monotonia OK");
}
