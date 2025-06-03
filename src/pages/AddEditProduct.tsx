import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import { useAuth } from "../contexts/AuthContext";

interface Category {
  id: number;
  nome: string;
}

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

interface ProductFormData {
  nome: string;
  preco: string;
  descricao: string;
  categoriaId: number;
}

export default function AddEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, api } = useAuth();
  const queryClient = useQueryClient();

  const isEditing = Boolean(id);
  const productId = id ? parseInt(id) : null;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  const [formData, setFormData] = useState<ProductFormData>({
    nome: "",
    preco: "",
    descricao: "",
    categoriaId: 0,
  });

  // Buscar categorias
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await api.get("/categorias");
      return response.data;
    },
  });

  // Buscar produto para edição
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<Product> => {
      const response = await api.get(`/produtos/${productId}`);
      return response.data;
    },
    enabled: isEditing && productId !== null,
  });

  // Preencher formulário quando produto for carregado (modo edição)
  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        nome: product.nome,
        preco: product.preco.toString().replace(".", ","),
        descricao: product.descricao,
        categoriaId: product.categoria.id,
      });

      if (product.imagem) {
        setCurrentImageUrl(product.imagem);
        const imageUrl = product.imagem.startsWith("http")
          ? product.imagem
          : `${api.defaults.baseURL}${product.imagem}`;
        setImagePreview(imageUrl);
      }
    }
  }, [product, isEditing, api.defaults.baseURL]);

  // Mutação para criar produto
  const createProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post("/produtos", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
    onError: (error) => {
      console.error("Erro ao criar produto:", error);
      alert("Erro ao criar produto. Verifique os dados e tente novamente.");
    },
  });

  // Mutação para editar produto
  const updateProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.patch(`/produtos/${productId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      navigate("/products");
    },
    onError: (error) => {
      console.error("Erro ao editar produto:", error);
      alert("Erro ao editar produto. Verifique os dados e tente novamente.");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "preco") {
      // Remove caracteres não numéricos exceto ponto e vírgula
      const numericValue = value.replace(/[^0-9.,]/g, "");

      // Se o usuário digitar algo e o primeiro caractere for 0 seguido de outro número
      // remove o 0 inicial (exceto se for "0." ou "0,")
      let cleanValue = numericValue;
      if (
        numericValue.length > 1 &&
        numericValue.startsWith("0") &&
        !numericValue.startsWith("0.") &&
        !numericValue.startsWith("0,")
      ) {
        cleanValue = numericValue.substring(1);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: cleanValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "categoriaId" ? Number(value) : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Apenas arquivos de imagem são permitidos (JPG, PNG, GIF, WEBP)");
        return;
      }

      // Validar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (isEditing) {
      setCurrentImageUrl("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.preco || !formData.categoriaId) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validar se o preço é um número válido
    const precoNumber = parseFloat(formData.preco.replace(",", "."));
    if (isNaN(precoNumber) || precoNumber <= 0) {
      alert("Por favor, insira um preço válido maior que zero.");
      return;
    }

    // Criar FormData para enviar com a imagem
    const formDataToSend = new FormData();
    formDataToSend.append("nome", formData.nome);
    formDataToSend.append("descricao", formData.descricao);
    formDataToSend.append("preco", precoNumber.toString());
    formDataToSend.append("categoriaId", formData.categoriaId.toString());

    if (imageFile) {
      formDataToSend.append("file", imageFile);
    }

    if (isEditing) {
      updateProductMutation.mutate(formDataToSend);
    } else {
      createProductMutation.mutate(formDataToSend);
    }
  };

  const handleNavigationClick = (route: string) => {
    navigate(route);
  };

  const isLoading = categoriesLoading || (isEditing && productLoading);
  const isMutating =
    createProductMutation.isPending || updateProductMutation.isPending;

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
            {isEditing ? "EDITAR PRODUTO" : "ADICIONAR PRODUTO"}
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
                    type="text"
                    name="preco"
                    value={formData.preco}
                    onChange={handleInputChange}
                    placeholder="0,00"
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
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-12 h-12 text-vermelho-principal mb-2" />
                          <span className="text-vermelho-principal font-roboto text-center">
                            Clique para selecionar
                            <br />
                            <small className="text-gray-500">
                              JPG, PNG, GIF, WEBP (máx. 5MB)
                            </small>
                          </span>
                        </div>
                      )}
                    </label>
                    {imageFile && (
                      <p className="text-sm text-gray-600 mt-2">
                        {isEditing ? "Nova imagem: " : "Arquivo selecionado: "}
                        {imageFile.name}
                      </p>
                    )}
                    {isEditing && currentImageUrl && !imageFile && (
                      <p className="text-sm text-gray-600 mt-2">
                        Imagem atual mantida
                      </p>
                    )}
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
                disabled={isMutating}
                className="bg-amarelo-principal text-vermelho-principal font-bold font-roboto text-lg px-12 py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMutating
                  ? isEditing
                    ? "ATUALIZANDO..."
                    : "SALVANDO..."
                  : isEditing
                  ? "ATUALIZAR"
                  : "SALVAR"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
