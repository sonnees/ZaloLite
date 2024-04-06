import { createStackNavigator } from "@react-navigation/stack";

//Screen Của Login
import LoginScreen from '../screens/LoginScreen';
import CreatePasswordWhenForgotScreen from '../screens/CreatePasswordWhenForgotScreen';
import CreatePasswordScreen from '../screens/CreatePasswordScreen';
import ConfirmAccountScreen from '../screens/ConfirmAccountScreen';


//Screen của Register
import RegisterScreen from '../screens/RegisterScreen'
import AddInforScreen from '../screens/AddInforScreen'
import SlashScreen from "../screens/SlashScreen";
import RegisterDEScreen from "../screens/RegisterDEScreen";
import RegisterProfileScreen from "../screens/RegisterProfileScreen";
import OtpScreen from "../screens/OtpScreen";




export default function LoginNavigator() {
  let Stack = createStackNavigator();
  
  return (
      <Stack.Navigator>
          {/* Screen Của Login */}
          <Stack.Screen name='SlashScreen' component={SlashScreen} options={{ headerShown: false }}/>
          <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name='CreatePasswordWhenForgotScreen' component={CreatePasswordWhenForgotScreen} options={{ headerShown: false }}/>
          <Stack.Screen name='CreatePasswordScreen' component={CreatePasswordScreen} options={{ headerShown: false }}/>
          <Stack.Screen name='ConfirmAccountScreen' component={ConfirmAccountScreen} options={{ headerShown: false }}/>
          {/* Screen của Register */}

        <Stack.Screen name="AddInforScreen" component={AddInforScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterDEScreen" component={RegisterDEScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterProfileScreen" component={RegisterProfileScreen} options={{headerShown: false}}/>
        <Stack.Screen name="OtpScreen" component={OtpScreen} options={{headerShown: false}}/>
        
     


      </Stack.Navigator>
  );
}