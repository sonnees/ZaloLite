import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from '../screens/ProfileScreen';
import TransferAccountScreen from '../screens/TransferAccountScreen';
import InformationScreen from '../screens/InformationScreen';
import InformationDetailScreen from '../screens/InformationDetailScreen';
import SwitchAccountScreen from '../screens/SwitchAccountScreen';
import SettingScreen from '../screens/SettingScreen';
import QRScreen from '../screens/QRScreen';
import ConfirmQRScreen from '../screens/ConfrimQRScreen';
const Stack = createStackNavigator();
function MeNavigator() {
  return (
      <Stack.Navigator>
        <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='TransferAccountScreen' component={TransferAccountScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='InformationScreen' component={InformationScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='InformationDetailScreen' component={InformationDetailScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='SwitchAccountScreen' component={SwitchAccountScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='SettingScreen' component={SettingScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='QRScreen' component={QRScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='ConfirmQRScreen' component={ConfirmQRScreen} options={{ headerShown: false }}></Stack.Screen>
      </Stack.Navigator>
  );
}
export default MeNavigator;