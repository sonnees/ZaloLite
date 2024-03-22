

import { createStackNavigator } from "@react-navigation/stack";
import Login from './LoginScreen';
import RegisterTVScreen from "./RegisterScreen";
import RegisterScreenDT from "./RegisterScreenDT";
import LoginAccountTV from "./LoginAccount";

export default function App() {
  let Stack = createStackNavigator();
  
  return (
    <Stack.Navigator> 
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false}}/>
        <Stack.Screen name="RegisterTVScreen" component={RegisterTVScreen} options={{headerShown: false}}/>
        <Stack.Screen name="LoginAccountTV" component={LoginAccountTV} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterScreenDT" component={RegisterScreenDT} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}