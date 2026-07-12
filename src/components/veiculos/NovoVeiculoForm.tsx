"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Car, Bike, Truck } from "lucide-react";
import {
  veiculoSchema,
  type VeiculoFormInput,
  type VeiculoFormData,
} from "@/core/veiculo-schema";
import { criarVeiculo } from "@/app/(dashboard)/garagem/novo/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIPOS = [
  { valor: "CARRO", label: "Carro", Icone: Car },
  { valor: "MOTO", label: "Moto", Icone: Bike },
  { valor: "CAMINHAO", label: "Caminhão", Icone: Truck },
] as const;

function Erro({ msg }: { msg?: string }) {
  return msg ? <p className="text-sm text-red-400">{msg}</p> : null;
}

export function NovoVeiculoForm() {
  const [pending, startTransition] = useTransition();
  const [foto, setFoto] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VeiculoFormInput, unknown, VeiculoFormData>({
    resolver: zodResolver(veiculoSchema),
    defaultValues: { tipo: "CARRO" },
  });
  const tipo = watch("tipo");

  const onSubmit = (data: VeiculoFormData) => {
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => v != null && fd.append(k, String(v)));
      if (foto) fd.append("foto", foto);
      const result = await criarVeiculo(fd);
      if (result?.error) {
        toast.error(result.error, {
          action: { label: "Tentar novamente", onClick: () => handleSubmit(onSubmit)() },
        });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-6 rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-2">
        <Label>Tipo do veículo</Label>
        <div className="grid grid-cols-3 gap-2">
          {TIPOS.map(({ valor, label, Icone }) => (
            <button
              key={valor}
              type="button"
              onClick={() => setValue("tipo", valor, { shouldValidate: true })}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-all duration-200",
                tipo === valor
                  ? "border-brand-500 bg-surface-hover text-gray-100"
                  : "border-surface-border text-gray-400 hover:bg-surface-hover"
              )}
            >
              <Icone className="h-6 w-6" />
              {label}
            </button>
          ))}
        </div>
        <Erro msg={errors.tipo?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="placa">Placa</Label>
        <Input
          id="placa"
          placeholder="ABC1D23"
          maxLength={7}
          className="w-40 font-mono uppercase"
          {...register("placa", {
            onChange: (e) => {
              e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
            },
          })}
        />
        <Erro msg={errors.placa?.message} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="marca">Marca</Label>
          <Input id="marca" placeholder="Honda" {...register("marca")} />
          <Erro msg={errors.marca?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="modelo">Modelo</Label>
          <Input id="modelo" placeholder="Civic" {...register("modelo")} />
          <Erro msg={errors.modelo?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="anoFabricacao">Ano de fabricação</Label>
          <Input id="anoFabricacao" type="number" placeholder="2022" {...register("anoFabricacao")} />
          <Erro msg={errors.anoFabricacao?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="anoModelo">Ano do modelo</Label>
          <Input id="anoModelo" type="number" placeholder="2022" {...register("anoModelo")} />
          <Erro msg={errors.anoModelo?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cor">Cor</Label>
          <Input id="cor" placeholder="Prata" {...register("cor")} />
          <Erro msg={errors.cor?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hodometroInicial">Hodômetro inicial (km)</Label>
          <Input id="hodometroInicial" type="number" placeholder="45000" {...register("hodometroInicial")} />
          <Erro msg={errors.hodometroInicial?.message} />
        </div>
        {tipo === "CAMINHAO" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="horimetroInicial">Horímetro inicial (h)</Label>
            <Input id="horimetroInicial" type="number" placeholder="8500" {...register("horimetroInicial")} />
            <Erro msg={errors.horimetroInicial?.message} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="foto">Foto (opcional, máx. 5MB)</Label>
        <Input
          id="foto"
          type="file"
          accept="image/*"
          onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-brand-500 text-white hover:bg-brand-400 active:scale-[0.98]"
      >
        {pending ? "Salvando..." : "Cadastrar veículo"}
      </Button>
    </form>
  );
}
