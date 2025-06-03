import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  ultimoPedido: ultimoPedido | null;
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
    refetchInterval: 5000,
  });

  const handleTableClick = (orderId: number | null) => {
    if (!orderId) {
      alert("Esta mesa não possui pedidos ativos no momento.");
      return;
    }
    navigate(`/pedidos/${orderId}`);
  };

  const handleNavigationClick = (route: string) => {
    navigate(route);
  };

  const tablesWithOrders = orders.filter(
    (order) => order.ultimoPedido !== null && order.mesa.status !== "LIVRE"
  );
  const tablesWithoutOrders = orders.filter(
    (order) => order.ultimoPedido === null || order.mesa.status === "LIVRE"
  );

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
              onClick={() => handleNavigationClick("/products")}
              variant="secondary"
            />
          )}

          <NavigationButton
            title="HISTÓRICO"
            onClick={() => handleNavigationClick("/history")}
            variant="secondary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <h3 className="text-vermelho-principal font-bold text-lg">
              Total de Mesas
            </h3>
            <p className="text-2xl font-bold text-gray-700">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h3 className="text-vermelho-principal font-bold text-lg">
              Com Pedidos Ativos
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {tablesWithOrders.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h3 className="text-vermelho-principal font-bold text-lg">
              Livres
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {tablesWithoutOrders.length}
            </p>
          </div>
        </div>

        {/* Mesas com Pedidos Ativos */}
        {tablesWithOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-vermelho-principal font-bold font-roboto text-xl mb-4">
              MESAS COM PEDIDOS ATIVOS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tablesWithOrders.map((order) => (
                <TableCard
                  key={order.mesa.id}
                  tableNumber={order.mesa.numero}
                  status={order.ultimoPedido!.status}
                  onClick={() => handleTableClick(order.ultimoPedido!.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mesas Livres */}
        {tablesWithoutOrders.length > 0 && (
          <div>
            <h2 className="text-vermelho-principal font-bold font-roboto text-xl mb-4">
              MESAS LIVRES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tablesWithoutOrders.map((order) => (
                <TableCard
                  key={order.mesa.id}
                  tableNumber={order.mesa.numero}
                  status="LIVRE"
                  onClick={() => handleTableClick(null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {orders.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-vermelho-principal font-bold font-roboto text-xl mb-2">
              Nenhuma mesa cadastrada
            </h3>
            <p className="text-gray-600 font-roboto mb-4">
              Cadastre mesas para começar a receber pedidos
            </p>
            {user?.role === "ADMIN" && (
              <button
                onClick={() => navigate("/tables/add")}
                className="bg-amarelo-principal text-vermelho-principal font-bold font-roboto px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                ADICIONAR MESA
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
