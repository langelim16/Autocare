import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "teste@autocare.dev" },
    update: {},
    create: { email: "teste@autocare.dev", nome: "Usuário Teste" },
  });

  let veiculo = await prisma.veiculo.findFirst({ where: { placa: "RFK2A47", userId: user.id } });
  if (!veiculo) {
    veiculo = await prisma.veiculo.create({
      data: {
        userId: user.id,
        tipo: "CARRO",
        placa: "RFK2A47",
        marca: "Toyota",
        modelo: "Hilux SRV",
        anoFabricacao: 2019,
        anoModelo: 2020,
        cor: "Prata",
        hodometroAtual: 85200,
      },
    });
  }

  await prisma.manutencao.create({
    data: {
      veiculoId: veiculo.id,
      tipo: "Revisão programada",
      descricao: "Revisão 80.000km — óleo, filtros, correia",
      oficina: "Toyota Via Sul",
      custo: 1850,
      kmNoMomento: 85200,
      dataServico: new Date("2026-07-05"),
      chaveNfeSefaz: "35260700000000000000550010000012341234567890",
      seloIntegridade: "OURO_SEFAZ",
    },
  });

  await prisma.registroEstetico.create({
    data: {
      veiculoId: veiculo.id,
      tipo: "Vitrificação cerâmica",
      descricao: "9H, 3 camadas",
      custo: 2400,
      oficina: "Detail Premium",
      dataServico: new Date("2026-03-12"),
      seloIntegridade: "OURO_SEFAZ",
      validadeMeses: 24,
      dataValidade: new Date("2028-03-12"),
    },
  });

  await prisma.consultaDetran.create({
    data: {
      veiculoId: veiculo.id,
      multasJson: JSON.stringify([
        { data: "2026-05-18", tipo: "Excesso de velocidade até 20%", valor: 195.23, pontos: 4, local: "SP-348, km 42", status: "pendente" },
      ]),
      ipvaStatus: JSON.stringify({ ano: 2026, valorTotal: 1850, status: "pago" }),
      licenciamento: JSON.stringify({ ano: 2026, status: "pago", valor: 145.9, prazo: "31/12/2026" }),
      totalDebitos: 195.23,
      provider: "mock",
    },
  });

  console.log("OK — veiculo:", veiculo.id, veiculo.placa);
}

main().finally(() => prisma.$disconnect());
