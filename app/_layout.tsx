import 'react-native-reanimated';

import {CustomDrawerContent} from '@/components/CustomDrawerContent';
import {HamburgerButton} from '@/components/HamburgerButton';
import {RouteNames} from '@/constants/RouteNames';
import {useColorScheme} from '@/hooks/useColorScheme';
import {createDrawerNavigator, DrawerNavigationProp} from '@react-navigation/drawer';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Slot} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useCallback, useEffect} from 'react';
import {Button, Text, TextStyle, View, ViewStyle} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AddWaterMeterScreen from './add-water-meter';
import WaterMeterDetailScreen from "@/app/water-meter-detail";

export type DrawerParamList = {
  "(tabs)": undefined;
  "water-meter-detail": { meterId: string };
  "add-water-meter": undefined
};

export type AppDrawerScreenProps = DrawerNavigationProp<DrawerParamList, '(tabs)'>;

// Create drawer navigator
const Drawer = createDrawerNavigator<DrawerParamList>();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().then();

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
    return <Slot/>;
  }

  return <RootLayoutNav/>;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const renderDrawerContent = useCallback((props: any) => (
    <CustomDrawerContent {...props} />
  ), []);

  const renderHeaderLeft = useCallback((navigation: DrawerNavigationProp<any>) => (
    <HamburgerButton onPress={() => navigation.toggleDrawer()}/>
  ), []);

  const renderHeaderRight = useCallback((navigation: DrawerNavigationProp<any>) => {
    // if current route is add-water-meter, don't show the button
    const currentRoute = navigation.getState().routes[navigation.getState().index];
    if (currentRoute?.name === RouteNames.addWaterMeter) {
      return null;
    }
    return (
      <View style={$headerRight}>
        <Button title="Add" onPress={() => navigation.navigate(RouteNames.addWaterMeter)}/>
      </View>
    );
  }, []);

  const renderHeaderTitle = useCallback(() => (
    <Text style={$headerTitle}>Water Meter</Text>
  ), []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"}/>
        <Drawer.Navigator
          initialRouteName="(tabs)"
          screenOptions={({navigation}) => ({
            headerLeft: () => renderHeaderLeft(navigation),
            headerRight: () => renderHeaderRight(navigation),
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
            component={Slot}
          >
          </Drawer.Screen>

          <Drawer.Screen
            name={"add-water-meter"}
            component={AddWaterMeterScreen}
          >
          </Drawer.Screen>

          <Drawer.Screen
            name={"water-meter-detail"}
            component={WaterMeterDetailScreen}>
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

const $headerRight: ViewStyle = {
  marginRight: 10,
};
