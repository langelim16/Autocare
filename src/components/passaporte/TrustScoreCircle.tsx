"use client";

import { useEffect, useState } from "react";

const RAIO = 70;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

function corPorScore(score: number | null) {
  if (score === null) return "#6b7280";
  if (score >= 80) return "#34d399";
  if (score >= 50) return "#facc15";
  return "#f87171";
}

function labelPorScore(score: number | null) {
  if (score === null) return "Sem Verificação Suficiente";
  if (score >= 80) return "Histórico Verificado";
  if (score >= 50) return "Histórico Parcial";
  return "Sem Verificação Suficiente";
}

export function TrustScoreCircle({ score }: { score: number | null }) {
  const [preenchido, setPreenchido] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setPreenchido(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const pct = preenchido ? (score ?? 0) : 0;
  const offset = CIRCUNFERENCIA - (pct / 100) * CIRCUNFERENCIA;
  const cor = corPorScore(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={RAIO} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
          <circle
            cx="80"
            cy="80"
            r={RAIO}
            fill="none"
            stroke={cor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUNFERENCIA}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-bold text-gray-100">{score ?? "—"}</span>
          {score !== null && <span className="text-xs text-gray-400">/ 100</span>}
        </div>
      </div>
      <p className="font-display text-lg font-semibold" style={{ color: cor }}>
        {labelPorScore(score)}
      </p>
    </div>
  );
}
