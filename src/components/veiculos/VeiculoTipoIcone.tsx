import { Car, Bike, Truck, type LucideProps } from "lucide-react";
import type { TipoVeiculo } from "@/core/types";

const ICONES: Record<string, typeof Car> = { CARRO: Car, MOTO: Bike, CAMINHAO: Truck };

export function VeiculoTipoIcone({
  tipo,
  ...props
}: { tipo: TipoVeiculo } & LucideProps) {
  const Icone = ICONES[tipo] ?? Car;
  return <Icone {...props} />;
}
