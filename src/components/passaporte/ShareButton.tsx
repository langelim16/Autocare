"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButton() {
  const [copiado, setCopiado] = useState(false);

  async function compartilhar() {
    await navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <Button onClick={compartilhar} variant="secondary">
      {copiado ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copiado ? "Link copiado!" : "Compartilhar"}
    </Button>
  );
}
