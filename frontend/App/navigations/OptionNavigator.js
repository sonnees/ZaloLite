import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import RegisterACcountScreen from '../screens/RegisterAccountScreen';

import SlashScreen from '../screens/SlashScreen';
const Stack = createStackNavigator();
function OpionNavigator() {
  return (
      <Stack.Navigator>
        <Stack.Screen name='SlashScreen' component={SlashScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='RegisterACcountScreen' component={RegisterACcountScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false }}></Stack.Screen>
      </Stack.Navigator>
  );
}
export default OpionNavigator;