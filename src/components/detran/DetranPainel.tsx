"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ConsultaDetranResultado } from "@/integrations/detran/detran-mock.provider";
import { MultasTable } from "./MultasTable";
import { IpvaCard } from "./IpvaCard";
import { LicenciamentoCard } from "./LicenciamentoCard";

type Opcao = { id: string; placa: string; modelo: string };

export function DetranPainel({ veiculos }: { veiculos: Opcao[] }) {
  const [veiculoId, setVeiculoId] = useState(veiculos[0]?.id ?? "");
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<ConsultaDetranResultado | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function consultar() {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/detran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ veiculoId }),
      });
      if (!res.ok) throw new Error((await res.json()).erro ?? "Falha na consulta.");
      setResultado(await res.json());
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha na consulta.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-xl border border-surface-border bg-surface p-4 backdrop-blur-xl sm:flex-row sm:items-center">
        <select
          value={veiculoId}
          onChange={(e) => setVeiculoId(e.target.value)}
          aria-label="Selecionar veículo"
          className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm text-gray-100 focus:border-brand-500 focus:outline-none sm:max-w-xs"
        >
          {veiculos.map((v) => (
            <option key={v.id} value={v.id} className="bg-gray-950">
              {v.placa} — {v.modelo}
            </option>
          ))}
        </select>
        <Button onClick={consultar} disabled={carregando || !veiculoId} className="sm:w-auto">
          {carregando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Consultar Situação
        </Button>
      </div>

      {erro && <p className="text-sm text-red-400">{erro}</p>}

      {resultado && (
        <div className="flex flex-col gap-6">
          <div
            className={cn(
              "rounded-xl border p-6 text-center backdrop-blur-xl",
              resultado.totalDebitos > 0
                ? "border-red-500/30 bg-red-500/5"
                : "border-green-500/30 bg-green-500/5"
            )}
          >
            <p className="text-sm text-gray-400">Total de débitos</p>
            <p
              className={cn(
                "font-display text-4xl font-bold",
                resultado.totalDebitos > 0 ? "text-red-400" : "text-green-400"
              )}
            >
              {resultado.totalDebitos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>

          <Tabs defaultValue="multas">
            <TabsList>
              <TabsTrigger value="multas">Multas</TabsTrigger>
              <TabsTrigger value="ipva">IPVA</TabsTrigger>
              <TabsTrigger value="licenciamento">Licenciamento</TabsTrigger>
            </TabsList>
            <TabsContent value="multas">
              <MultasTable multas={resultado.multas} />
            </TabsContent>
            <TabsContent value="ipva">
              <IpvaCard ipva={resultado.ipva} />
            </TabsContent>
            <TabsContent value="licenciamento">
              <LicenciamentoCard licenciamento={resultado.licenciamento} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
