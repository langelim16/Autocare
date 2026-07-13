# AutoCare Passport

## Stack
Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Prisma, Supabase (Auth + DB + Storage), tRPC.

## Comandos
- dev: npm run dev
- build: npm run build
- lint: npm run lint
- migrate: npx prisma migrate dev
- seed: npx prisma db seed
- audit: bash scripts/audit.sh
- reset db: bash scripts/seed-reset.sh

## Convenções
- Páginas: src/app/(dashboard)/[modulo]/page.tsx
- Componentes: src/components/[modulo]/NomeComponente.tsx (máx 100 linhas)
- Lógica pura: src/core/
- Integrações: src/integrations/[servico]/
- Forms: React Hook Form + Zod. Sempre.
- Idioma da UI: PT-BR. Moeda: R$. Datas: DD/MM/AAAA.
- Ícones: Lucide React. Nenhuma outra lib de ícones.
- Regra de ouro: npm run build sem erros antes de concluir qualquer tarefa.

## Git — push automático
Repositório: https://github.com/langelim16/Autocare.git (branch main).
Sempre que autocare.html (ou qualquer outro arquivo do projeto) for criado/alterado numa sessão, faça commit e push para origin/main ao final da tarefa, sem precisar que o usuário peça. Não pedir confirmação para esse push de rotina — só pausar se houver conflito, force-push, ou risco de perda de histórico.

## Acesso via celular (GitHub Pages)
O app é publicado em https://langelim16.github.io/Autocare/ via GitHub Pages (raiz do branch main). index.html é uma cópia de autocare.html — sempre que autocare.html mudar, copiar (`cp autocare.html index.html`) e incluir index.html no mesmo commit/push, senão a versão do celular fica desatualizada.

## Skills (ler antes de tarefas complexas)
- .claude/skills/autocare-design-system/ — cores, tipografia, componentes visuais
- .claude/skills/integrity-engine/ — selos, antifraude, monotonia de Km
- .claude/skills/audit-loop/ — processo de auditoria periódica
- .claude/skills/create-module/ — padrão para novos módulos
