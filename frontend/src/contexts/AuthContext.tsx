// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  getMe,
  type AuthUser,
  type RegisterInput,
} from '../api/auth';

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (p: RegisterInput) => Promise<void>;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);
const TOKEN_KEY = 'shelfshare.token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    const { access_token, user } = await apiLogin(email, password);
    localStorage.setItem(TOKEN_KEY, access_token);
    setUser(user);
  };

  const signUp = async (p: RegisterInput) => {
    const { access_token, user } = await apiRegister(p);
    localStorage.setItem(TOKEN_KEY, access_token);
    setUser(user);
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);