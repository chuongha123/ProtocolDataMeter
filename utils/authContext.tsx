import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Define the auth token key
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Define types for our context
type AuthContextType = {
  authToken: string | null;
  user: any | null;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  authToken: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
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
        console.error('Failed to load auth token', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthToken();
  }, []);

  // Login function
  const login = async (token: string, userData: any) => {
    try {
      // Save the token to storage
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      
      // Update state
      setAuthToken(token);
      setUser(userData);
      
      // Navigate to the main app (home page)
      router.replace('/');
    } catch (error) {
      console.error('Failed to save auth token', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Remove the token from storage
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      
      // Update state
      setAuthToken(null);
      setUser(null);
      
      // Navigate to login
      router.replace('/login');
    } catch (error) {
      console.error('Failed to remove auth token', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
} 