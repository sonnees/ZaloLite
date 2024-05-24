import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_CHECKPHONE } from '../api/Api';

const CreatePasswordWhenForgotScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const validatePhoneNumber = (phoneNumber) => {
    const errors = {};
    if (!phoneNumber) {
      errors.phoneNumber = 'Số điện thoại không được để trống.';
    } else if (phoneNumber.length !== 10) {
      errors.phoneNumber = 'Số điện thoại phải đủ 10 số.';
    } else if (!phoneNumber.startsWith('0')) {
      errors.phoneNumber = 'Số điện thoại phải bắt đầu bằng số 0.';
    }
    return errors;
  };

  const checkPhoneNumber = async () => {
    const phoneErrors = validatePhoneNumber(phoneNumber);
    if (Object.keys(phoneErrors).length > 0) {
      setErrors(phoneErrors);
      return;
    }

    try {
      const response = await fetch(`${API_CHECKPHONE}${phoneNumber}`);
      const status = response.status;

      if (status === 409) {
        navigation.navigate('CreatePasswordScreen', { phoneNumber: phoneNumber });
      } else if (status === 200) {
        Alert.alert('Thông báo', 'Số điện thoại chưa được đăng ký.');
      } else {
        Alert.alert('Lỗi', 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
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
          />
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Lấy lại mật khẩu</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, backgroundColor: "#DDDDDD", height: 45 }}>
          <Text style={{ fontSize: 14, marginLeft: "6%" }}>Nhập số điện thoại để lấy lại mật khẩu</Text>
        </View>

        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <TextInput
            style={[styles.input, { borderColor: errors.phoneNumber ? 'red' : '#1E90FF' }]}
            placeholder='Nhập số điện thoại'
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onBlur={() => setErrors(validatePhoneNumber(phoneNumber))}
          />
        </View>
        {errors.phoneNumber && (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        )}

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
  input: {
    marginRight: "5%",
    borderBottomWidth: 1,
    fontSize: 16,
    fontFamily: "Roboto",
    padding: 10,
    flex: 1,
  },
  errorText: {
    color: 'red',
    marginLeft: 15,
    marginTop: 5,
  },
});

export default CreatePasswordWhenForgotScreen;
