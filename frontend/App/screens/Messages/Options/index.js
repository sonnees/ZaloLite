import { createStackNavigator } from "@react-navigation/stack";

import MainMessage from './MainMessage';
<<<<<<< HEAD
import Option from './Options';
=======
>>>>>>> 77b5ea3ec481465807cfadbd123fec06e229858c
export default function App() {
  let Stack = createStackNavigator();
  return (
      <Stack.Navigator>
<<<<<<< HEAD
        {/* <Stack.Screen name="Option" component={Option} options={{headerShown: false}}/> */}
=======
>>>>>>> 77b5ea3ec481465807cfadbd123fec06e229858c
        <Stack.Screen name="MainMessage" component={MainMessage} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}


