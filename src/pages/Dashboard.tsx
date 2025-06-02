import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header/Header";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import TableCard, { type OrderStatus } from "../components/TableCard/TableCard";
import { useAuth } from "../contexts/AuthContext";

type mesa = {
  id: string;
  numero: number;
  status: string;
};

type ultimoPedido = {
  id: number;
  status: OrderStatus;
};

interface Order {
  mesa: mesa;
  ultimoPedido: ultimoPedido;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, api } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => {
      const response = await api.get("/pedidos/mesas/ultimo");
      return response.data;
    },
    // refetchInterval: 5000,
  });

  const handleTableClick = (tableNumber: number) => {
    navigate(`/pedidos/${tableNumber}`);
  };

  const handleNavigationClick = (route: string) => {
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          <NavigationButton
            title="PEDIDOS"
            onClick={() => handleNavigationClick("/dashboard")}
            variant="primary"
          />

          {user?.role === "ADMIN" && (
            <NavigationButton
              title="PRODUTOS"
              onClick={() => handleNavigationClick("/produtos")}
              variant="secondary"
            />
          )}

          <NavigationButton
            title="HISTÓRICO"
            onClick={() => handleNavigationClick("/history")}
            variant="secondary"
          />
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {orders &&
            orders.map((order) => (
              <TableCard
                key={order.ultimoPedido.id}
                tableNumber={order.mesa.numero}
                status={order.ultimoPedido.status}
                onClick={() => handleTableClick(order.ultimoPedido.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
