interface HistoryTableRowProps {
  orderNumber: number;
  totalValue: number;
  tableNumber: number;
  date: string;
  time: string;
  isEven?: boolean;
}

export default function HistoryTableRow({
  orderNumber,
  totalValue,
  tableNumber,
  date,
  time,
  isEven = false,
}: HistoryTableRowProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <tr
      className={`${
        isEven ? "bg-yellow-200" : "bg-yellow-100"
      } text-vermelho-principal font-roboto font-bold text-center`}
    >
      <td className="py-4 px-6">{orderNumber}</td>
      <td className="py-4 px-6">{formatCurrency(totalValue)}</td>
      <td className="py-4 px-6">{tableNumber}</td>
      <td className="py-4 px-6">{date}</td>
      <td className="py-4 px-6">{time}</td>
    </tr>
  );
}
