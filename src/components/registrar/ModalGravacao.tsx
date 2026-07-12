"use client";

import { useEffect, useRef, useState } from "react";
import { Square } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BARRAS = [0.6, 1, 0.4, 0.9, 0.5, 1, 0.7, 0.3, 0.8, 0.5, 1, 0.6];

export function ModalGravacao({
  aberto,
  onFechar,
  onGravado,
}: {
  aberto: boolean;
  onFechar: () => void;
  onGravado: (blob: Blob) => void;
}) {
  const [segundos, setSegundos] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!aberto) return;
    let timer: ReturnType<typeof setInterval>;
    queueMicrotask(() => setSegundos(0));
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const rec = new MediaRecorder(stream);
        recorderRef.current = rec;
        chunksRef.current = [];
        rec.ondataavailable = (e) => chunksRef.current.push(e.data);
        rec.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          onGravado(new Blob(chunksRef.current, { type: rec.mimeType }));
        };
        rec.start();
        timer = setInterval(() => setSegundos((s) => s + 1), 1000);
      })
      .catch(() => {
        toast.error("Permita o acesso ao microfone para gravar.");
        onFechar();
      });
    return () => {
      clearInterval(timer);
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
        recorderRef.current.stream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  const mm = String(Math.floor(segundos / 60)).padStart(2, "0");
  const ss = String(segundos % 60).padStart(2, "0");

  return (
    <Dialog open={aberto} onOpenChange={(open) => !open && onFechar()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Gravando…</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex h-16 items-end gap-1">
            {BARRAS.map((h, i) => (
              <span
                key={i}
                className="w-2 animate-pulse rounded-full bg-brand-500"
                style={{
                  height: `${h * 100}%`,
                  animationDuration: `${0.6 + (i % 4) * 0.15}s`,
                }}
              />
            ))}
          </div>
          <p className="font-mono text-2xl font-bold text-gray-100">
            {mm}:{ss}
          </p>
          <Button
            size="lg"
            className="gap-2 bg-red-600 text-white hover:bg-red-500"
            onClick={() => recorderRef.current?.stop()}
          >
            <Square className="h-4 w-4" /> Parar e enviar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
