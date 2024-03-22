import { createStackNavigator } from "@react-navigation/stack";

//Screen Của Login
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import ConfirmForgotPasswordScreen from '../screens/ConfirmForgotPassword'
import CreatePasswordScreen from '../screens/CreatePasswordScreen'
import CreatePasswordWhenForgotScreen from '../screens/CreatePasswordWhenForgotScreen'

//Screen của Register
import RegisterScreen from '../screens/RegisterScreen'
import AddInforScreen from '../screens/AddInforScreen'
import ConfirmAccountScreen from '../screens/ConfirmAccountScreen'
import UpdatePhotoScreen from '../screens/UpdatePhotoScreen'
import ZaloNameScreen from '../screens/ZaloNameScreen'
import SlashScreen from "../screens/SlashScreen";




export default function LoginNavigator() {
  let Stack = createStackNavigator();
  
  return (
      <Stack.Navigator>
          {/* Screen Của Login */}
          <Stack.Screen name='SlashScreen' component={SlashScreen} options={{ headerShown: false }}/>
          <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }}/>
          {/* <Stack.Screen name="ConfirmForgotPasswordScreen" component={ConfirmForgotPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CreatePasswordScreen" component={CreatePasswordScreen} options={{headerShown: false}}/>
          <Stack.Screen name="CreatePasswordWhenForgotScreen" component={CreatePasswordWhenForgotScreen} options={{ headerShown: false }} /> */}
          {/* Screen của Register */}
        <Stack.Screen name="AddInforScreen" component={AddInforScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/>
        
        {/* <Stack.Screen name="ConfirmAccountScreen" component={ConfirmAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UpdatePhotoScreen" component={UpdatePhotoScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ZaloNameScreen" component={ZaloNameScreen} options={{ headerShown: false }} /> */}


      </Stack.Navigator>
  );
}


