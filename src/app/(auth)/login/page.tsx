"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Car, Loader2, Mail, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"google" | "magic" | null>(null);
  const supabase = createClient();

  function loginDemo() {
    document.cookie = "demo_user=true; path=/";
    router.push("/dashboard");
  }

  async function loginGoogle() {
    setLoading("google");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      toast.error("Erro ao entrar com Google. Tente novamente.");
      setLoading(null);
    }
  }

  async function loginMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading("magic");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(null);
    if (error) {
      toast.error("Erro ao enviar link. Tente novamente.");
    } else {
      toast.success("Link mágico enviado! Verifique seu email.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-600/20 via-gray-950 to-gray-950 p-4">
      <div className="animate-slide-up w-full max-w-sm rounded-xl border border-surface-border bg-surface p-8 backdrop-blur-xl">
        <div className="mb-8 flex flex-col items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30">
            <Car className="h-7 w-7" />
          </span>
          <div className="text-center">
            <h1 className="font-display text-xl font-semibold text-gray-100">
              AutoCare Passport
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Histórico verificado do seu veículo
            </p>
          </div>
        </div>

        <Button
          onClick={loginDemo}
          className="w-full bg-brand-500 text-gray-950 font-semibold hover:bg-brand-400 active:scale-[0.98] transition-all duration-200 mb-3"
        >
          <Rocket className="h-4 w-4 mr-2" />
          Entrar (Modo Demonstração)
        </Button>

        <Button
          onClick={loginGoogle}
          disabled={loading !== null}
          variant="outline"
          className="w-full border-surface-border text-gray-100 hover:bg-surface-hover active:scale-[0.98] transition-all duration-200"
        >
          {loading === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Entrar com Google"
          )}
        </Button>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-surface-border" />
          <span className="text-xs text-gray-400">ou</span>
          <span className="h-px flex-1 bg-surface-border" />
        </div>

        <form onSubmit={loginMagicLink} className="space-y-4">
          <Input
            type="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-950/50 border-surface-border text-gray-100 placeholder:text-gray-400"
          />
          <Button
            type="submit"
            variant="outline"
            disabled={loading !== null}
            className="w-full border-surface-border text-gray-100 hover:bg-surface-hover transition-all duration-200"
          >
            {loading === "magic" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Receber Magic Link
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
