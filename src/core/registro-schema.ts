import { z } from "zod";

export const registroSchema = z.object({
  tipoRegistro: z.enum(["MANUTENCAO", "ESTETICO"]),
  tipo: z.enum(["PREVENTIVA", "CORRETIVA"]).default("CORRETIVA"),
  tipoEstetico: z
    .enum(["LAVAGEM_SIMPLES", "LAVAGEM_COMPLETA", "POLIMENTO", "VITRIFICACAO", "HIGIENIZACAO"])
    .default("LAVAGEM_COMPLETA"),
  descricao: z.string().min(3, "Descreva o serviço"),
  itens: z.array(z.string()).default([]),
  custo: z.coerce.number({ message: "Custo inválido" }).min(0, "Não pode ser negativo"),
  km: z.coerce.number({ message: "Km inválido" }).min(0, "Não pode ser negativo"),
  horasMotor: z.coerce.number().min(0).optional(),
  oficina: z.string().optional(),
  dataServico: z.string().min(1, "Informe a data"),
});

export type RegistroFormInput = z.input<typeof registroSchema>;
export type RegistroFormData = z.output<typeof registroSchema>;

export type SeloPrevisto = "OURO_SEFAZ" | "PRATA_OCR" | "BRONZE_DECLARADO";

export type DadosExtraidos = RegistroFormData & {
  chaveNfe?: string | null;
  seloPrevisto: SeloPrevisto;
  confianca: number;
  resumo?: string;
};
