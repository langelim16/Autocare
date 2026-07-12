export function PlacaMercosul({ placa }: { placa: string }) {
  return (
    <span className="inline-flex rounded border-2 border-blue-600 bg-blue-800 px-3 py-1 font-mono text-sm font-bold text-white">
      {placa}
    </span>
  );
}
