"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authService } from "@/services/auth.service";
import type { IAuthUser, UserRole } from "@/types/auth.types";

interface AuthContextValue {
  user: IAuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  refreshUser: () => Promise<void>;
  clearUser: () => void;

  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();

      if (response?.success && response?.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);

      if (process.env.NODE_ENV === "development") {
        console.debug("No authenticated user found.");
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        const response = await authService.getCurrentUser();

        if (cancelled) {
          return;
        }

        if (response?.success && response?.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch {
        if (cancelled) {
          return;
        }
        setUser(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) {
        return false;
      }

      return roles.includes(user.role);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      refreshUser,
      clearUser,
      hasRole,
    }),
    [user, isLoading, refreshUser, clearUser, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
