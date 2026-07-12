import { notFound } from "next/navigation";
import { getDemoOrRealUser } from "@/lib/supabase/server";
import { getVeiculo } from "@/core/services/veiculos.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VeiculoResumo } from "@/components/veiculos/VeiculoResumo";
import { ManutencoesLista } from "@/components/veiculos/ManutencoesLista";
import { EsteticaLista } from "@/components/veiculos/EsteticaLista";
import { DetranResumo } from "@/components/veiculos/DetranResumo";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getDemoOrRealUser();
  const veiculo = await getVeiculo(id, user.email);
  if (!veiculo) notFound();

  return (
    <Tabs defaultValue="resumo" className="flex flex-col gap-4">
      <TabsList>
        <TabsTrigger value="resumo">Resumo</TabsTrigger>
        <TabsTrigger value="manutencoes">Manutenções</TabsTrigger>
        <TabsTrigger value="estetica">Estética</TabsTrigger>
        <TabsTrigger value="detran">DETRAN</TabsTrigger>
      </TabsList>
      <TabsContent value="resumo">
        <VeiculoResumo veiculo={veiculo} score={veiculo.score} />
      </TabsContent>
      <TabsContent value="manutencoes">
        <ManutencoesLista manutencoes={veiculo.manutencoes} />
      </TabsContent>
      <TabsContent value="estetica">
        <EsteticaLista registros={veiculo.esteticas} />
      </TabsContent>
      <TabsContent value="detran">
        <DetranResumo consulta={veiculo.consultasDetran[0]} />
      </TabsContent>
    </Tabs>
  );
}
