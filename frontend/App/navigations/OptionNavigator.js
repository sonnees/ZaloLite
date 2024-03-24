import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import QRScreen from '../screens/QRScreen';

const Stack = createStackNavigator();
function OpionNavigator() {
  return (
      <Stack.Navigator>

        <Stack.Screen name='QRScreen' component={QRScreen} options={{ headerShown: false }}></Stack.Screen>
        {/* <Stack.Screen name='ConfirmQRScreen' component={ConfirmQRScreen} options={{ headerShown: false }}></Stack.Screen> */}

        {/* <Stack.Screen name='SlashScreen' component={SlashScreen} options={{ headerShown: false }}></Stack.Screen> */}
        
      </Stack.Navigator>
  );
}
export default OpionNavigator;