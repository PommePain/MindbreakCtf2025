import { jwtDecode } from "jwt-decode"; // Correction : import sans accolades
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  authUser: AuthUser | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const parseJwt = useCallback((token: string): AuthUser | null => {
    try {
      const decoded = jwtDecode<AuthUser>(token);
      return decoded;
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem("seedSpyToken");
    if (token) {
      const user = parseJwt(token);
      if (user && user.exp * 1000 > Date.now()) {
        setAuthUser({ ...user });
      } else {
        localStorage.removeItem("seedSpyToken");
      }
    }
    setIsLoading(false);
  }, [parseJwt]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(
    async (token: string) => {
      localStorage.setItem("seedSpyToken", token);
      const user = parseJwt(token);
      if (user && user.exp * 1000 > Date.now()) {
        setAuthUser({ ...user });
      } else {
        localStorage.removeItem("seedSpyToken");
      }
    },
    [parseJwt]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("seedSpyToken");
    setAuthUser(null);
    window.location.pathname = "/";
  }, []);

  return (
    <AuthContext.Provider value={{ 
      authUser, login, logout, isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
