import { authService } from "@/API/authService";
import { UserProfile } from "@/API/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Define the auth token key
const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

// Define types for our context
type AuthContextType = {
  authToken: string | null;
  user: any | null;
  login: (request: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  register: (request: any) => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  authToken: null,
  user: null,
  login: async () => { },
  logout: async () => { },
  isLoading: true,
  register: async () => { },
});

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load the auth token from storage on mount
  useEffect(() => {
    const loadAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const userData = await AsyncStorage.getItem(USER_DATA_KEY);

        if (token) {
          setAuthToken(token);
          setUser(userData ? JSON.parse(userData) : null);
        }
      } catch (error) {
        console.error("Failed to load auth token", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthToken();
  }, []);

  // Login function
  const login = useCallback(async (request: any) => {
    try {
      const response = await authService.login(request);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
      setAuthToken(response.token);

      const userProfile = await authService.getUserProfile();
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userProfile));
      setUser(userProfile);

      // Navigate to the main app last after state is updated
      router.replace("/");
    } catch (error) {
      console.error("Failed to save auth token", error);
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // First clear the storage and state
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      
      // Update state before navigation
      setUser(null);
      setAuthToken(null);
      
      // Navigate to login last
      router.replace("/login");
    } catch (error) {
      console.error("Failed to remove auth token", error);
      throw error;
    }
  }, []);

  const register = useCallback(async (request: any) => {
    try {
      await authService.register(request);
    } catch (error) {
      console.error("Failed to register", error);
      throw error;
    }
  }, []);


  const value = useMemo(
    () => ({ authToken, user, login, logout, isLoading, register }),
    [authToken, user, login, logout, isLoading, register]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
