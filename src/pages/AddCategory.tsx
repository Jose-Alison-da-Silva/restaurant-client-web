import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../components/Header/Header";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import { useAuth } from "../contexts/AuthContext";

interface CategoryFormData {
  nome: string;
  descricao?: string;
}

export default function AddCategory() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CategoryFormData>({
    nome: "",
    descricao: "",
  });

  // Mutação para criar categoria
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const response = await api.post("/categorias", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert("Por favor, informe o nome da categoria.");
      return;
    }

    createCategoryMutation.mutate({
      ...formData,
      nome: formData.nome.trim(),
      descricao: formData.descricao?.trim() || undefined,
    });
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
            ADICIONAR CATEGORIA
          </h1>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
            {/* Nome da Categoria */}
            <div>
              <label className="block text-vermelho-principal font-bold font-roboto text-lg mb-3">
                NOME DA CATEGORIA
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 font-roboto focus:outline-none focus:border-vermelho-principal"
                placeholder="Ex: Hambúrgueres, Bebidas, Sobremesas..."
                required
              />
              <p className="text-gray-600 text-sm mt-2 font-roboto">
                Nome que será exibido no cardápio e sistema
              </p>
            </div>

            {/* Descrição da Categoria */}
            <div>
              <label className="block text-vermelho-principal font-bold font-roboto text-lg mb-3">
                DESCRIÇÃO DA CATEGORIA (OPCIONAL)
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 font-roboto resize-none focus:outline-none focus:border-vermelho-principal"
                placeholder="Descreva brevemente esta categoria de produtos..."
              />
              <p className="text-gray-600 text-sm mt-2 font-roboto">
                Descrição adicional sobre a categoria (opcional)
              </p>
            </div>

            {/* Exemplos de Categorias */}
            <div className="bg-amarelo-principal p-6 rounded-lg">
              <h3 className="text-vermelho-principal font-bold font-roboto text-lg mb-3">
                EXEMPLOS DE CATEGORIAS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-vermelho-principal font-roboto">
                <div>
                  <h4 className="font-bold mb-2">Comidas:</h4>
                  <ul className="space-y-1">
                    <li>• Hambúrgueres</li>
                    <li>• Pizzas</li>
                    <li>• Sanduíches</li>
                    <li>• Pratos Principais</li>
                    <li>• Acompanhamentos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Bebidas:</h4>
                  <ul className="space-y-1">
                    <li>• Refrigerantes</li>
                    <li>• Sucos</li>
                    <li>• Cafés</li>
                    <li>• Cervejas</li>
                    <li>• Sobremesas</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <h3 className="text-blue-800 font-bold font-roboto text-lg mb-3">
                DICAS IMPORTANTES
              </h3>
              <ul className="text-blue-700 font-roboto space-y-2">
                <li>• Use nomes claros e descritivos para as categorias</li>
                <li>
                  • Categorias ajudam a organizar o cardápio para os clientes
                </li>
                <li>• Você pode editar ou excluir categorias posteriormente</li>
                <li>• Produtos precisam estar associados a uma categoria</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={createCategoryMutation.isPending}
                className="bg-amarelo-principal text-vermelho-principal font-bold font-roboto text-lg px-12 py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCategoryMutation.isPending
                  ? "CRIANDO..."
                  : "CRIAR CATEGORIA"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
