"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SeloBadge } from "@/components/registrar/SeloBadge";
import { salvarRegistroAction } from "@/app/(dashboard)/registrar/actions";
import type { DadosExtraidos } from "@/core/registro-schema";

function confetti() {
  // ponytail: confetti CSS mínimo; trocar por canvas-confetti se quiser mais fluidez
  const cores = ["#f59e0b", "#22c55e", "#3b82f6", "#ec4899"];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement("span");
    el.style.cssText = `position:fixed;top:-8px;left:${Math.random() * 100}vw;width:8px;height:8px;z-index:9999;pointer-events:none;background:${cores[i % 4]};border-radius:${i % 2 ? "50%" : "0"};transition:transform 1.6s ease-in,opacity 1.6s;`;
    document.body.appendChild(el);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.transform = `translateY(105vh) rotate(${Math.random() * 720}deg)`;
        el.style.opacity = "0";
      })
    );
    setTimeout(() => el.remove(), 1800);
  }
}

export function CardConfirmacaoIA({
  dados,
  veiculoId,
  ehCaminhao,
  onSalvo,
  onCorrigir,
}: {
  dados: DadosExtraidos;
  veiculoId: string;
  ehCaminhao: boolean;
  onSalvo: () => void;
  onCorrigir: () => void;
}) {
  const [form, setForm] = useState(dados);
  const [salvando, setSalvando] = useState(false);

  const set = (k: keyof DadosExtraidos) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function salvar() {
    setSalvando(true);
    const res = await salvarRegistroAction(
      veiculoId,
      {
        tipoRegistro: form.tipoRegistro,
        tipo: form.tipo,
        tipoEstetico: form.tipoEstetico,
        descricao: form.descricao,
        itens: form.itens,
        custo: form.custo,
        km: form.km,
        horasMotor: form.horasMotor,
        oficina: form.oficina,
        dataServico: form.dataServico,
      },
      form.seloPrevisto,
      form.chaveNfe
    );
    setSalvando(false);
    if (res.ok) {
      toast.success("Serviço registrado com sucesso!");
      confetti();
      onSalvo();
    } else {
      toast.error(res.erro);
    }
  }

  const campo = (rotulo: string, children: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <Label>{rotulo}</Label>
      {children}
    </div>
  );

  return (
    <div className="animate-fade-in flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-gray-100">Confirme os dados</h3>
        <SeloBadge selo={form.seloPrevisto} />
      </div>
      {form.resumo && <p className="text-sm text-gray-400">{form.resumo}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {campo(
          "Tipo",
          <select
            value={form.tipo}
            onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as typeof f.tipo }))}
            className="h-9 rounded-lg border border-surface-border bg-transparent px-2 text-sm text-gray-100"
          >
            <option value="CORRETIVA">Corretiva</option>
            <option value="PREVENTIVA">Preventiva</option>
          </select>
        )}
        {campo("Data do serviço", <Input type="date" value={form.dataServico} onChange={set("dataServico")} />)}
        <div className="sm:col-span-2">
          {campo("Descrição", <Input value={form.descricao} onChange={set("descricao")} />)}
        </div>
        {campo("Km", <Input type="number" value={form.km} onChange={(e) => setForm((f) => ({ ...f, km: Number(e.target.value) }))} />)}
        {ehCaminhao &&
          campo("Horas motor", <Input type="number" value={form.horasMotor ?? ""} onChange={(e) => setForm((f) => ({ ...f, horasMotor: e.target.value ? Number(e.target.value) : undefined }))} />)}
        {campo("Custo (R$)", <Input type="number" step="0.01" value={form.custo} onChange={(e) => setForm((f) => ({ ...f, custo: Number(e.target.value) }))} />)}
        {campo("Oficina", <Input value={form.oficina ?? ""} onChange={set("oficina")} />)}
      </div>

      {form.itens.length > 0 && (
        <p className="text-sm text-gray-400">Itens: {form.itens.join(", ")}</p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="lg"
          disabled={salvando}
          onClick={salvar}
          className="flex-1 gap-2 bg-green-600 text-white hover:bg-green-500 active:scale-[0.98]"
        >
          <Check className="h-5 w-5" /> {salvando ? "Salvando…" : "Confirmar e Salvar"}
        </Button>
        <Button variant="ghost" size="lg" onClick={onCorrigir} className="gap-2 text-gray-400">
          <Pencil className="h-4 w-4" /> Corrigir
        </Button>
      </div>
    </div>
  );
}
