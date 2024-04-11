import React, { createContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import TabNavigator from './navigations/TabNavigator';
import MeNavigator from './navigations/MeNavigator';
import ChatScreen from './screens/ChatScreen';
import OpionNavigator from './navigations/OptionNavigator';
import LoginNavigator from './navigations/LoginNavigator';
import SearchScreen from './screens/SearchScreen';
import ListCountryScreen from './screens/ListCountryScreen';
import AddFriendScreen from './screens/AddFriendScreen';
import CreactGroupScreen from './screens/CreactGroupScreen';
import ProfileFriendScreen from './screens/ProfileFriendScreen';
import FriendRequestScreen from './screens/FriendRequestScreen';
import { GlobalProvider } from './context/GlobalContext'; // Assuming GlobalProvider is defined in GlobalContext.js
import { SocketProvider } from './context/SocketContext'; // Assuming SocketProvider is defined in SocketContext.js

const Stack = createStackNavigator();
const UserInfoContext = createContext();

function App() {
  const [userInfo, setUserInfo] = useState({});
  const [chatID, setChatID] = useState({});

  return (
    <GlobalProvider>
      <SocketProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='LoginNavigator' component={LoginNavigator} options={{ headerShown: false }} />
            <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name='AddFriendScreen' component={AddFriendScreen} options={{ headerShown: false }} />
            <Stack.Screen name='ListCountryScreen' component={ListCountryScreen} options={{ headerShown: false }} />
            <Stack.Screen name='CreactGroupScreen' component={CreactGroupScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='SearchScreen' component={SearchScreen} options={{ headerShown: false }} />
            <Stack.Screen name='OpionNavigator' component={OpionNavigator} options={{ headerShown: false }} />
            <Stack.Screen name='MeNavigator' component={MeNavigator} options={{ headerShown: false }} />
            <Stack.Screen name='ChatScreen' component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name='ProfileFriendScreen' component={ProfileFriendScreen} options={{ headerShown: false }} />
            <Stack.Screen name='FriendRequestScreen' component={FriendRequestScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SocketProvider>
    </GlobalProvider>
  );
}

export default App;
export { UserInfoContext };
