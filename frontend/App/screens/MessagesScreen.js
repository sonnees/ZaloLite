import React from 'react';
import { View, TextInput, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView,Text,StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'

const MessagesScreen = () => {
  let navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Điều chỉnh offset nếu cần thiết
    >
      <StatusBar />
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 6,height:50 }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingLeft:'2%' }}>
              <Icon name='search1' size={22} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 7, borderRadius: 5, backgroundColor: "#1E90FF", height: 40, paddingHorizontal: 10,justifyContent: "center", alignItems: "flex-start" }}
              onPress={() => navigation.navigate("SearchScreen")}
            >
                <Text style={{paddingLeft:10,fontSize:16,color:"#CCCCCC"}}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingRight:'5%'}}
                onPress={() => navigation.navigate('MeNavigator', { screen: 'QRScreen' })}
            >
              <Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={require("../assets/qr-code.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingRight:'2%'  }}
                 onPress={() => navigation.navigate('MeNavigator', { screen: 'ConfirmQRScreen' })}
            >
              <Icon name='plus' size={22} color={'white'} />
            </TouchableOpacity>
          </View>
          
          <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "space-between",paddingVertical: 12,backgroundColor: "#fff",height:45}}>
              <View style={{flex:1, flexDirection: "row", justifyContent: "center", alignContent: "space-between"}}>
                <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontSize:16}}>Focused</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontSize:16}}> Other</Text>
                </TouchableOpacity>
              </View>
            
              <TouchableOpacity style={{flex: 1, justifyContent: "center", alignItems: "flex-end", paddingRight:'3%'}}>
                <Icon name='filter' size={25} color={'gray'}></Icon>
              </TouchableOpacity>
          </View>
            <View style={{borderBottomColor: 'gray',borderBottomWidth: 1,width: '100%'}} />
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

export default MessagesScreen;
