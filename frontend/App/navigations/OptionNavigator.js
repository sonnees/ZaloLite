import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import QRScreen from '../screens/QRScreen';
import CreactGroupScreen from '../screens/CreactGroupScreen';
import ChatGroupScreen from '../screens/ChatGroupScreen';
import OptionGroupScreen from '../screens/OptionGroupScreen';
import OptionScreen from '../screens/OptionScreen';
const Stack = createStackNavigator();
function OpionNavigator() {
  return (
    <Stack.Navigator>

      <Stack.Screen name='QRScreen' component={QRScreen} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='OptionScreen' component={OptionScreen} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='OptionGroupScreen' component={OptionGroupScreen} options={{ headerShown: false }}></Stack.Screen>

    </Stack.Navigator>
  );
}
export default OpionNavigator;