import { createStackNavigator } from "@react-navigation/stack";

import MainMessage from './MainMessage';
import Option from './Options';
export default function App() {
  let Stack = createStackNavigator();
  return (
      <Stack.Navigator>
        {/* <Stack.Screen name="Option" component={Option} options={{headerShown: false}}/> */}
        <Stack.Screen name="MainMessage" component={MainMessage} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}


