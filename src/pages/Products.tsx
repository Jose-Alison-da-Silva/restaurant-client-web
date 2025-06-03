import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../components/Header/Header";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import ProductCard from "../components/ProductCard/ProductCard";
import ActionButton from "../components/ActionButton/ActionButton";
import { useAuth } from "../contexts/AuthContext";

interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  imagem?: string;
  ativo: boolean;
  categoria: {
    id: number;
    nome: string;
  };
}

export default function Products() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const queryClient = useQueryClient();

  // Buscar produtos
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const response = await api.get("/produtos");
      return response.data;
    },
  });

  // Mutação para alterar status do produto
  const toggleProductStatusMutation = useMutation({
    mutationFn: async ({ id }: { id: number; ativo?: boolean }) => {
      // await api.patch(`/produtos/${id}`, { ativo });
      await api.delete(`/produtos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleNavigationClick = (route: string) => {
    navigate(route);
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleToggleProductStatus = (productId: number, newStatus: boolean) => {
    toggleProductStatusMutation.mutate({ id: productId, ativo: newStatus });
  };

  const handleAddProduct = () => {
    navigate("/products/add");
  };

  const handleAddTable = () => {
    navigate("/tables/add");
  };

  const handleAddCategory = () => {
    navigate("/categories/add");
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

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-vermelho-principal font-bold font-roboto text-2xl">
            PRODUTOS CADASTRADOS
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <ActionButton title="ADICIONAR MESA" onClick={handleAddTable} />
            <ActionButton
              title="ADICIONAR CATEGORIA"
              onClick={handleAddCategory}
            />
            <ActionButton
              title="ADICIONAR PRODUTO"
              onClick={handleAddProduct}
            />
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg p-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.nome}
                price={product.preco}
                category={product.categoria.nome}
                description={product.descricao}
                imageUrl={product.imagem}
                isActive={product.ativo}
                onEdit={handleEditProduct}
                onToggleStatus={handleToggleProductStatus}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 font-roboto text-lg mb-4">
                Nenhum produto cadastrado
              </p>
              <ActionButton
                title="ADICIONAR PRIMEIRO PRODUTO"
                onClick={handleAddProduct}
                className="mx-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
