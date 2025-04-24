import 'react-native-reanimated';

import { CustomDrawerContent } from '@/components/CustomDrawerContent';
import { HamburgerButton } from '@/components/HamburgerButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useCallback } from 'react';
import { Text, TextStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AddWaterMeterScreen from './add-water-meter';

// Create drawer navigator
const Drawer = createDrawerNavigator();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <Slot />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const renderDrawerContent = useCallback((props: any) => (
    <CustomDrawerContent {...props} />
  ), []);

  const renderHeaderLeft = useCallback((navigation: DrawerNavigationProp<any>) => (
    <HamburgerButton onPress={() => navigation.toggleDrawer()} />
  ), []);

  const renderHeaderTitle = useCallback(() => (
    <Text style={$headerTitle}>Water Meter</Text>
  ), []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Drawer.Navigator
          initialRouteName="(tabs)"
          screenOptions={({ navigation }) => ({
            headerLeft: () => renderHeaderLeft(navigation),
            drawerStyle: {
              width: '70%',
            },
            headerShown: true,
            headerTitle: renderHeaderTitle,
          })}
          drawerContent={renderDrawerContent}
        >
          <Drawer.Screen
            name="(tabs)"
          >
            {() => <Slot />}
          </Drawer.Screen>

          <Drawer.Screen
            name="add-water-meter"
          >
            {() => <AddWaterMeterScreen />}
          </Drawer.Screen>
        </Drawer.Navigator>
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
