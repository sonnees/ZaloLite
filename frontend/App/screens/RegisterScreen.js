import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { API_RGT } from '../api/Api';

export default function RegisterScreen() {
  let navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('123');
  
  const route = useRoute();
  const userName = route.params.userName;

  const [gender, setGender] = useState(true);
  const [birthday, setBirthday] = useState('2024-01-26');
  const [role, setRole] = useState('USER');
    const handleRegister = () => {
    // Kiểm tra thông tin nhập vào
    if (!phoneNumber.trim() || !password.trim() || !userName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Gửi yêu cầu đăng ký
    axios.post(API_RGT, {
      phoneNumber,
      password,
      userName,
      gender,
      birthday,
      role
    })
      .then(response => {
        navigation.navigate('TabNavigator');
      })
      .catch(error => {
        Alert.alert('Lỗi', 'Đăng ký không thành công. Vui lòng thử lại sau.');
        console.error('Đăng ký không thành công:', error);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
    >
      <View style={styles.container}>
        <View style={{ flex: 0.2, backgroundColor: "#0000FF", paddingVertical: 10 }}></View>
        <View style={{ flex: 0.6, backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
          <Image
            style={{ width: "15%", height: "40%", resizeMode: "contain" }}
            source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate("AddInforScreen")}
          ></Image>
          <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>Tạo tài khoản</Text>
        </View>
        <View style={{ flex: 0.6, backgroundColor: "#EEEEEE", justifyContent: "center" , }}>
            <Text style={{ fontFamily: "Roboto", fontSize: 14, fontWeight: "700", marginLeft: "3%" }}>Nhập số điện thoại của bạn để tạo tài khoản mới</Text>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#1E90FF",
              fontSize: 16,
              fontFamily: "Roboto",
              top: "4%",
              padding: 10,
              marginLeft: "3%",
              marginRight: "3%"
            }}
            placeholder='Nhập số điện thoại'
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
          />

          <CheckBox
            checked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
            title='Tôi đồng ý với điều khoản sử dụng của Zalo'
            containerStyle={{ marginLeft: "1%", marginTop: "3%", backgroundColor: "transparent", borderWidth: 0 }}
            textStyle={{ fontFamily: "Roboto", fontSize: 13, fontWeight: '700', color: "#1E90FF" }}
          />

          <CheckBox
            checked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
            title='Tôi đồng ý với điều khoản Mạng xã hội của Zalo'
            containerStyle={{ marginLeft: "1%", marginTop: "1%", backgroundColor: "transparent", borderWidth: 0 }}
            textStyle={{ fontFamily: "Roboto", fontSize: 13, fontWeight: '700', color: "#1E90FF" }}
          />
        </View>

         <View style={{ flex: 5 }}></View>
         <View style={{flex: 2, justifyContent: "center", paddingLeft: "70%" }}>
          <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}} onPress={handleRegister}>
            <Image style={{width: "70%", height: "40%", resizeMode: "contain"}} source={require("../assets/right-arrow.png")}></Image>
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