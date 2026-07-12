import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component: middleware refreshes sessions
          }
        },
      },
    }
  );
}

export async function getDemoOrRealUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && user.email) {
      return {
        id: user.id,
        email: user.email,
        nome: user.user_metadata?.full_name || user.email,
      };
    }
  } catch {
    // Ignora erro se Supabase não estiver configurado
  }

  return {
    id: "demo-user",
    email: "teste@autocare.dev",
    nome: "Usuário Teste",
  };
}
