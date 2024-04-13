import React, { createContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
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
import ChatGroupScreen from './screens/ChatGroupScreen';
import AddMemberScreen from './screens/AddMemberScreen';

const Stack = createStackNavigator();
export const UserInfoContext = createContext();

function App() {
  const [userInfo, setUserInfo] = useState({});
  const [chatID, setChatID] = useState({});

  const handleFriendRequest = (data, userId) => {
    const friendRequests = checkDuplicateUser(data, userId);
    const type = checkType(friendRequests);
    return type;
  };

  const checkDuplicateUser = (data, userId) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].userID === userId) {
        return data[i];
      }
    }
    return null;
  };

  const checkType = (data) => {
    if (!data) {
      return 'NOTSEND';
    } else if (data.isSender) {
      return 'SENT';
    } else if (data.isSender === false) {
      return 'REQUEST';
    }
  };

  const values = {
    userInfo,
    setUserInfo,
    chatID,
    setChatID,
    handleFriendRequest,
  };

  return (
    <GlobalProvider>
      <SocketProvider>
        <UserInfoContext.Provider value={values}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name='LoginNavigator' component={LoginNavigator} options={{ headerShown: false }} />
              <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name='AddFriendScreen' component={AddFriendScreen} options={{ headerShown: false }} />
              <Stack.Screen name='ListCountryScreen' component={ListCountryScreen} options={{ headerShown: false }} />
              <Stack.Screen name='CreactGroupScreen' component={CreactGroupScreen} options={{ headerShown: false }}/>
              <Stack.Screen name='SearchScreen' component={SearchScreen} options={{ headerShown: false }} />
              <Stack.Screen name='OpionNavigator' component={OpionNavigator} options={{ headerShown: false }} />
              <Stack.Screen name='MeNavigator' component={MeNavigator} options={{ headerShown: false }} />
              <Stack.Screen name='ChatScreen' component={ChatScreen} options={{ headerShown: false }} />
              <Stack.Screen name='ProfileFriendScreen' component={ProfileFriendScreen} options={{ headerShown: false }} />
              <Stack.Screen name='FriendRequestScreen' component={FriendRequestScreen} options={{ headerShown: false }} />
              <Stack.Screen name='ChatGroupScreen' component={ChatGroupScreen} options={{ headerShown: false }} />
              <Stack.Screen name='AddMemberScreen' component={AddMemberScreen} options={{ headerShown: false }} />

            </Stack.Navigator>
          </NavigationContainer>
        </UserInfoContext.Provider>
      </SocketProvider>
    </GlobalProvider>
  );
}

export default App;
