export type Multa = {
  data: string;
  tipo: string;
  valor: number;
  pontos: number;
  local: string;
  status: "paga" | "pendente";
};

export type Ipva = {
  ano: number;
  valorTotal: number;
  status: "pago" | "pendente" | "parcelado";
  parcelas?: { numero: number; valor: number; status: "paga" | "pendente" }[];
};

export type Licenciamento = {
  ano: number;
  status: "pago" | "pendente";
  valor: number;
  prazo: string;
};

export type ConsultaDetranResultado = {
  multas: Multa[];
  ipva: Ipva;
  licenciamento: Licenciamento;
  totalDebitos: number;
};

const DADOS: Record<string, ConsultaDetranResultado> = {
  RIO2A23: {
    multas: [
      { data: "2026-03-14", tipo: "Excesso de velocidade", valor: 130.16, pontos: 4, local: "Av. Brasil, km 12 — Rio de Janeiro/RJ", status: "pendente" },
    ],
    ipva: { ano: 2026, valorTotal: 1850, status: "pago" },
    licenciamento: { ano: 2026, status: "pago", valor: 145.9, prazo: "31/12/2026" },
    totalDebitos: 130.16,
  },
  MTB5C89: {
    multas: [],
    ipva: { ano: 2026, valorTotal: 423.5, status: "pendente" },
    licenciamento: { ano: 2026, status: "pendente", valor: 98.7, prazo: "31/12/2026" },
    totalDebitos: 423.5 + 98.7,
  },
  CAM3H78: {
    multas: [
      { data: "2026-01-22", tipo: "Avanço de sinal", valor: 293.47, pontos: 7, local: "Rod. Anhanguera, km 88 — Campinas/SP", status: "pendente" },
      { data: "2025-11-05", tipo: "Estacionamento irregular", valor: 88.38, pontos: 3, local: "Centro — Campinas/SP", status: "paga" },
    ],
    ipva: {
      ano: 2026,
      valorTotal: 8600,
      status: "parcelado",
      parcelas: [
        { numero: 1, valor: 2150, status: "paga" },
        { numero: 2, valor: 2150, status: "paga" },
        { numero: 3, valor: 2150, status: "pendente" },
        { numero: 4, valor: 2150, status: "pendente" },
      ],
    },
    licenciamento: { ano: 2026, status: "pendente", valor: 267.3, prazo: "31/12/2026" },
    totalDebitos: 293.47 + 4300 + 267.3,
  },
};

/** ponytail: mock fixo por placa; trocar por integração real (SERPRO/CDT) quando disponível. */
export async function consultarDetran(placa: string): Promise<ConsultaDetranResultado> {
  const normalizada = placa.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const dados = DADOS[normalizada];
  if (!dados) {
    return {
      multas: [],
      ipva: { ano: 2026, valorTotal: 0, status: "pago" },
      licenciamento: { ano: 2026, status: "pago", valor: 0, prazo: "31/12/2026" },
      totalDebitos: 0,
    };
  }
  return dados;
}

// self-check: node --experimental-strip-types src/integrations/detran/detran-mock.provider.ts
if (process.argv[1]?.endsWith("detran-mock.provider.ts")) {
  consultarDetran("RIO2A23").then((r) => console.assert(r.totalDebitos === 130.16, "civic total"));
  consultarDetran("cam3h78").then((r) => console.assert(r.ipva.parcelas?.length === 4, "scania parcelas"));
  console.log("detran-mock.provider OK");
}
