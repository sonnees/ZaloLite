import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_CHECKPHONE } from '../api/Api';

const CreatePasswordWhenForgotScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();

  const checkPhoneNumber = async () => {
    try {
      const response = await fetch(`${API_CHECKPHONE}${phoneNumber}`);
      const status = response.status; // Lấy mã trạng thái của phản hồi

      if (status === 409) {
        // Số điện thoại đã được đăng ký
        // Chuyển hướng đến màn hình tiếp theo
        navigation.navigate('CreatePasswordScreen', { phoneNumber: phoneNumber });
      } else if (status === 200) {
        // Số điện thoại chưa được đăng ký
        // Hiển thị thông báo hoặc xử lý theo yêu cầu của ứng dụng
        Alert.alert('Thông báo', 'Số điện thoại chưa được đăng ký.');
      } else {
        // Xử lý các trường hợp khác nếu cần
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra số điện thoại:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi kiểm tra số điện thoại. Vui lòng thử lại sau.');
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
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Lấy lại mật khẩu</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, backgroundColor: "#DDDDDD", height: 45 }}>
          <Text style={{ fontSize: 14, marginLeft: "6%" }}>Nhập số điện thoại để lấy lại mật khẩu n</Text>
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


        <View style={{ flex: 7 }}></View>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "flex-end" }}>
          <TouchableOpacity
            style={{ borderRadius: 20, justifyContent: "center", alignItems: "center", paddingVertical: 5 }}
            onPress={checkPhoneNumber}
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

export default CreatePasswordWhenForgotScreen;
