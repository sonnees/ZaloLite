

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


import login from './screens/LoginScreen';
import ChatApp from './screens/ChatApp';
import Profile from './screens/Profile';
import Person from './screens/Person';
import AccountTranfer from './screens/AccountTranfer';

export default function App() {
  let Stack = createStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="login" component={login}  options={{headerShown: false}}/> */}
        {/* <Stack.Screen name="ChatApp" component={ChatApp} options={{headerShown: false}}/> */}
        <Stack.Screen name="AccountTranfer" component={AccountTranfer} options={{headerShown: false}}/>
        <Stack.Screen name="Person" component={Person} options={{headerShown: false}}/>
        <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}


