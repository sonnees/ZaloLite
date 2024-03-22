import { createStackNavigator } from "@react-navigation/stack";

import MainMessage from './MainMessage';
import ChatScreen from './ChatScreen';
import Search from './Search';
import Option from "./Option";
export default function App() {
  let Stack = createStackNavigator();
  return (
      <Stack.Navigator initialRouteName="MainMessage">
        <Stack.Screen name="Option" component={Option} options={{headerShown: false}}/>
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown: false}}/>
        
        {/* <Stack.Screen name="MainMessage" component={MainMessage} options={{headerShown: false}}/>
        <Stack.Screen name="Search" component={Search} options={{headerShown: false}}/> */}
      </Stack.Navigator>
  );
}


