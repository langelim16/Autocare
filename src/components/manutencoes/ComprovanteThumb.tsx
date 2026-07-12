"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function ComprovanteThumb({ url, descricao }: { url: string; descricao: string }) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Ampliar comprovante"
        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-surface-border transition-all duration-200 hover:opacity-80"
      >
        <Image src={url} alt={`Comprovante: ${descricao}`} fill className="object-cover" sizes="48px" />
      </button>
      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="text-sm text-gray-100">Comprovante — {descricao}</DialogTitle>
          <div className="relative h-[70vh] w-full">
            <Image src={url} alt={`Comprovante: ${descricao}`} fill className="object-contain" sizes="(max-width: 768px) 100vw, 672px" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
