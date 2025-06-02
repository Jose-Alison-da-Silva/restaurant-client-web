import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import OrderItem from "../components/OrderItem/OrderItem";
import StatusSelector from "../components/StatusSelector/StatusSelector";
import type { OrderStatus } from "../components/TableCard/TableCard";
import Header from "../components/Header/Header";

interface OrderItemData {
  id: number;
  quantidade: number;
  observacoes?: string;
  produto: {
    id: number;
    nome: string;
    preco: number;
  };
}

interface OrderData {
  id: number;
  status: OrderStatus;
  createdAt: string;
  valorTotal: number;
  mesa: {
    id: string;
    numero: number;
  };
  itens: OrderItemData[];
}

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { api } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async (): Promise<OrderData> => {
      const response = await api.get(`/pedidos/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: OrderStatus) => {
      await api.patch(`/pedidos/${orderId}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const releaseTableMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/mesas/${order?.mesa.id}`, { status: "LIVRE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/dashboard");
    },
  });

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateStatusMutation.mutate(newStatus);
  };

  const handleReleaseTable = () => {
    if (
      window.confirm(
        "Tem certeza que deseja liberar a mesa? Esta ação não pode ser desfeita."
      )
    ) {
      releaseTableMutation.mutate();
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header showBackButton />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header showBackButton />

        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 text-lg font-semibold mb-4">
              Erro ao carregar pedido
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header showBackButton />

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Table Info */}
        <div className="mb-8">
          <div className="bg-amarelo-principal text-vermelho-principal font-bold font-roboto text-xl px-6 py-3 rounded-lg inline-block mb-6">
            MESA {order.mesa.numero.toString().padStart(2, "0")}
          </div>

          <div className="space-y-2 text-vermelho-principal font-semibold font-roboto">
            <p>PEDIDO REALIZADO AS {formatDateTime(order.createdAt)}</p>
            <p>TEMPO ESTIMADO: 30 MINUTOS</p>
            <p>Nº DO PEDIDO: {order.id}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          {order.itens.map((item) => (
            <OrderItem
              key={`${item.id}-${item.produto.id}`}
              quantity={item.quantidade}
              name={item.produto.nome}
              observations={item.observacoes}
            />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t-2 border-gray-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-vermelho-principal font-bold font-roboto text-lg">
                STATUS DO PEDIDO:
              </span>
              <StatusSelector
                status={order.status}
                onStatusChange={handleStatusChange}
                disabled={updateStatusMutation.isPending}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={handleReleaseTable}
              disabled={releaseTableMutation.isPending}
              className="bg-vermelho-principal text-white font-bold font-roboto py-3 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              <Users size={20} />
              {releaseTableMutation.isPending ? "LIBERANDO..." : "LIBERAR MESA"}
            </button>

            <div className="bg-amarelo-principal text-vermelho-principal font-bold font-roboto py-3 px-6 rounded-lg text-lg">
              VALOR TOTAL: {formatCurrency(order.valorTotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
