

import { createStackNavigator } from "@react-navigation/stack";
import Profile from './Profile';
import Person from './Person';
import TranferAccount from './TranferAccount';
import Information from "./Information";
import Install from "./Install"
import InformationDetail from "./InformationDetail";
export default function App() {
  let Stack = createStackNavigator();
  
  return (
    <Stack.Navigator>
        <Stack.Screen name="Person" component={Person} options={{headerShown: false}}/>
        <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
        <Stack.Screen name="Information" component={Information} options={{headerShown: false}}/>
        <Stack.Screen name="TranferAccount" component={TranferAccount} options={{ headerShown: false }} />
<<<<<<< HEAD
        {/* <Stack.Screen name="Install" component={Install} options={{headerShown: false}}/> */}
=======
        <Stack.Screen name="Install" component={Install} options={{headerShown: false}}/>
>>>>>>> 77b5ea3ec481465807cfadbd123fec06e229858c
        <Stack.Screen name="InformationDetail" component={InformationDetail} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}


