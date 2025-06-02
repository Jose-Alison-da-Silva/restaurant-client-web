export type OrderStatus = "PENDENTE" | "EM_PREPARO" | "ENTREGUE" | "CONCLUIDO";

interface TableCardProps {
  tableNumber: number;
  status: OrderStatus;
  onClick: () => void;
}

const statusConfig = {
  PENDENTE: {
    label: "PENDENTE",
    bgColor: "bg-vermelho-principal",
    textColor: "text-white",
  },
  EM_PREPARO: {
    label: "EM PREPARO",
    bgColor: "bg-vermelho-principal",
    textColor: "text-white",
  },
  ENTREGUE: {
    label: "ENTREGUE",
    bgColor: "bg-vermelho-principal",
    textColor: "text-white",
  },
  CONCLUIDO: {
    label: "CONCLUÍDO",
    bgColor: "bg-gray-500",
    textColor: "text-white",
  },
};

export default function TableCard({
  tableNumber,
  status,
  onClick,
}: TableCardProps) {
  const config = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={`
          ${config.bgColor} ${config.textColor}
          w-full h-32 rounded-lg shadow-lg
          flex flex-col items-center justify-center
          transition-all duration-200 hover:scale-105 active:scale-95
          font-bold font-roboto text-white
        `}
    >
      <div className="text-center">
        <p className="text-2xl font-bold font-roboto mb-2">MESA</p>
        <p className="text-3xl font-bold font-roboto mb-3">
          {tableNumber.toString().padStart(2, "0")}
        </p>
        <p className="text-sm font-medium font-roboto">{config.label}</p>
      </div>
    </button>
  );
}
