import { createStackNavigator } from "@react-navigation/stack";

import Diary from './Diary';
export default function App() {
  let Stack = createStackNavigator();
  
  return (
      <Stack.Navigator>
        <Stack.Screen name="Diary" component={Diary} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}


