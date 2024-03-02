import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import OptionScreen from '../screens/OptionScreen';
const Stack = createStackNavigator();
function OpionNavigator() {
  return (
      <Stack.Navigator>
        <Stack.Screen name='OptionScreen' component={OptionScreen} options={{ headerShown: false }}></Stack.Screen>
      </Stack.Navigator>
  );
}
export default OpionNavigator;