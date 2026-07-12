#!/bin/bash
set -e
npx prisma migrate reset --force
npx prisma db seed
echo "✅ Banco resetado e populado"
