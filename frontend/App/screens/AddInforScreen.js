import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function AddInforScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState(''); 

  return (
    <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding">
      <View style={styles.container}>
        <View style={{ flex: 0.2, backgroundColor: "#0000FF", paddingVertical: 10 }}></View>
        <View style={{ flex: 0.9, backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center" , paddingVertical: 5}}>
          <Image
            style={{ width: "15%", height: "40%", resizeMode: "contain" }}
            source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate("SlashScreen")}
          ></Image>
          <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>Tạo tài khoản</Text>
        </View>
        <View style={{ flex: 6, paddingLeft: "5%", paddingRight: "5%", top: "2%" }}>
          <Text style={{ fontFamily: "Roboto", fontSize: 16, fontWeight: "bold" }}>Tên ZaloLife</Text>
          <TextInput
            style={{ borderBottomWidth: 1, borderBottomColor: "#1E90FF", fontSize: 16, fontFamily: "Roboto", top: "4%", padding: 10}}
            placeholder='Gồm 2-40 kí tự'
            value={userName}
            onChangeText={text => setUserName(text)} 
          />
          
          <Text style={{ fontFamily: "Roboto", fontSize: 16, top: "10%", fontWeight: '700' }}>Lưu ý khi đặt tên:</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 14, top: "14%", marginLeft: "6%", fontWeight: '700' }}>• Không vi phạm Quy định đặt tên trên zalo</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 14, top: "18%", fontWeight: '700', marginLeft: "6%" }}>• Nên sử dụng tên thật để giúp bạn bè dễ nhận ra bạn</Text>
        </View>
        <View style={{ flex: 5 }}></View>
        <View style={{flex: 2, justifyContent: "center", paddingLeft: "70%" }}>
          <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}
            onPress={() => navigation.navigate("RegisterScreen", { userName: userName })} 
          >
            <Image style={{width: "100%", height: "50%", resizeMode: "contain"}} source={require("../assets/right-arrow.png")}></Image>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
