import React from 'react';
import { View, TextInput, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView,Text,StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
const YourComponent = () => {
  let navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Điều chỉnh offset nếu cần thiết
    >
      <StatusBar  />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 6 }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingLeft:'2%' }}>
              <Icon name='search1' size={22} color={'white'} />
            </TouchableOpacity>
              <TouchableOpacity style={{ flex: 7, borderRadius: 5, backgroundColor: "#1E90FF", height: 40, paddingHorizontal: 10,justifyContent: "center", alignItems: "flex-start" }}
              onPress={() => navigation.navigate("SearchScreen")}
            >
                <Text style={{paddingLeft:10,fontSize:16,color:"#454545"}}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingRight:'5%'}}>
              <Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={require("../assets/qr-code.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingRight:'2%'  }}>
              <Icon name='plus' size={22} color={'white'} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "space-between",paddingVertical: 12,backgroundColor: "#fff"}}>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default YourComponent;
