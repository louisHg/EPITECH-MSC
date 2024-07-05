"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { authService } from "@/services/auth.service";
import { LoginCredentials, UserInfos } from "@/types/auth-types";
import { useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: UserInfos | null;
}

interface AuthContextProps {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storedRefreshToken = localStorage.getItem("refreshToken");
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: !!storedRefreshToken,
    accessToken: null,
    refreshToken: null,
    user: null,
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);

      if (response) {
        console.log(response);
        setAuthState((prevAuthState) => ({
          ...prevAuthState,
          isAuthenticated: true,
          accessToken: response.tokens.access,
          refreshToken: response.tokens.refresh,
          user: response.user,
        }));
        console.log(authState);
      }

      // Maintenant, authState a été mis à jour, vous pouvez le consulter ici
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setAuthState((prevAuthState) => ({
      ...prevAuthState,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
    }));
  };

  const refreshAccessToken = async () => {
    if (authState.refreshToken) {
      try {
        const response = await authService.refreshToken();

        localStorage.setItem("accessToken", response.tokens.access);
        localStorage.setItem("refreshToken", response.tokens.refresh);
        // Mettez à jour seulement le refreshToken dans l'état
        setAuthState((prevAuthState) => ({
          ...prevAuthState,
          isAuthenticated: true,
          accessToken: response.tokens.access,
          refreshToken: response.tokens.refresh,
          user: response.user,
        }));
      } catch (error) {
        // En cas d'échec du rafraîchissement, effectuez la déconnexion
        logout();
      }
    }
  };

  useEffect(() => {
    // Nettoyez le local storage si l'utilisateur se déconnecte
    if (!authState.isAuthenticated) {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
    }
  }, [authState]);

  return (
    <AuthContext.Provider
      value={{ authState, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
