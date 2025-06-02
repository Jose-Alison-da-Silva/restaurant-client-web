import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import logo from "./assets/logo.png";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.access_token);
      console.log("Login realizado com sucesso", data);
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Erro no login:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      loginMutation.mutate({ email, password });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-vermelho-principal flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <img src={logo} alt="Logo" className="mx-auto w-48 h-48 mb-4" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-amarelo-principal text-sm font-medium mb-2 uppercase tracking-wide font-roboto"
            >
              USUÁRIO
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@gmail.com"
              className="w-full px-4 py-3 rounded-lg bg-amarelo-principal text-gray-800 placeholder-gray-600 border-0 focus:ring-2 focus:ring-black focus:outline-none text-sm"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-amarelo-principal text-sm font-medium mb-2 uppercase tracking-wide font-roboto"
            >
              SENHA
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-amarelo-principal text-gray-800 placeholder-gray-600 border-0 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-amarelo-principal hover:bg-yellow-600 text-vermelho-principal font-roboto font-bold py-3 px-6 rounded-lg transition duration-200 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        {/* Error Message */}
        {loginMutation.isError && (
          <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-400 rounded-lg">
            <p className="text-red-100 text-sm text-center">
              Erro ao fazer login. Verifique suas credenciais.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
