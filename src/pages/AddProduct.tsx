import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import Header from "../components/Header/Header";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import { useAuth } from "../contexts/AuthContext";

interface Category {
  id: number;
  nome: string;
}

interface ProductFormData {
  nome: string;
  preco: number;
  descricao: string;
  categoriaId: number;
  imagem?: string;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProductFormData>({
    nome: "",
    preco: 0,
    descricao: "",
    categoriaId: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Buscar categorias
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await api.get("/categorias");
      return response.data;
    },
  });

  // Mutação para criar produto
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await api.post("/produtos", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "preco" || name === "categoriaId" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.preco || !formData.categoriaId) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    createProductMutation.mutate(formData);
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
            ADICIONAR PRODUTOS
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Nome do Produto */}
                <div>
                  <label className="block text-vermelho-principal font-bold font-roboto text-lg mb-3">
                    NOME DO PRODUTO
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 font-roboto focus:outline-none focus:border-vermelho-principal"
                    required
                  />
                </div>

                {/* Descrição do Produto */}
                <div>
                  <label className="block text-vermelho-principal font-bold font-roboto text-lg mb-3">
                    DESCRIÇÃO DO PRODUTO
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 font-roboto resize-none focus:outline-none focus:border-vermelho-principal"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Valor do Produto */}
                <div>
                  <label className="block text-vermelho-principal font-bold font-roboto text-lg mb-3">
                    VALOR DO PRODUTO
                  </label>
                  <input
                    type="number"
                    name="preco"
                    value={formData.preco}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 font-roboto focus:outline-none focus:border-vermelho-principal"
                    required
                  />
                </div>

                {/* Imagem do Produto */}
                <div>
                  <label className="block text-vermelho-principal font-bold font-roboto text-lg mb-3">
                    IMAGEM DO PRODUTO
                  </label>
                  <div className="flex flex-col items-center">
                    <label className="cursor-pointer bg-gray-100 border-2 border-gray-300 rounded-lg p-8 hover:bg-gray-200 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-12 h-12 text-vermelho-principal mb-2" />
                          <span className="text-vermelho-principal font-roboto">
                            Clique para selecionar
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-vermelho-principal font-bold font-roboto text-lg mb-3">
                    CATEGORIA
                  </label>
                  <select
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-amarelo-principal text-vermelho-principal font-bold font-roboto focus:outline-none focus:border-vermelho-principal"
                    required
                  >
                    <option value={0}>ESCOLHER CATEGORIA</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={createProductMutation.isPending || categoriesLoading}
                className="bg-amarelo-principal text-vermelho-principal font-bold font-roboto text-lg px-12 py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createProductMutation.isPending ? "SALVANDO..." : "SALVAR"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
