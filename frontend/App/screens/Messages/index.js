import { createStackNavigator } from "@react-navigation/stack";

import MainMessage from './MainMessage';
import Search from './Search';
export default function App() {
  let Stack = createStackNavigator();
  return (
      <Stack.Navigator initialRouteName="MainMessage">
        <Stack.Screen name="MainMessage" component={MainMessage} options={{headerShown: false}}/>
        <Stack.Screen name="Search" component={Search} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}


