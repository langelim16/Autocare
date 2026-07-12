import { cn } from "@/lib/utils";

function corBarra(pct: number) {
  if (pct > 90) return "bg-red-500";
  if (pct >= 70) return "bg-yellow-500";
  return "bg-green-500";
}

export function BarraProgresso({ label, pct, detalhe }: { label: string; pct: number; detalhe: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span>{detalhe}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className={cn("h-full rounded-full transition-all duration-200", corBarra(pct))}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
