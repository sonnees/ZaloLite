import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Messages from '../screens/MessagesScreen';
import Me from '../screens/MeScreen';
import Contacts from "../screens/ContactsScreen"
import Timeline from "../screens/TimelineScreen"
import Icon from 'react-native-vector-icons/AntDesign';
const Tab = createBottomTabNavigator();
import { Text } from 'react-native';
function TabNavigator() {
  return (
    // <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Messages') {
              iconName = focused ? 'message1' : 'message1';
            } else if (route.name === 'Me') {
              iconName = focused ? 'user' : 'user';
            }else if (route.name === 'Contacts') {
              iconName = focused ? 'contacts' : 'contacts';
            }else if (route.name === 'Timeline') {
              iconName = focused ? 'clockcircleo' : 'clockcircleo';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarLabel: ({ focused, color }) => {
            let labelText;

            if (route.name === 'Messages' && color==='gray') {
              labelText = '';
            }else if (route.name === 'Messages' && color==='blue') {
              labelText = 'Messages';
            } else if (route.name === 'Me' && color==='gray') {
              labelText = '';
            }else if (route.name === 'Me' && color==='blue') {
              labelText = 'Me';
            }else if (route.name === 'Timeline' && color==='gray') {
              labelText = '';
            }else if (route.name === 'Timeline' && color==='blue') {
              labelText = 'Timeline';
            }else if (route.name === 'Contacts' && color==='gray') {
              labelText = '';
            }else if (route.name === 'Contacts' && color==='blue') {
              labelText = 'Contacts';
            }

            return <Text style={{ color }}>{labelText}</Text>;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Messages" component={Messages} options={{headerShown: false}}/>
        <Tab.Screen name="Contacts" component={Contacts} options={{headerShown: false}}/>
        <Tab.Screen name="Timeline" component={Timeline} options={{headerShown: false}}/>
        <Tab.Screen name="Me" component={Me} options={{headerShown: false}}/>
      </Tab.Navigator>
    // </NavigationContainer>
  );
}

export default TabNavigator;