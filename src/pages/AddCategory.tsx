import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import { useAuth } from "../contexts/AuthContext";
import { X } from "lucide-react";

interface CategoryFormData {
  nome: string;
}

interface Category {
  id: string;
  nome: string;
  createdAt: string;
}

export default function AddCategory() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CategoryFormData>({
    nome: "",
  });

  // Query para buscar categorias
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categorias");
      return response.data;
    },
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
      setFormData({ nome: "" });
    },
  });

  // Mutação para deletar categoria
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      await api.delete(`/categorias/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
    });
  };

  const handleDelete = (categoryId: string, categoryName: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir a categoria "${categoryName}"?`
      )
    ) {
      deleteCategoryMutation.mutate(categoryId);
    }
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

        {/* Main Content - Layout em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section - Lado Esquerdo */}
          <div className="bg-white rounded-lg p-8">
            <h1 className="text-vermelho-principal font-bold font-roboto text-2xl mb-8 pb-4 border-b-2 border-gray-200">
              ADICIONAR CATEGORIA
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
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

              {/* Exemplos de Categorias */}
              <div className="bg-amarelo-principal p-6 rounded-lg">
                <h3 className="text-vermelho-principal font-bold font-roboto text-lg mb-3">
                  EXEMPLOS DE CATEGORIAS
                </h3>
                <div className="grid grid-cols-1 gap-4 text-vermelho-principal font-roboto">
                  <div>
                    <h4 className="font-bold mb-2">Comidas:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Hambúrgueres</li>
                      <li>• Pizzas</li>
                      <li>• Sanduíches</li>
                      <li>• Pratos Principais</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Bebidas:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Refrigerantes</li>
                      <li>• Sucos</li>
                      <li>• Cafés</li>
                      <li>• Cervejas</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
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

          {/* Categories Table - Lado Direito */}
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-vermelho-principal font-bold font-roboto text-2xl mb-8 pb-4 border-b-2 border-gray-200">
              CATEGORIAS CADASTRADAS
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-vermelho-principal font-roboto">
                  Carregando categorias...
                </div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 font-roboto text-lg mb-4">
                  Nenhuma categoria cadastrada
                </div>
                <div className="text-gray-400 font-roboto text-sm">
                  Adicione sua primeira categoria usando o formulário ao lado
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {categories.map((category: Category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-vermelho-principal transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-vermelho-principal font-bold font-roboto text-lg">
                        {category.nome}
                      </h3>
                      <p className="text-gray-500 font-roboto text-sm">
                        Criada em:{" "}
                        {new Date(category.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(category.id, category.nome)}
                      disabled={deleteCategoryMutation.isPending}
                      className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={`Excluir categoria ${category.nome}`}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Informações Adicionais */}
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400 mt-6">
              <h3 className="text-blue-800 font-bold font-roboto text-lg mb-3">
                DICAS IMPORTANTES
              </h3>
              <ul className="text-blue-700 font-roboto space-y-2 text-sm">
                <li>• Use nomes claros e descritivos para as categorias</li>
                <li>
                  • Categorias ajudam a organizar o cardápio para os clientes
                </li>
                <li>• Produtos precisam estar associados a uma categoria</li>
                <li>
                  • ⚠️ Cuidado ao excluir: produtos vinculados podem ser
                  afetados
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
