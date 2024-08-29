import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack for Home tab including Product screens
const HomeStackNavigator = () => (
  <Stack.Navigator screenOptions={{
    headerShown: false,

   
  }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />

  </Stack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator screenOptions={{
    headerShown: false,

   
  }}>
    <Tab.Screen name="Home" component={HomeStackNavigator} />

  </Tab.Navigator>
);

export default MainNavigator;
