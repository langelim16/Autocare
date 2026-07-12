-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "renavam" TEXT,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anoFabricacao" INTEGER NOT NULL,
    "anoModelo" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "hodometroAtual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "horimetroAtual" DOUBLE PRECISION,
    "fotoUrl" TEXT,
    "hashPassaporte" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroTelemetria" (
    "id" TEXT NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "km" DOUBLE PRECISION NOT NULL,
    "horasMotor" DOUBLE PRECISION,
    "dataServico" TIMESTAMP(3) NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origem" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroTelemetria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manutencao" (
    "id" TEXT NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "itens" TEXT,
    "oficina" TEXT,
    "cnpjOficina" TEXT,
    "custo" DOUBLE PRECISION NOT NULL,
    "kmNoMomento" DOUBLE PRECISION NOT NULL,
    "horasNoMomento" DOUBLE PRECISION,
    "dataServico" TIMESTAMP(3) NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comprovanteUrl" TEXT,
    "hashImagem" TEXT,
    "chaveNfeSefaz" TEXT,
    "xmlSefazCache" TEXT,
    "seloIntegridade" TEXT NOT NULL DEFAULT 'BRONZE_DECLARADO',
    "status" TEXT NOT NULL DEFAULT 'CONCLUIDO',
    "motivoRejeicao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manutencao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanoManutencao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoVeiculo" TEXT,
    "intervaloKm" DOUBLE PRECISION,
    "intervaloHoras" DOUBLE PRECISION,
    "intervaloDias" INTEGER,
    "descricao" TEXT,

    CONSTRAINT "PlanoManutencao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroEstetico" (
    "id" TEXT NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "custo" DOUBLE PRECISION,
    "oficina" TEXT,
    "dataServico" TIMESTAMP(3) NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comprovanteUrl" TEXT,
    "seloIntegridade" TEXT NOT NULL DEFAULT 'BRONZE_DECLARADO',
    "validadeMeses" INTEGER,
    "dataValidade" TIMESTAMP(3),

    CONSTRAINT "RegistroEstetico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultaDetran" (
    "id" TEXT NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "consultadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "multasJson" TEXT,
    "ipvaStatus" TEXT,
    "licenciamento" TEXT,
    "totalDebitos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "provider" TEXT NOT NULL,

    CONSTRAINT "ConsultaDetran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_hashPassaporte_key" ON "Veiculo"("hashPassaporte");

-- CreateIndex
CREATE INDEX "Veiculo_userId_idx" ON "Veiculo"("userId");

-- CreateIndex
CREATE INDEX "Veiculo_placa_idx" ON "Veiculo"("placa");

-- CreateIndex
CREATE INDEX "RegistroTelemetria_veiculoId_dataServico_idx" ON "RegistroTelemetria"("veiculoId", "dataServico");

-- CreateIndex
CREATE INDEX "Manutencao_veiculoId_dataServico_idx" ON "Manutencao"("veiculoId", "dataServico");

-- CreateIndex
CREATE INDEX "RegistroEstetico_veiculoId_dataServico_idx" ON "RegistroEstetico"("veiculoId", "dataServico");

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroTelemetria" ADD CONSTRAINT "RegistroTelemetria_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manutencao" ADD CONSTRAINT "Manutencao_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroEstetico" ADD CONSTRAINT "RegistroEstetico_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultaDetran" ADD CONSTRAINT "ConsultaDetran_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
