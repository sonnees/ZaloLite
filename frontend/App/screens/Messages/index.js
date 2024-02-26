import { createStackNavigator } from "@react-navigation/stack";

import MainMessage from './MainMessage';
export default function App() {
  let Stack = createStackNavigator();
  return (
      <Stack.Navigator>
        <Stack.Screen name="MainMessage" component={MainMessage} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}


