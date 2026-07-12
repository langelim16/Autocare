import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Car, ShieldCheck } from "lucide-react";
import { getPassaporte } from "@/core/services/passaporte.service";
import { TrustScoreCircle } from "@/components/passaporte/TrustScoreCircle";
import { TimelineItem } from "@/components/passaporte/TimelineItem";
import { ShareButton } from "@/components/passaporte/ShareButton";

export default async function Page({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const dados = await getPassaporte(hash);
  if (!dados) notFound();

  const { veiculo, timeline, score, ultimaConsultaDetran } = dados;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          {veiculo.fotoUrl ? (
            <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-surface-border">
              <Image src={veiculo.fotoUrl} alt={`${veiculo.marca} ${veiculo.modelo}`} fill className="object-cover" sizes="128px" />
            </div>
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-surface-border bg-surface">
              <Car className="h-14 w-14 text-gray-600" />
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-100">
              {veiculo.marca} {veiculo.modelo}
            </h1>
            <p className="text-sm text-gray-400">{veiculo.anoFabricacao}/{veiculo.anoModelo} · {veiculo.cor}</p>
          </div>
          <div className="rounded-lg border-2 border-blue-500 bg-blue-600 px-6 py-2 font-mono text-2xl font-bold tracking-widest text-white shadow-lg">
            {veiculo.placa}
          </div>
        </div>

        {/* Trust Score */}
        <div className="flex justify-center rounded-xl border border-surface-border bg-surface p-8 backdrop-blur-xl">
          <TrustScoreCircle score={score} />
        </div>

        {/* Timeline */}
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-lg font-semibold text-gray-100">Histórico de Cuidados</h2>
          {timeline.length === 0 ? (
            <p className="rounded-xl border border-surface-border bg-surface p-6 text-sm text-gray-400 backdrop-blur-xl">
              Nenhum registro ainda.
            </p>
          ) : (
            <div className="mt-2">
              {timeline.map((item) => (
                <TimelineItem key={`${item.origem}-${item.id}`} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Situação Documental */}
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-lg font-semibold text-gray-100">Situação Documental</h2>
          <div className="rounded-xl border border-surface-border bg-surface p-6 backdrop-blur-xl">
            {ultimaConsultaDetran ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Última consulta DETRAN</p>
                  <p className="text-xs text-gray-500">
                    {ultimaConsultaDetran.consultadoEm.toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <p
                  className={`font-display text-xl font-bold ${
                    ultimaConsultaDetran.totalDebitos > 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {ultimaConsultaDetran.totalDebitos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Nenhuma consulta DETRAN realizada.</p>
            )}
          </div>
        </section>

        {/* Rodapé */}
        <footer className="flex flex-col items-center gap-4 border-t border-surface-border pt-8 text-center">
          <ShareButton />
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100">
            <ShieldCheck className="h-4 w-4" />
            Verificado por AutoCare Passport
          </Link>
        </footer>
      </div>
    </div>
  );
}
