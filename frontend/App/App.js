

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


import login from './screens/LoginScreen';

export default function App() {
  let Stack = createStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="login" component={login}  options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


