import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../utils/authContext';

export type DrawerParamList = {
  index: undefined;
  "(tabs)": undefined;
  "water-meter-detail": { meterId: number };
  "add-water-meter": undefined;
  "water-meter-edit": { meterId: number };
  "login": undefined;
  "register": undefined;
};

export type AppDrawerScreenProps = DrawerNavigationProp<DrawerParamList, '(tabs)'>;

// Create drawer navigator
const Drawer = createDrawerNavigator<DrawerParamList>();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { authToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Handle authentication routing
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(drawer)';
    
    // Check if user is authenticated
    if (!authToken) {
      // If not authenticated and trying to access protected routes
      if (inAuthGroup) {
        router.replace('/login');
      }
    } else {
      // If authenticated and trying to access login/register
      if (!inAuthGroup && (segments[0] === 'login' || segments[0] === 'register')) {
        router.replace('/');
      }
    }
  }, [authToken, segments, isLoading, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="index" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const $headerTitle: TextStyle = {
  textAlign: 'center',
  fontSize: 20,
  fontWeight: 'bold',
  minWidth: '100%',
  marginLeft: -20,
};

const $headerRight: ViewStyle = {
  marginRight: 10,
};
