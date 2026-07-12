"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Mic, Camera, PenLine, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ModalGravacao } from "@/components/registrar/ModalGravacao";
import { FormularioManual } from "@/components/registrar/FormularioManual";
import { CardConfirmacaoIA } from "@/components/registrar/CardConfirmacaoIA";
import type { DadosExtraidos, RegistroFormData } from "@/core/registro-schema";

export type VeiculoResumo = {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  tipo: string;
  hodometroAtual: number;
};

type Modo = "cards" | "gravando" | "processando" | "manual" | "confirmar";

export function RegistrarCliente({ veiculos }: { veiculos: VeiculoResumo[] }) {
  const [veiculoId, setVeiculoId] = useState(veiculos[0]?.id ?? "");
  const [modo, setModo] = useState<Modo>("cards");
  const [dados, setDados] = useState<DadosExtraidos | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const veiculo = veiculos.find((v) => v.id === veiculoId);
  const ehCaminhao = veiculo?.tipo === "CAMINHAO";

  async function ingerir(arquivo: Blob, nome: string) {
    setModo("processando");
    try {
      const fd = new FormData();
      fd.append("arquivo", arquivo, nome);
      fd.append("veiculoId", veiculoId);
      const res = await fetch("/api/ingestao", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Falha no processamento");
      setDados({ ...json, km: json.km || veiculo?.hodometroAtual || 0 });
      setModo("confirmar");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao processar. Tente novamente.");
      setModo("cards");
      setPreview(null);
    }
  }

  function aoEscolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      // Quality Gate: rejeita imagens muito pequenas
      if (img.naturalWidth < 500) {
        URL.revokeObjectURL(url);
        toast.warning("Tente uma foto mais nítida ou aproxime do QR Code");
        return;
      }
      setPreview(url);
      ingerir(file, file.name);
    };
    img.src = url;
  }

  function preencherManual(f: RegistroFormData) {
    setDados({ ...f, seloPrevisto: "BRONZE_DECLARADO", confianca: 100, chaveNfe: null });
    setModo("confirmar");
  }

  function resetar() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setDados(null);
    setModo("cards");
  }

  if (veiculos.length === 0)
    return (
      <p className="rounded-xl border border-surface-border bg-surface p-8 text-center text-sm text-gray-400">
        Cadastre um veículo na Garagem antes de registrar um serviço.
      </p>
    );

  const cardClasse =
    "flex flex-col items-center gap-4 rounded-xl border border-surface-border bg-surface p-8 text-center backdrop-blur-xl transition-all duration-200 hover:bg-surface-hover active:scale-[0.98]";

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-semibold text-gray-100">Registrar Serviço</h2>
        <Select value={veiculoId} onValueChange={(v) => setVeiculoId(v as string)}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {veiculos.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.placa} — {v.marca} {v.modelo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {modo === "cards" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button type="button" className={cardClasse} onClick={() => setModo("gravando")}>
            <Mic className="h-12 w-12 text-brand-500" />
            <span className="font-display font-semibold text-gray-100">Gravar Áudio</span>
            <span className="text-sm text-gray-400">Descreva o serviço em voz alta</span>
          </button>
          <button type="button" className={cardClasse} onClick={() => fileRef.current?.click()}>
            <Camera className="h-12 w-12 text-brand-500" />
            <span className="font-display font-semibold text-gray-100">Fotografar NF</span>
            <span className="text-sm text-gray-400">Aponte para a nota fiscal ou QR Code</span>
          </button>
          <button type="button" className={cardClasse} onClick={() => setModo("manual")}>
            <PenLine className="h-12 w-12 text-brand-500" />
            <span className="font-display font-semibold text-gray-100">Manual</span>
            <span className="text-sm text-gray-400">Preencha os dados do serviço</span>
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={aoEscolherFoto}
      />

      {modo === "processando" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-surface-border bg-surface p-8 backdrop-blur-xl">
          {preview && (
            <Image src={preview} alt="Prévia da nota fiscal" width={320} height={240} unoptimized className="max-h-60 w-auto rounded-lg object-contain" />
          )}
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          <p className="text-sm text-gray-400">Processando com IA…</p>
        </div>
      )}

      {modo === "manual" && (
        <FormularioManual ehCaminhao={ehCaminhao} onPreencher={preencherManual} />
      )}

      {modo === "confirmar" && dados && veiculo && (
        <CardConfirmacaoIA
          dados={dados}
          veiculoId={veiculo.id}
          ehCaminhao={ehCaminhao}
          onSalvo={resetar}
          onCorrigir={() => setModo("manual")}
        />
      )}

      <ModalGravacao
        aberto={modo === "gravando"}
        onFechar={() => setModo("cards")}
        onGravado={(blob) => ingerir(blob, "audio.webm")}
      />
    </div>
  );
}
