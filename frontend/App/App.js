import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import TabNavigator from './navigations/TabNavigator';
import MeNavigator from './navigations/MeNavigator'
import ChatScreen from './screens/ChatScreen';
import OpionNavigator from './navigations/OptionNavigator';
// import LoginNavigator from './navigations/LoginNavigator'
// import MainNavigator from './navigations/MainNavigator'
import QRScannerScreen from './screens/Test';
const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
         <Stack.Screen name='QRScannerScreen' component={QRScannerScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='OpionNavigator' component={OpionNavigator} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='ChatScreen' component={ChatScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='MeNavigator' component={MeNavigator} options={{headerShown:false}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;