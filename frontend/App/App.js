import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import TabNavigator from './navigations/TabNavigator';
import MeNavigator from './navigations/MeNavigator'
import ChatScreen from './screens/ChatScreen';
import OpionNavigator from './navigations/OptionNavigator';
import Chatex from './screens/Chatex';
import LoginNavigator from './navigations/LoginNavigator'
// import MainNavigator from './navigations/MainNavigator'
import Mainex from './screens/Mainex';

const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name='LoginNavigator' component={LoginNavigator} options={{ headerShown: false }}></Stack.Screen> */}
        <Stack.Screen name='Chatex' component={Chatex} options={{ headerShown: false }}></Stack.Screen>
        {/* <Stack.Screen name='Mainex' component={Mainex} options={{ headerShown: false }}></Stack.Screen> */}
        <Stack.Screen name='OpionNavigator' component={OpionNavigator} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='ChatScreen' component={ChatScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='MeNavigator' component={MeNavigator} options={{headerShown:false}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;