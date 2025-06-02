import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { decodeToken, isTokenExpired } from "../utils/tokenUtils";
import axios, { type AxiosInstance } from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = PropsWithChildren & {};

export interface User {
  userId: string;
  email: string;
  role: "ADMIN" | "FUNCIONARIO";
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  api: AxiosInstance;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        if (isTokenExpired(storedToken)) {
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        } else {
          const decodedUser = decodeToken(storedToken);
          if (decodedUser) {
            setUser(decodedUser);
            setToken(storedToken);
          } else {
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  const login = (newToken: string) => {
    const decodedUser = decodeToken(newToken);

    if (decodedUser && !isTokenExpired(newToken)) {
      setUser(decodedUser);
      setToken(newToken);
      localStorage.setItem("token", newToken);
    } else {
      throw new Error("Token inválido ou expirado");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
