import { ChevronDown } from "lucide-react";
import { type OrderStatus } from "../TableCard/TableCard";

interface StatusSelectorProps {
  status: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  disabled?: boolean;
}

const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
  { value: "PENDENTE", label: "PENDENTE", color: "bg-yellow-500" },
  { value: "EM_PREPARO", label: "EM PREPARO", color: "bg-blue-500" },
  { value: "ENTREGUE", label: "ENTREGUE", color: "bg-orange-500" },
  { value: "CONCLUIDO", label: "CONCLUÍDO", color: "bg-green-500" },
];

export default function StatusSelector({
  status,
  onStatusChange,
  disabled = false,
}: StatusSelectorProps) {
  const currentOption = statusOptions.find((option) => option.value === status);

  return (
    <div className="relative">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
        disabled={disabled}
        className={`
          ${currentOption?.color} text-white font-bold py-3 px-6 rounded-lg
          appearance-none cursor-pointer min-w-[160px]
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-red-500
        `}
      >
        {statusOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-black"
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
    </div>
  );
}
