import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MainContact from './MainContact';
export default function App() {
  let Stack = createStackNavigator();
  
  return (
      <Stack.Navigator>
        <Stack.Screen name="MainContact" component={MainContact} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}


