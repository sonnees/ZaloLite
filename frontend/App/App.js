import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Messages from './screens/Messages/index';
import Me from './screens/Me/index';
import Login from './screens/Login/index';

import Contacts from "./screens/Contacts/index";
import Timeline from "./screens/Timeline/index";
import Icon from 'react-native-vector-icons/AntDesign';
import { Text } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Messages') {
          iconName = focused ? 'message1' : 'message1';
        } else if (route.name === 'Me') {
          iconName = focused ? 'user' : 'user';
        } else if (route.name === 'Contacts') {
          iconName = focused ? 'contacts' : 'contacts';
        } else if (route.name === 'Timeline') {
          iconName = focused ? 'clockcircleo' : 'clockcircleo';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarLabel: ({ focused, color, route }) => { // Include route as a parameter
        let labelText;

        if (route.name === 'Messages' && color === 'gray') {
          labelText = '';
        } else if (route.name === 'Messages' && color === 'blue') {
          labelText = 'Messages';
        } else if (route.name === 'Me' && color === 'gray') {
          labelText = '';
        } else if (route.name === 'Me' && color === 'blue') {
          labelText = 'Me';
        } else if (route.name === 'Timeline' && color === 'gray') {
          labelText = '';
        } else if (route.name === 'Timeline' && color === 'blue') {
          labelText = 'Timeline';
        } else if (route.name === 'Contacts' && color === 'gray') {
          labelText = '';
        } else if (route.name === 'Contacts' && color === 'blue') {
          labelText = 'Contacts';
        }

        return <Text style={{ color }}>{labelText}</Text>;
      },
    })}
    tabBarOptions={{
      tabBarActiveTintColor: 'blue',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
    <Tab.Screen name="Contacts" component={Contacts} options={{ headerShown: false }} />
    <Tab.Screen name="Timeline" component={Timeline} options={{ headerShown: false }} />
    <Tab.Screen name="Me" component={Me} options={{ headerShown: false }} />
  </Tab.Navigator>
);

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false}}/>
        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 

export default App;
