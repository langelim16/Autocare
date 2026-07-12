"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registroSchema, type RegistroFormInput, type RegistroFormData } from "@/core/registro-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LABELS_ESTETICO } from "@/core/estetica-stats";

const hoje = () => new Date().toISOString().slice(0, 10);

export function FormularioManual({
  ehCaminhao,
  onPreencher,
}: {
  ehCaminhao: boolean;
  onPreencher: (dados: RegistroFormData) => void;
}) {
  const form = useForm<RegistroFormInput, unknown, RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: { tipoRegistro: "MANUTENCAO", tipo: "CORRETIVA", itens: [], dataServico: hoje() },
  });
  const err = form.formState.errors;

  const campo = (nome: string, children: React.ReactNode, erro?: string) => (
    <div className="flex flex-col gap-1">
      <Label>{nome}</Label>
      {children}
      {erro && <p className="text-xs text-red-400">{erro}</p>}
    </div>
  );

  return (
    <form
      onSubmit={form.handleSubmit(onPreencher)}
      className="grid grid-cols-1 gap-4 rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl sm:grid-cols-2"
    >
      {campo(
        "Categoria",
        <select
          {...form.register("tipoRegistro")}
          className="h-9 rounded-lg border border-surface-border bg-transparent px-2 text-sm text-gray-100"
        >
          <option value="MANUTENCAO">Manutenção</option>
          <option value="ESTETICO">Estética</option>
        </select>
      )}
      {form.watch("tipoRegistro") === "ESTETICO"
        ? campo(
            "Tipo estético",
            <select
              {...form.register("tipoEstetico")}
              className="h-9 rounded-lg border border-surface-border bg-transparent px-2 text-sm text-gray-100"
            >
              {Object.entries(LABELS_ESTETICO).map(([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              ))}
            </select>
          )
        : campo(
            "Tipo de serviço",
            <select
              {...form.register("tipo")}
              className="h-9 rounded-lg border border-surface-border bg-transparent px-2 text-sm text-gray-100"
            >
              <option value="CORRETIVA">Corretiva</option>
              <option value="PREVENTIVA">Preventiva</option>
            </select>
          )}
      {campo("Data do serviço", <Input type="date" {...form.register("dataServico")} />, err.dataServico?.message)}
      <div className="sm:col-span-2">
        {campo("Descrição", <Textarea rows={2} {...form.register("descricao")} placeholder="Ex.: troca de óleo e filtros" />, err.descricao?.message)}
      </div>
      <div className="sm:col-span-2">
        {campo(
          "Itens (separados por vírgula)",
          <Input
            placeholder="Óleo 5W30, filtro de óleo"
            onChange={(e) =>
              form.setValue("itens", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
            }
          />
        )}
      </div>
      {campo("Km atual", <Input type="number" inputMode="numeric" {...form.register("km")} />, err.km?.message)}
      {ehCaminhao &&
        campo("Horas motor", <Input type="number" inputMode="numeric" {...form.register("horasMotor")} />, err.horasMotor?.message)}
      {campo("Custo (R$)", <Input type="number" step="0.01" inputMode="decimal" {...form.register("custo")} />, err.custo?.message)}
      {campo("Oficina", <Input {...form.register("oficina")} placeholder="Nome da oficina" />)}
      <div className="sm:col-span-2">
        <Button type="submit" className="w-full bg-brand-500 text-white hover:bg-brand-400">
          Revisar registro
        </Button>
      </div>
    </form>
  );
}
