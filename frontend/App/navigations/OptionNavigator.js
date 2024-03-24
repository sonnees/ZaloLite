import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import QRScreen from '../screens/QRScreen';

const Stack = createStackNavigator();
function OpionNavigator() {
  return (
      <Stack.Navigator>

        <Stack.Screen name='QRScreen' component={QRScreen} options={{ headerShown: false }}></Stack.Screen>
<<<<<<< HEAD
=======
        {/* <Stack.Screen name='ConfirmQRScreen' component={ConfirmQRScreen} options={{ headerShown: false }}></Stack.Screen> */}

        {/* <Stack.Screen name='SlashScreen' component={SlashScreen} options={{ headerShown: false }}></Stack.Screen> */}
>>>>>>> 99bcf1df1857a65e6541d2d2fbc30aecf048e5a8
        
      </Stack.Navigator>
  );
}
export default OpionNavigator;