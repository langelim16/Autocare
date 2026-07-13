-- RLS para acesso direto via Supabase (autocare.html standalone, sem servidor Next.js).
-- auth.uid() é o uuid do usuário logado no Supabase Auth; "User".id passa a ser preenchido com esse mesmo valor no primeiro login.

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Veiculo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Manutencao" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RegistroEstetico" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConsultaDetran" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RegistroTelemetria" ENABLE ROW LEVEL SECURITY;

-- User: cada um só enxerga/edita o próprio registro
CREATE POLICY "user_self" ON "User"
  FOR ALL USING (auth.uid()::text = id) WITH CHECK (auth.uid()::text = id);

-- Veiculo: dono via userId
CREATE POLICY "veiculo_owner" ON "Veiculo"
  FOR ALL USING (auth.uid()::text = "userId") WITH CHECK (auth.uid()::text = "userId");

-- Leitura pública do passaporte por hash (vitrine sem login)
CREATE POLICY "veiculo_passaporte_publico" ON "Veiculo"
  FOR SELECT USING (true);

-- Manutencao/RegistroEstetico/ConsultaDetran/RegistroTelemetria: dono via veículo
CREATE POLICY "manutencao_owner" ON "Manutencao"
  FOR ALL USING ("veiculoId" IN (SELECT id FROM "Veiculo" WHERE "userId" = auth.uid()::text))
  WITH CHECK ("veiculoId" IN (SELECT id FROM "Veiculo" WHERE "userId" = auth.uid()::text));

CREATE POLICY "manutencao_passaporte_publico" ON "Manutencao"
  FOR SELECT USING (true);

CREATE POLICY "estetico_owner" ON "RegistroEstetico"
  FOR ALL USING ("veiculoId" IN (SELECT id FROM "Veiculo" WHERE "userId" = auth.uid()::text))
  WITH CHECK ("veiculoId" IN (SELECT id FROM "Veiculo" WHERE "userId" = auth.uid()::text));

CREATE POLICY "estetico_passaporte_publico" ON "RegistroEstetico"
  FOR SELECT USING (true);

CREATE POLICY "detran_owner" ON "ConsultaDetran"
  FOR ALL USING ("veiculoId" IN (SELECT id FROM "Veiculo" WHERE "userId" = auth.uid()::text))
  WITH CHECK ("veiculoId" IN (SELECT id FROM "Veiculo" WHERE "userId" = auth.uid()::text));

CREATE POLICY "detran_passaporte_publico" ON "ConsultaDetran"
  FOR SELECT USING (true);

CREATE POLICY "telemetria_owner" ON "RegistroTelemetria"
  FOR ALL USING ("veiculoId" IN (SELECT id FROM "Veiculo" WHERE "userId" = auth.uid()::text))
  WITH CHECK ("veiculoId" IN (SELECT id FROM "Veiculo" WHERE "userId" = auth.uid()::text));
