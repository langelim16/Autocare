export type TipoVeiculo = "CARRO" | "MOTO" | "CAMINHAO" | string;
export type SeloIntegridade = "OURO_SEFAZ" | "PRATA_OCR" | "BRONZE_DECLARADO" | string;
export type TipoManutencao = "PREVENTIVA" | "CORRETIVA" | string;
export type TipoEstetico =
  | "LAVAGEM_SIMPLES"
  | "LAVAGEM_COMPLETA"
  | "POLIMENTO"
  | "VITRIFICACAO"
  | "HIGIENIZACAO"
  | string;
export type StatusPendencia =
  | "PROCESSANDO"
  | "CONCLUIDO"
  | "PENDENTE_CONFIRMACAO"
  | "REJEITADO"
  | string;
