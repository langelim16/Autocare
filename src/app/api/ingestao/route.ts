import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { DadosExtraidos, SeloPrevisto } from "@/core/registro-schema";

const PROMPT = `Você é um extrator de dados de serviços automotivos (manutenção ou estética).
Analise o conteúdo (áudio descrito pelo dono do veículo OU foto de nota fiscal) e retorne SOMENTE um JSON válido, sem markdown:
{
  "tipoRegistro": "MANUTENCAO" | "ESTETICO",
  "tipo": "PREVENTIVA" | "CORRETIVA",
  "descricao": string,
  "itens": string[],
  "custo": number (em reais),
  "km": number | null,
  "horasMotor": number | null,
  "oficina": string | null,
  "dataServico": "YYYY-MM-DD" | null,
  "chaveNfe": string | null (chave NF-e de 44 dígitos, se visível na imagem),
  "resumo": string (1 frase),
  "confianca": number (0-100)
}`;

function preverSelo(chaveNfe: string | null, temImagem: boolean): SeloPrevisto {
  if (chaveNfe && /^\d{44}$/.test(chaveNfe)) return "OURO_SEFAZ";
  if (temImagem) return "PRATA_OCR";
  return "BRONZE_DECLARADO";
}

function mock(temImagem: boolean): DadosExtraidos {
  return {
    tipoRegistro: "MANUTENCAO",
    tipo: "PREVENTIVA",
    tipoEstetico: "LAVAGEM_COMPLETA",
    descricao: "Troca de óleo e filtro (dados de teste)",
    itens: ["Óleo 5W30", "Filtro de óleo"],
    custo: 250,
    km: 0,
    oficina: "Oficina Exemplo",
    dataServico: new Date().toISOString().slice(0, 10),
    chaveNfe: null,
    seloPrevisto: preverSelo(null, temImagem),
    confianca: 50,
    resumo: "Mock: GEMINI_API_KEY não configurada.",
  };
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const form = await req.formData();
  const arquivo = form.get("arquivo");
  if (!(arquivo instanceof File))
    return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });

  const temImagem = arquivo.type.startsWith("image/");
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json(mock(temImagem));

  try {
    const b64 = Buffer.from(await arquivo.arrayBuffer()).toString("base64");
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: PROMPT },
              { inline_data: { mime_type: arquivo.type, data: b64 } },
            ],
          }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const json = await res.json();
    const texto: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const dados = JSON.parse(texto);
    const chaveNfe: string | null =
      dados.chaveNfe?.replace(/\D/g, "").match(/^\d{44}$/)?.[0] ?? null;

    const resultado: DadosExtraidos = {
      tipoRegistro: dados.tipoRegistro === "ESTETICO" ? "ESTETICO" : "MANUTENCAO",
      tipo: dados.tipo === "PREVENTIVA" ? "PREVENTIVA" : "CORRETIVA",
      tipoEstetico: "LAVAGEM_COMPLETA", // ponytail: IA não classifica tipo estético ainda; usuário corrige no card de confirmação

      descricao: dados.descricao ?? "",
      itens: Array.isArray(dados.itens) ? dados.itens.map(String) : [],
      custo: Number(dados.custo) || 0,
      km: Number(dados.km) || 0,
      horasMotor: dados.horasMotor != null ? Number(dados.horasMotor) : undefined,
      oficina: dados.oficina ?? undefined,
      dataServico: dados.dataServico ?? new Date().toISOString().slice(0, 10),
      chaveNfe,
      seloPrevisto: preverSelo(chaveNfe, temImagem),
      confianca: Math.min(100, Math.max(0, Number(dados.confianca) || 0)),
      resumo: dados.resumo ?? "",
    };
    return NextResponse.json(resultado);
  } catch (e) {
    console.error("ingestao:", e);
    return NextResponse.json(
      { error: "Falha ao processar. Tente novamente ou preencha manualmente." },
      { status: 502 }
    );
  }
}
