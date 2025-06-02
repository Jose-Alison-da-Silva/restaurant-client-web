import { Check, X, Pencil } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  onEdit: (id: number) => void;
  onToggleStatus: (id: number, newStatus: boolean) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  category,
  description,
  imageUrl,
  isActive,
  onEdit,
  onToggleStatus,
}: ProductCardProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="border-b-2 border-gray-300 pb-6 mb-6">
      <div className="flex items-start gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <img
              src={`http://localhost:3000${imageUrl}`}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-xs">SEM IMAGEM</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="space-y-2">
            <p className="text-vermelho-principal font-bold font-roboto">
              <span>NOME: </span>
              <span className="text-black">{name.toUpperCase()}</span>
            </p>

            <p className="text-vermelho-principal font-bold font-roboto">
              <span>VALOR: </span>
              <span className="text-black">{formatCurrency(price)}</span>
            </p>

            <p className="text-vermelho-principal font-bold font-roboto">
              <span>CATEGORIA: </span>
              <span className="text-black">{category.toUpperCase()}</span>
            </p>

            <p className="text-vermelho-principal font-bold font-roboto">
              <span>DESCRIÇÃO: </span>
              <span className="text-black">{description.toUpperCase()}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(id)}
            className="w-12 h-12 bg-vermelho-principal rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <Pencil className="w-6 h-6 text-white" />
          </button>

          {/* Status Toggle Button */}
          <button
            onClick={() => onToggleStatus(id, !isActive)}
            className={`
              w-16 h-12 rounded-full flex items-center justify-between transition-colors
              ${
                isActive
                  ? "bg-vermelho-principal hover:bg-red-700"
                  : "bg-vermelho-principal hover:bg-red-700"
              }
            `}
          >
            <div
              className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${isActive ? "bg-amarelo-principal" : "bg-vermelho-principal"}
            `}
            >
              {isActive ? (
                <Check className="w-6 h-6 text-vermelho-principal" />
              ) : (
                <X className="w-6 h-6 text-white" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
