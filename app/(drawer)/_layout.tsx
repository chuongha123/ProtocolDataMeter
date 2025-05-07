import React from 'react';
import {Slot} from 'expo-router';
import 'react-native-reanimated';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawerContent} from '@/components/CustomDrawerContent';

// Create drawer navigator
const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          width: '70%',
        },
      }}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{
          title: "Water Meter"
        }}
      >
        {() => <Slot />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
} 