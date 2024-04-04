import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { API_AUTHENTICATE } from '../api/Api';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const newPassword = route.params?.newPassword;
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("newPassword:", newPassword);
    if (newPassword && isFocused) {
      setPassword(newPassword);
    }
  }, [newPassword, isFocused]);

  const handleLogin = async () => {
    try {
      // Gửi yêu cầu đăng nhập đến API
      const response = await fetch(API_AUTHENTICATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          password: password || newPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Đăng nhập thành công, lưu token vào AsyncStorage
        await AsyncStorage.setItem('token', data.field);

        console.log('data:', data.field);

        // Lưu phoneNumber vào AsyncStorage
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
        // Chuyển hướng đến màn hình tiếp theo
        navigation.navigate('TabNavigator');
      } else {
        // Đăng nhập không thành công, hiển thị thông báo lỗi từ phản hồi của API
        Alert.alert('Lỗi', data.message);
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <StatusBar />
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center", paddingVertical: 6, height: 50 }}>
          <Image style={{ width: "15%", height: "65%", resizeMode: "contain" }} source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate('LoginNavigator', { screen: 'SlashScreen' })}
          ></Image>
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Đăng nhập</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, backgroundColor: "#DDDDDD", height: 45 }}>
          <Text style={{ fontSize: 14, marginLeft: "6%" }}>Vui lòng nhập số tài khoản và mật khẩu để đăng nhập n</Text>
        </View>

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
              flex: 1 // Đảm bảo TextInput chiếm hết không gian còn lại của row
            }}
            placeholder='Nhập số điện thoại'
            value={phoneNumber}
            onChangeText={setPhoneNumber}
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
              top: "6%",
              padding: 10,
              flex: 1 // Đảm bảo TextInput chiếm hết không gian còn lại của row
            }}
            placeholder='Mật khẩu'
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Text style={{ fontSize: 15, marginLeft: "5%", marginTop: "15%", fontFamily: "Roboto", color: "#1E90FF", fontWeight: "bold" }}
          onPress={() => navigation.navigate('CreatePasswordWhenForgotScreen')}
        >
          Lấy lại mật khẩu
        </Text>
        {/* <View style={{flex: 0.5}}></View> */}
        <View style={{ flex: 5 }}></View>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "flex-end" }}>
          <TouchableOpacity
            style={{ borderRadius: 20, justifyContent: "center", alignItems: "center", paddingVertical: 5 }}
            onPress={handleLogin}
          >
            <Image
              style={{ width: 80, height: 50, resizeMode: "contain" }}
              source={require("../assets/right-arrow.png")}
            />
          </TouchableOpacity>
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

export default LoginScreen;