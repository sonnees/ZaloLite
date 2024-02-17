import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Message from './screens/Message/index';
import Person from './screens/Person/index';
import Contact from "./screens/Contact/index"
import Diary from "./screens/Diary/index"
import Icon from 'react-native-vector-icons/AntDesign';
const Tab = createBottomTabNavigator();
import { Text } from 'react-native';
function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Message') {
              iconName = focused ? 'message1' : 'message1';
            } else if (route.name === 'Person') {
              iconName = focused ? 'user' : 'user';
            }else if (route.name === 'Contact') {
              iconName = focused ? 'contacts' : 'contacts';
            }else if (route.name === 'Diary') {
              iconName = focused ? 'clockcircleo' : 'clockcircleo';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarLabel: ({ focused, color }) => {
            let labelText;

            if (route.name === 'Message' && color==='gray') {
              labelText = '';
            }else if (route.name === 'Message' && color==='blue') {
              labelText = 'Message';
            } else if (route.name === 'Person' && color==='gray') {
              labelText = '';
            }else if (route.name === 'Person' && color==='blue') {
              labelText = 'Person';
            }else if (route.name === 'Diary' && color==='gray') {
              labelText = '';
            }else if (route.name === 'Diary' && color==='blue') {
              labelText = 'Diary';
            }else if (route.name === 'Contact' && color==='gray') {
              labelText = '';
            }else if (route.name === 'Contact' && color==='blue') {
              labelText = 'Contact';
            }

            return <Text style={{ color }}>{labelText}</Text>;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Message" component={Message} options={{headerShown: false}}/>
        <Tab.Screen name="Contact" component={Contact} options={{headerShown: false}}/>
        <Tab.Screen name="Diary" component={Diary} options={{headerShown: false}}/>
        <Tab.Screen name="Person" component={Person} options={{headerShown: false}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
