import React from 'react';
import { View, TextInput, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView,Text } from 'react-native';
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
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{flex: 0.05, backgroundColor: "#0000FF", paddingVertical: 5}}></View>
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 10 }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingLeft:'2%' }}>
              <Icon name='search1' size={30} color={'white'} />
            </TouchableOpacity>
            <TextInput style={{ flex: 7, borderRadius: 5, backgroundColor: "#1E90FF", height: 40, paddingHorizontal: 10 }} placeholder="Tìm kiếm" />
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingRight:'5%'}}
                onPress={() => navigation.navigate('MeNavigator', { screen: 'QRScreen' })}
            >
              <Image style={{ width: 30, height: 30, resizeMode: "contain" }} source={require("../assets/qr-code.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingRight:'2%'  }}
                 onPress={() => navigation.navigate('MeNavigator', { screen: 'ConfirmQRScreen' })}
            >
              <Icon name='plus' size={30} color={'white'} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "space-between", paddingVertical: 10,backgroundColor:'#fff'}}>
            <View style={{flex:1, flexDirection: "row", justifyContent: "center", alignContent: "space-between"}}>
              <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
                <Text> Focused</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
                <Text> Other</Text>
              </TouchableOpacity>
            </View>
          
            <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "flex-end", paddingRight:'2%'}}>
              <Icon name='filter' size={30} color={'gray'}></Icon>
            </TouchableOpacity>
          </View>
            <View style={{borderBottomColor: 'gray',borderBottomWidth: 1,width: '100%'}} />
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

export default MessagesScreen;
