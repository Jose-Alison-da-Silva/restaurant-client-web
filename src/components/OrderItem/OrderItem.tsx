type OrderItemProps = {
  quantity: number;
  name: string;
  observations?: string;
  className?: string;
};

export default function OrderItem({
  quantity,
  name,
  observations = "NENHUMA OBSERVAÇÃO ADICIONADA...",
  className = "",
}: OrderItemProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center gap-4 mb-3">
        <div className="bg-vermelho-principal text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold font-roboto text-lg">
          {quantity}
        </div>
        <h3 className="text-vermelho-principal font-bold font-roboto text-xl uppercase">
          {name}
        </h3>
      </div>

      <div className="ml-0">
        <p className="text-vermelho-principal font-semibold font-roboto mb-2 text-sm">
          OBSERVAÇÕES
        </p>
        <div className="bg-gray-200 rounded-lg p-4 min-h-24 max-w-2xl flex items-center ring-1 ring-gray-700">
          <p className="text-gray-500 text-sm uppercase font-roboto">
            {observations}
          </p>
        </div>
      </div>
    </div>
  );
}
