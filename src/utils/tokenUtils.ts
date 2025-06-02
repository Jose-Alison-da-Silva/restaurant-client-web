import type { User } from "../contexts/AuthContext";

export const decodeToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Erro ao verificar expiração do token:", error);
    return true;
  }
};
