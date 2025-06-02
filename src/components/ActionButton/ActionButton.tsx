import { Plus } from "lucide-react";

interface ActionButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
}

export default function ActionButton({
  title,
  onClick,
  className = "",
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-amarelo-principal text-vermelho-principal font-bold font-roboto 
        py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer
        flex items-center gap-2 ${className}
      `}
    >
      <Plus size={20} />
      {title}
    </button>
  );
}
