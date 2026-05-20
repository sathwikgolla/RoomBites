import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiError } from "../api/axios";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

const normalizeUser = (user) =>
  user
    ? {
        ...user,
        id: user._id || user.id,
        name: user.fullName || user.name,
        walletBalance: Number(user.walletBalance || 0),
      }
    : null;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(() => normalizeUser(JSON.parse(localStorage.getItem("currentUser") || "null")));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  const saveSession = useCallback((nextToken, user) => {
    const normalized = normalizeUser(user);
    if (!nextToken || !normalized) return null;
    localStorage.setItem("token", nextToken);
    localStorage.setItem("currentUser", JSON.stringify(normalized));
    setToken(nextToken);
    setCurrentUser(normalized);
    return normalized;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setToken(null);
    setCurrentUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return null;
    }
    try {
      const data = await authApi.me();
      return saveSession(localStorage.getItem("token"), data.user);
    } catch {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout, saveSession]);

  useEffect(() => {
    refreshUser();
    const onUnauthorized = () => logout();
    window.addEventListener("roombites:unauthorized", onUnauthorized);
    return () => window.removeEventListener("roombites:unauthorized", onUnauthorized);
  }, [logout, refreshUser]);

  const login = useCallback(
    async (role, email, password) => {
      try {
        const data = await authApi.login({ role, email, password });
        if (!data.token || !data.user) return { ok: false, message: "Login response did not include a token" };
        const user = saveSession(data.token, data.user);
        return { ok: true, user };
      } catch (error) {
        return { ok: false, message: apiError(error), field: error?.response?.data?.field };
      }
    },
    [saveSession]
  );

  const register = useCallback(
    async (payload) => {
      if (payload.password !== payload.confirmPassword) return { ok: false, message: "Passwords do not match" };
      try {
        const { name, confirmPassword, ...rest } = payload;
        const data = await authApi.register({ ...rest, fullName: payload.fullName || name });
        if (!data.token || !data.user) return { ok: true, requiresLogin: true, data, message: data.message || "Registration successful. Please login." };
        const user = saveSession(data.token, data.user);
        return { ok: true, user };
      } catch (error) {
        return { ok: false, message: apiError(error) };
      }
    },
    [saveSession]
  );

  const updateProfile = useCallback(
    async (payload) => {
      try {
        const data = await authApi.updateProfile({ ...payload, fullName: payload.fullName || payload.name });
        const user = saveSession(localStorage.getItem("token"), data.user);
        return { ok: true, user };
      } catch (error) {
        return { ok: false, message: apiError(error) };
      }
    },
    [saveSession]
  );

  const cancelAccount = useCallback(async () => {
    try {
      await authApi.cancelAccount();
      logout();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: apiError(error) };
    }
  }, [logout]);

  const value = useMemo(
    () => ({
      currentUser,
      token,
      isAuthenticated: Boolean(token && currentUser),
      loading,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
      cancelAccount,
    }),
    [cancelAccount, currentUser, loading, login, logout, refreshUser, register, token, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
