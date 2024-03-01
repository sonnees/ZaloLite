import { createStackNavigator } from "@react-navigation/stack";

import MainMessage from './MainMessage';
<<<<<<< HEAD
import ChatScreen from './ChatScreen';
import Search from './Search';
import Option from "./Option";
=======
import Search from './Search';
>>>>>>> 77b5ea3ec481465807cfadbd123fec06e229858c
export default function App() {
  let Stack = createStackNavigator();
  return (
      <Stack.Navigator initialRouteName="MainMessage">
<<<<<<< HEAD
        <Stack.Screen name="Option" component={Option} options={{headerShown: false}}/>
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown: false}}/>
        
        {/* <Stack.Screen name="MainMessage" component={MainMessage} options={{headerShown: false}}/>
        <Stack.Screen name="Search" component={Search} options={{headerShown: false}}/> */}
=======
        <Stack.Screen name="MainMessage" component={MainMessage} options={{headerShown: false}}/>
        <Stack.Screen name="Search" component={Search} options={{headerShown: false}}/>
>>>>>>> 77b5ea3ec481465807cfadbd123fec06e229858c
      </Stack.Navigator>
  );
}


