import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import { useAuth } from "../contexts/AuthContext";
import { X } from "lucide-react";

interface TableFormData {
  numero: number;
}

interface Table {
  id: string;
  numero: number;
  status: "LIVRE" | "BLOQUEADA";
  createdAt: string;
}

export default function AddTable() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<TableFormData>({
    numero: 0,
  });

  // Query para buscar mesas
  const { data: tables = [], isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const response = await api.get("/mesas");
      return response.data;
    },
  });

  // Mutação para criar mesa
  const createTableMutation = useMutation({
    mutationFn: async (data: TableFormData) => {
      const response = await api.post("/mesas", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setFormData({ numero: 0 });
    },
  });

  // Mutação para deletar mesa
  const deleteTableMutation = useMutation({
    mutationFn: async (tableId: string) => {
      await api.delete(`/mesas/${tableId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.numero || formData.numero <= 0) {
      alert("Por favor, informe um número de mesa válido.");
      return;
    }

    // Verifica se já existe uma mesa com esse número
    const existingTable = tables.find(
      (table: Table) => table.numero === formData.numero
    );
    if (existingTable) {
      alert(
        `Já existe uma mesa com o número ${formData.numero}. Por favor, escolha outro número.`
      );
      return;
    }

    createTableMutation.mutate(formData);
  };

  const handleDelete = (
    tableId: string,
    tableNumber: number,
    tableStatus: string
  ) => {
    if (tableStatus === "BLOQUEADA") {
      alert(
        `Não é possível excluir a Mesa ${tableNumber} pois ela está ${tableStatus.toLowerCase()}.`
      );
      return;
    }

    if (
      window.confirm(`Tem certeza que deseja excluir a Mesa ${tableNumber}?`)
    ) {
      deleteTableMutation.mutate(tableId);
    }
  };

  const handleNavigationClick = (route: string) => {
    navigate(route);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVRE":
        return "bg-green-100 text-green-800 border-green-200";
      case "BLOQUEADA":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "LIVRE":
        return "Livre";
      case "BLOQUEADA":
        return "Bloqueada";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header showBackButton />

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          <NavigationButton
            title="PEDIDOS"
            onClick={() => handleNavigationClick("/dashboard")}
            variant="secondary"
          />

          {user?.role === "ADMIN" && (
            <NavigationButton
              title="PRODUTOS"
              onClick={() => handleNavigationClick("/products")}
              variant="primary"
            />
          )}

          <NavigationButton
            title="HISTÓRICO"
            onClick={() => handleNavigationClick("/history")}
            variant="secondary"
          />
        </div>

        {/* Main Content - Layout em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section - Lado Esquerdo */}
          <div className="bg-white rounded-lg p-8">
            <h1 className="text-vermelho-principal font-bold font-roboto text-2xl mb-8 pb-4 border-b-2 border-gray-200">
              ADICIONAR MESA
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Número da Mesa */}
              <div>
                <label className="block text-vermelho-principal font-bold font-roboto text-lg mb-3">
                  NÚMERO DA MESA
                </label>
                <input
                  type="number"
                  name="numero"
                  value={formData.numero || ""}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 font-roboto focus:outline-none focus:border-vermelho-principal"
                  placeholder="Ex: 1, 2, 3..."
                  required
                />
                <p className="text-gray-600 text-sm mt-2 font-roboto">
                  Informe o número identificador da mesa
                </p>
              </div>

              {/* Informações Adicionais */}
              <div className="bg-amarelo-principal p-6 rounded-lg">
                <h3 className="text-vermelho-principal font-bold font-roboto text-lg mb-3">
                  INFORMAÇÕES IMPORTANTES
                </h3>
                <ul className="text-vermelho-principal font-roboto space-y-2">
                  <li>
                    • A mesa será criada com status "LIVRE" automaticamente
                  </li>
                  <li>
                    • Um QR Code único deve ser gerado para esta mesa contendo a
                    palavra Mesa e o número. Ex: Mesa 1
                  </li>
                  <li>• O número da mesa deve ser único no sistema</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={createTableMutation.isPending}
                  className="bg-amarelo-principal text-vermelho-principal font-bold font-roboto text-lg px-12 py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createTableMutation.isPending ? "CRIANDO..." : "CRIAR MESA"}
                </button>
              </div>
            </form>
          </div>

          {/* Tables List - Lado Direito */}
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-vermelho-principal font-bold font-roboto text-2xl mb-8 pb-4 border-b-2 border-gray-200">
              MESAS CADASTRADAS
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-vermelho-principal font-roboto">
                  Carregando mesas...
                </div>
              </div>
            ) : tables.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 font-roboto text-lg mb-4">
                  Nenhuma mesa cadastrada
                </div>
                <div className="text-gray-400 font-roboto text-sm">
                  Adicione sua primeira mesa usando o formulário ao lado
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {tables
                  .sort((a: Table, b: Table) => a.numero - b.numero)
                  .map((table: Table) => (
                    <div
                      key={table.id}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-vermelho-principal transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-vermelho-principal font-bold font-roboto text-lg">
                            Mesa {table.numero}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                              table.status
                            )}`}
                          >
                            {getStatusText(table.status)}
                          </span>
                        </div>
                        <p className="text-gray-500 font-roboto text-sm">
                          Criada em:{" "}
                          {new Date(table.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleDelete(table.id, table.numero, table.status)
                        }
                        disabled={
                          deleteTableMutation.isPending ||
                          table.status === "BLOQUEADA"
                        }
                        className={`ml-4 font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          table.status === "BLOQUEADA"
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        } disabled:opacity-50`}
                        title={
                          table.status === "BLOQUEADA"
                            ? `Não é possível excluir: mesa está ${table.status.toLowerCase()}`
                            : `Excluir Mesa ${table.numero}`
                        }
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Informações da Tabela */}
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400 mt-6">
              <h3 className="text-blue-800 font-bold font-roboto text-lg mb-3">
                DICAS IMPORTANTES
              </h3>
              <ul className="text-blue-700 font-roboto space-y-2 text-sm">
                <li>
                  • Mesas são ordenadas por número para facilitar visualização
                </li>
                <li>
                  • Status das mesas é atualizado automaticamente com os pedidos
                </li>
                <li>
                  • ⚠️ Mesas ocupadas ou bloqueadas não podem ser excluídas
                </li>
                <li>
                  • QR Codes não são gerados automaticamente para cada mesa
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
