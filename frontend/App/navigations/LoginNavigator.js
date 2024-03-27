import { createStackNavigator } from "@react-navigation/stack";

//Screen Của Login
import LoginScreen from '../screens/LoginScreen';


//Screen của Register
import RegisterScreen from '../screens/RegisterScreen'
import AddInforScreen from '../screens/AddInforScreen'
import SlashScreen from "../screens/SlashScreen";
import RegisterDEScreen from "../screens/RegisterDEScreen";
import RegisterProfileScreen from "../screens/RegisterProfileScreen";




export default function LoginNavigator() {
  let Stack = createStackNavigator();
  
  return (
      <Stack.Navigator>
          {/* Screen Của Login */}
          <Stack.Screen name='SlashScreen' component={SlashScreen} options={{ headerShown: false }}/>
          <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="AddInforScreen" component={AddInforScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterDEScreen" component={RegisterDEScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterProfileScreen" component={RegisterProfileScreen} options={{headerShown: false}}/>
        
     


      </Stack.Navigator>
  );
}