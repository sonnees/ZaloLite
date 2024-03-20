import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    fetch('http://localhost:8081/api/v1/auth/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        password: password,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.success) {
        navigation.navigate("TabNavigator");
      } else {
        Alert.alert('Lỗi', data && data.message ? data.message : 'Đăng nhập không thành công');
      }
    })
    .catch(error => {
      console.error('Lỗi khi gọi API:', error);
      Alert.alert('Đã xảy ra lỗi', 'Vui lòng thử lại sau.');
    });
  };
  
  return (
    <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding">
      <View style={styles.container}>
        <View style={{ flex: 0.6, backgroundColor: "#0000FF" }}></View>
        <View style={{ flex: 0.9, backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ width: "15%", height: "40%", resizeMode: "contain" }}
            source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate("SlashScreen")}
          ></Image>
          <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>Đăng nhập</Text>
        </View>
        <View style={{ flex: 6}}>
          <View style={{flex: 0.2, backgroundColor: "#CFCFCF", justifyContent: "center"}}>
            <Text style={{ fontFamily: "Roboto", fontSize: 13 , fontWeight: "700", marginLeft: "3%" }}>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
          </View>

          <TextInput
            style={{ borderBottomWidth: 1, borderBottomColor: "#1E90FF", fontSize: 16, fontFamily: "Roboto", top: "4%", padding: 10,marginLeft: "3%", marginRight: "3%" }}
            onChangeText={text => setPhoneNumber(text)}
            value={phoneNumber}
            placeholder='Số điện thoại'
          />

          <TextInput
            style={{ borderBottomWidth: 1, borderBottomColor: "#1E90FF", fontSize: 16, fontFamily: "Roboto", top: "4%", padding: 10,marginLeft: "3%", marginRight: "3%" }}
            onChangeText={text => setPassword(text)}
            value={password}
            placeholder='Mật khẩu'
            secureTextEntry={true}
          />

          <TouchableOpacity onPress={handleLogin}>
            <Text style={{ fontFamily: "Roboto", fontSize: 16, top: "10%", fontWeight: '700' , color: "#1E90FF", marginLeft: "3%"}}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 5 }}></View>
        <View style={{flex: 2, justifyContent: "center", alignItems: "flex-end", marginRight: "-80%"}}>
        <Image
            style={{ width: "100%", height: "40%", resizeMode: "contain"}}
            source={require("../assets/right-arrow.png")}
            onStartShouldSetResponder={() => navigation.navigate("TabNavigator")}
          ></Image>

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
