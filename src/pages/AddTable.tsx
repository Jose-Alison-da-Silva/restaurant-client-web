import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../components/Header/Header";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import { useAuth } from "../contexts/AuthContext";

interface TableFormData {
  numero: number;
  capacidade?: number;
}

export default function AddTable() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<TableFormData>({
    numero: 0,
    capacidade: 4,
  });

  // Mutação para criar mesa
  const createTableMutation = useMutation({
    mutationFn: async (data: TableFormData) => {
      const response = await api.post("/mesas", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/products");
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

    if (formData.capacidade && formData.capacidade <= 0) {
      alert("Por favor, informe uma capacidade válida.");
      return;
    }

    createTableMutation.mutate(formData);
  };

  const handleNavigationClick = (route: string) => {
    navigate(route);
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

        {/* Form Section */}
        <div className="bg-white rounded-lg p-8">
          <h1 className="text-vermelho-principal font-bold font-roboto text-2xl mb-8 pb-4 border-b-2 border-gray-200">
            ADICIONAR MESA
          </h1>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
            {/* Número da Mesa */}
            <div>
              <label className="block text-vermelho-principal font-bold font-roboto text-lg mb-3">
                NÚMERO DA MESA
              </label>
              <input
                type="number"
                name="numero"
                value={formData.numero}
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

            {/* Capacidade da Mesa */}
            <div>
              <label className="block text-vermelho-principal font-bold font-roboto text-lg mb-3">
                CAPACIDADE DA MESA (OPCIONAL)
              </label>
              <input
                type="number"
                name="capacidade"
                value={formData.capacidade}
                onChange={handleInputChange}
                min="1"
                max="20"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 font-roboto focus:outline-none focus:border-vermelho-principal"
                placeholder="Ex: 2, 4, 6..."
              />
              <p className="text-gray-600 text-sm mt-2 font-roboto">
                Número máximo de pessoas que a mesa comporta
              </p>
            </div>

            {/* Informações Adicionais */}
            <div className="bg-amarelo-principal p-6 rounded-lg">
              <h3 className="text-vermelho-principal font-bold font-roboto text-lg mb-3">
                INFORMAÇÕES IMPORTANTES
              </h3>
              <ul className="text-vermelho-principal font-roboto space-y-2">
                <li>• A mesa será criada com status "LIVRE" automaticamente</li>
                <li>• Um QR Code único será gerado para esta mesa</li>
                <li>• O número da mesa deve ser único no sistema</li>
                <li>
                  • A capacidade é opcional e serve apenas para controle interno
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
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
      </div>
    </div>
  );
}
