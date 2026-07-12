import { z } from "zod";

const anoAtual = new Date().getFullYear();

export const veiculoSchema = z
  .object({
    tipo: z.enum(["CARRO", "MOTO", "CAMINHAO"], { message: "Selecione o tipo" }),
    placa: z
      .string()
      .regex(/^[A-Z]{3}\d[A-Z]\d{2}$/, "Placa inválida (formato ABC1D23)"),
    marca: z.string().min(2, "Informe a marca"),
    modelo: z.string().min(1, "Informe o modelo"),
    anoFabricacao: z.coerce
      .number({ message: "Ano inválido" })
      .int()
      .min(1950, "Ano mínimo: 1950")
      .max(anoAtual + 1, `Ano máximo: ${anoAtual + 1}`),
    anoModelo: z.coerce
      .number({ message: "Ano inválido" })
      .int()
      .min(1950, "Ano mínimo: 1950")
      .max(anoAtual + 1, `Ano máximo: ${anoAtual + 1}`),
    cor: z.string().min(2, "Informe a cor"),
    hodometroInicial: z.coerce
      .number({ message: "Valor inválido" })
      .min(0, "Não pode ser negativo"),
    horimetroInicial: z.coerce
      .number({ message: "Valor inválido" })
      .min(0, "Não pode ser negativo")
      .optional(),
  })
  .refine((d) => d.anoModelo >= d.anoFabricacao, {
    message: "Ano modelo não pode ser anterior ao de fabricação",
    path: ["anoModelo"],
  })
  .refine((d) => d.tipo !== "CAMINHAO" || d.horimetroInicial != null, {
    message: "Informe o horímetro inicial",
    path: ["horimetroInicial"],
  });

export type VeiculoFormInput = z.input<typeof veiculoSchema>;
export type VeiculoFormData = z.output<typeof veiculoSchema>;
