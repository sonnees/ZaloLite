import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ChatApp from './ChatApp';
export default function App() {
  let Stack = createStackNavigator();
  
  return (
      <Stack.Navigator>
        <Stack.Screen name="ChatApp" component={ChatApp} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}


