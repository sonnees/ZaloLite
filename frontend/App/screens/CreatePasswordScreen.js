import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_RESET_PASS } from '../api/API';

const CreatePasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const phoneNumber = route.params.phoneNumber.startsWith('+84') ? '0' + route.params.phoneNumber.slice(3) : route.params.phoneNumber;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const errors = {};
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,32}$/;
    if (!password) {
      errors.password = 'Mật khẩu không được để trống.';
    } else if (!passwordRegex.test(password)) {
      errors.password = 'Mật khẩu phải dài 6-32 ký tự và bao gồm chữ cái, chữ số, ký tự đặc biệt.';
    }
    return errors;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    const errors = {};
    if (!confirmPassword) {
      errors.confirmPassword = 'Vui lòng nhập lại mật khẩu mới.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu mới và xác nhận mật khẩu không khớp.';
    }
    return errors;
  };

  const updatePassword = () => {
    const passwordErrors = validatePassword(password);
    const confirmPasswordErrors = validateConfirmPassword(password, confirmPassword);

    if (Object.keys(passwordErrors).length > 0 || Object.keys(confirmPasswordErrors).length > 0) {
      setErrors({ ...passwordErrors, ...confirmPasswordErrors });
      return;
    }

    fetch(API_RESET_PASS, {
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
          navigation.navigate("LoginNavigator", { screen: "OtpScreen", params: { phoneNumber: phoneNumber, password: password } });
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
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center", paddingVertical: 6, height: 50 }}>
          <Image style={{ width: "15%", height: "65%", resizeMode: "contain" }} source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate('LoginNavigator', { screen: 'SlashScreen' })}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Tạo mật khẩu</Text>
        </View>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: 'center', paddingVertical: 12, backgroundColor: "#DDDDDD", height: 55 }}>
          <Text style={{ fontSize: 12, marginLeft: "6%" }}>Mật khẩu phải bao gồm chữ cái và số Không được </Text>
          <Text style={{ fontSize: 12, marginLeft: "6%" }}>chứa năm sinh, username và tên Zalo của bạn </Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", marginLeft: "5%", marginTop: "5%" }}>Nhập mật khẩu:</Text>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <TextInput
            style={[styles.input, { borderColor: errors.password ? 'red' : '#1E90FF' }]}
            placeholder='Nhập mật khẩu mới'
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            onBlur={() => setErrors(validatePassword(password))}
          />
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <TextInput
            style={[styles.input, { borderColor: errors.confirmPassword ? 'red' : '#1E90FF' }]}
            placeholder='Nhập lại mật khẩu mới'
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => setErrors(validateConfirmPassword(password, confirmPassword))}
          />
        </View>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
        <View style={{ flex: 2, top: "6%" }}></View>
        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center", paddingVertical: 6, height: 50, marginLeft: "10%", marginRight: "10%" }}>
          <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1E90FF" }}
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

export default CreatePasswordScreen;
