import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreatePasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const phoneNumber = route.params.phoneNumber;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const updatePassword = () => {
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và mật khẩu xác nhận không khớp.');
      return;
    }
  
    fetch('http://192.168.1.3:8081/api/v1/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        field1: phoneNumber,
        field2: password,
      }),
    })
    .then(response => {
      if (response.ok) {
        // Nếu yêu cầu thành công, điều hướng đến màn hình đăng nhập và chuyển thông tin mật khẩu mới.
        navigation.navigate('LoginScreen', { newPassword: password });
      } else {
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật mật khẩu.');
      }
    })
    .catch(error => {
      console.error('Lỗi:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật mật khẩu.');
    });
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <StatusBar />
      <View style={{ flex: 1}}>
        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center", paddingVertical: 6, height: 50 }}>
          <Image style={{ width: "15%", height: "65%", resizeMode: "contain" }} source={require("../assets/back1.png")}
             onStartShouldSetResponder={() => navigation.navigate('LoginNavigator', { screen: 'SlashScreen' })}
          ></Image>
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Tạo mật khẩu</Text>
        </View>
        <View style={{ flexDirection: "column", alignItems: "center",justifyContent: 'center', paddingVertical: 12, backgroundColor: "#DDDDDD", height: 55 }}>
          <Text style={{ fontSize: 12, marginLeft: "6%" }}>Mật khẩu phải bao gồm chữ cái và số Không được </Text>
          <Text style={{ fontSize: 12, marginLeft: "6%" }}>chứa năm sinh, username và tên zalo của bạn </Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", marginLeft: "5%", marginTop: "5%" }}>Nhập mật khẩu:</Text>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}> 
          <TextInput
            style={{
              marginRight: "5%",
              borderBottomWidth: 1,
              borderBottomColor: "#1E90FF",
              fontSize: 16,
              fontFamily: "Roboto",
              top: "4%",
              padding: 10,
              flex: 1 
            }}
            placeholder='Nhập mật khẩu mới'
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />       
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}> 
          <TextInput
            style={{
              marginRight: "5%",
              borderBottomWidth: 1,
              borderBottomColor: "#1E90FF",
              fontSize: 16,
              fontFamily: "Roboto",
              top: "8%",
              padding: 10,
              flex: 1 
            }}
            placeholder='Nhập lại mật khẩu mới'
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />       
        </View>
        <View style={{ flex: 2,  top: "6%"}}>
          
        </View>
        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center", paddingVertical: 6, height: 50, marginLeft: "10%", marginRight: "10%"}}>
          <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1E90FF"}}
            onPress={updatePassword}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 7 }}></View>
        
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CreatePasswordScreen;
