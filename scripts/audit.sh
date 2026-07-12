#!/bin/bash
set -e
echo "🔍 Auditoria AutoCare Passport"
echo "1/3 TypeScript..." && npx tsc --noEmit
echo "2/3 Lint..." && npm run lint
echo "3/3 Build..." && npm run build
echo "📊 Páginas: $(find src/app -name 'page.tsx' 2>/dev/null | wc -l | tr -d ' ')"
echo "📊 Componentes: $(find src/components -name '*.tsx' 2>/dev/null | wc -l | tr -d ' ')"
echo "✅ Auditoria OK"
