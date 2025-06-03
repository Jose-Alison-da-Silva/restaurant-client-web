import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import HistoryTableRow from '../components/HistoryTableRow/HistoryTableRow';
import NavigationButton from '../components/NavigationButton/NavigationButton';
import { useAuth } from '../contexts/AuthContext';

interface HistoryOrder {
  id: number;
  valorTotal: number;
  createdAt: string;
  mesa: {
    numero: number;
  };
}

export default function History() {
  const navigate = useNavigate();
  const { user, api } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: async (): Promise<HistoryOrder[]> => {
      const response = await api.get('/pedidos');
      return response.data;
    },
  });

  const handleNavigationClick = (route: string) => {
    navigate(route);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { date: formattedDate, time: formattedTime };
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
            onClick={() => handleNavigationClick('/dashboard')}
            variant="secondary"
          />

          {user?.role === 'ADMIN' && (
            <NavigationButton
              title="PRODUTOS"
              onClick={() => handleNavigationClick('/products')}
              variant="secondary"
            />
          )}

          <NavigationButton
            title="HISTÓRICO"
            onClick={() => handleNavigationClick('/history')}
            variant="primary"
          />
        </div>

        {/* History Table */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead>
                  <tr className="bg-vermelho-principal text-amarelo-principal font-bold font-roboto text-center">
                    <th className="py-4 px-6 text-lg">Nº PEDIDO</th>
                    <th className="py-4 px-6 text-lg">VALOR TOTAL</th>
                    <th className="py-4 px-6 text-lg">Nº MESA</th>
                    <th className="py-4 px-6 text-lg">DATA</th>
                    <th className="py-4 px-6 text-lg">HORA</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {orders.map((order, index) => {
                    const { date, time } = formatDateTime(order.createdAt);
                    return (
                      <HistoryTableRow
                        key={order.id}
                        orderNumber={order.id}
                        totalValue={order.valorTotal}
                        tableNumber={order.mesa.numero}
                        date={date}
                        time={time}
                        isEven={index % 2 === 1}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-vermelho-principal font-bold font-roboto text-xl mb-2">
                Nenhum pedido no histórico
              </h3>
              <p className="text-gray-600 font-roboto">
                Os pedidos finalizados aparecerão aqui para consulta
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
