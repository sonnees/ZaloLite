import React from 'react';
import { View, TextInput, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView,Text,StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
import Navbar from '../layout/Navbar';
const YourComponent = () => {
  let navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Điều chỉnh offset nếu cần thiết
    >
      <StatusBar  />
        <View style={{ flex: 1 }}>
          <Navbar type={"ContactsScreen"}></Navbar>

          <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "space-between",paddingVertical: 12,backgroundColor: "#fff",height:45}}>
              <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize:16}}> Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize:16}}> Groups</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize:16}}> OA</Text>
              </TouchableOpacity>
          </View>
            <View style={{borderBottomColor: 'gray',borderBottomWidth: 1,width: '100%',}} />
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Your remaining content */}
          </View>
        </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default YourComponent;
