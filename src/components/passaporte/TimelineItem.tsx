import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatKm } from "@/core/trust-score";
import type { ItemTimeline } from "@/core/services/passaporte.service";

const SELO: Record<
  ItemTimeline["seloIntegridade"],
  { label: string; dot: string; explicacao: string }
> = {
  OURO_SEFAZ: { label: "Ouro", dot: "bg-seal-gold", explicacao: "Verificado na SEFAZ" },
  PRATA_OCR: { label: "Prata", dot: "bg-seal-silver", explicacao: "Verificado por OCR" },
  BRONZE_DECLARADO: { label: "Bronze", dot: "bg-seal-bronze", explicacao: "Declarado pelo proprietário" },
};

function mesmaData(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

export function TimelineItem({ item }: { item: ItemTimeline }) {
  const selo = SELO[item.seloIntegridade];
  const datasDivergem = !mesmaData(item.dataServico, item.dataCadastro);

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      <div className="absolute left-[7px] top-4 h-full w-px bg-surface-border last:hidden" />
      <span className={`relative mt-1.5 h-4 w-4 shrink-0 rounded-full ring-4 ring-gray-950 ${selo.dot}`} />
      <div className="flex-1 rounded-xl border border-surface-border bg-surface p-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">
            {item.dataServico.toLocaleDateString("pt-BR")}
            {item.km !== null && <> · {formatKm(item.km)}</>}
          </span>
          <Tooltip>
            <TooltipTrigger className={`rounded-full px-2 py-0.5 text-xs font-semibold text-gray-900 ${selo.dot}`}>
              {selo.label}
            </TooltipTrigger>
            <TooltipContent>{selo.explicacao}</TooltipContent>
          </Tooltip>
        </div>
        <p className="mt-1.5 font-medium text-gray-100">{item.descricao}</p>
        {item.custo !== null && (
          <p className="mt-1 text-sm text-gray-400">
            {item.custo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        )}
        {datasDivergem && (
          <p className="mt-1 text-xs text-gray-500">
            Realizado em {item.dataServico.toLocaleDateString("pt-BR")} · Registrado em{" "}
            {item.dataCadastro.toLocaleDateString("pt-BR")}
          </p>
        )}
        {item.comprovanteUrl && (
          <div className="relative mt-3 h-16 w-16 overflow-hidden rounded-lg border border-surface-border">
            <Image src={item.comprovanteUrl} alt={`Comprovante: ${item.descricao}`} fill className="object-cover" sizes="64px" />
          </div>
        )}
      </div>
    </div>
  );
}
