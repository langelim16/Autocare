import { PrismaClient } from "@prisma/client";

type SeloIntegridade = "OURO_SEFAZ" | "PRATA_OCR" | "BRONZE_DECLARADO";
type TipoManutencao = "PREVENTIVA" | "CORRETIVA";

const prisma = new PrismaClient();

const dias = (n: number) => new Date(Date.now() - n * 86_400_000);

function manutencao(
  descricao: string,
  km: number,
  custo: number,
  diasAtras: number,
  selo: SeloIntegridade,
  tipo: TipoManutencao = "PREVENTIVA",
  horas?: number
) {
  return {
    tipo,
    descricao,
    custo,
    kmNoMomento: km,
    horasNoMomento: horas,
    dataServico: dias(diasAtras),
    seloIntegridade: selo,
    oficina: "Oficina Teste LTDA",
  };
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "teste@autocare.dev" },
    update: {},
    create: { email: "teste@autocare.dev", nome: "Usuário Teste" },
  });

  await prisma.veiculo.deleteMany({ where: { userId: user.id } });

  await prisma.veiculo.create({
    data: {
      userId: user.id,
      tipo: "CARRO",
      placa: "RIO2A23",
      marca: "Honda",
      modelo: "Civic",
      anoFabricacao: 2022,
      anoModelo: 2022,
      cor: "Prata",
      hodometroAtual: 45_000,
      manutencoes: {
        create: [
          manutencao("Troca de óleo e filtros", 30_000, 450, 400, "OURO_SEFAZ"),
          manutencao("Revisão 40.000 km", 40_000, 1200, 180, "OURO_SEFAZ"),
          manutencao("Troca de pastilhas de freio", 42_500, 680, 90, "PRATA_OCR", "CORRETIVA"),
          manutencao("Alinhamento e balanceamento", 44_000, 200, 30, "BRONZE_DECLARADO"),
        ],
      },
      esteticas: {
        create: [
          { tipo: "VITRIFICACAO", custo: 2500, dataServico: dias(240), seloIntegridade: "OURO_SEFAZ", validadeMeses: 24, dataValidade: dias(240 - 730) },
          { tipo: "LAVAGEM_COMPLETA", custo: 80, dataServico: dias(38), seloIntegridade: "BRONZE_DECLARADO" },
          { tipo: "LAVAGEM_SIMPLES", custo: 40, dataServico: dias(24), seloIntegridade: "BRONZE_DECLARADO" },
          { tipo: "LAVAGEM_SIMPLES", custo: 40, dataServico: dias(10), seloIntegridade: "BRONZE_DECLARADO" },
          { tipo: "HIGIENIZACAO", custo: 350, dataServico: dias(60), seloIntegridade: "PRATA_OCR" },
        ],
      },
    },
  });

  await prisma.veiculo.create({
    data: {
      userId: user.id,
      tipo: "MOTO",
      placa: "MTB5C89",
      marca: "Honda",
      modelo: "CB 650R",
      anoFabricacao: 2023,
      anoModelo: 2023,
      cor: "Vermelha",
      hodometroAtual: 12_000,
      manutencoes: {
        create: [
          manutencao("Revisão 6.000 km", 6_000, 380, 200, "OURO_SEFAZ"),
          manutencao("Troca de pneu traseiro", 11_000, 900, 45, "PRATA_OCR", "CORRETIVA"),
        ],
      },
    },
  });

  await prisma.veiculo.create({
    data: {
      userId: user.id,
      tipo: "CAMINHAO",
      placa: "CAM3H78",
      marca: "Scania",
      modelo: "R450",
      anoFabricacao: 2021,
      anoModelo: 2021,
      cor: "Branca",
      hodometroAtual: 280_000,
      horimetroAtual: 8_500,
      manutencoes: {
        create: [
          manutencao("Troca de óleo do motor", 200_000, 2500, 500, "OURO_SEFAZ", "PREVENTIVA", 6_000),
          manutencao("Revisão do sistema de freios", 220_000, 4800, 400, "OURO_SEFAZ", "PREVENTIVA", 6_600),
          manutencao("Substituição de embreagem", 240_000, 12_000, 300, "PRATA_OCR", "CORRETIVA", 7_200),
          manutencao("Troca de filtros de ar e combustível", 255_000, 1800, 200, "PRATA_OCR", "PREVENTIVA", 7_700),
          manutencao("Regulagem de válvulas", 268_000, 3200, 100, "BRONZE_DECLARADO", "PREVENTIVA", 8_100),
          manutencao("Troca de óleo do motor", 278_000, 2600, 20, "OURO_SEFAZ", "PREVENTIVA", 8_450),
        ],
      },
    },
  });

  await prisma.planoManutencao.deleteMany();
  await prisma.planoManutencao.createMany({
    data: [
      { nome: "Troca de Óleo", tipoVeiculo: "CARRO", intervaloKm: 10_000, intervaloDias: 365 },
      { nome: "Troca de Óleo", tipoVeiculo: "MOTO", intervaloKm: 3_000, intervaloDias: 180 },
      { nome: "Troca de Óleo", tipoVeiculo: "CAMINHAO", intervaloKm: 30_000, intervaloHoras: 500 },
      { nome: "Filtro de Ar", intervaloKm: 20_000, intervaloDias: 365 },
      { nome: "Correia Dentada", intervaloKm: 60_000, intervaloDias: 4 * 365 },
      { nome: "Pneus", intervaloKm: 40_000, intervaloDias: 4 * 365 },
    ],
  });

  console.log("Seed OK: 3 veículos + planos padrão criados para teste@autocare.dev");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
