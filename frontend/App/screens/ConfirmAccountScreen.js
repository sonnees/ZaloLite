import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CHANGE_PASS } from '../api/Api';

const CreatePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateCurrentPassword = (password) => {
    const errors = {};
    if (!password) {
      errors.currentPassword = 'Mật khẩu hiện tại không được để trống.';
    }
    return errors;
  };

  const validateNewPassword = (password) => {
    const errors = {};
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,32}$/;
    if (!password) {
      errors.newPassword = 'Mật khẩu mới không được để trống.';
    } else if (!passwordRegex.test(password)) {
      errors.newPassword = 'Mật khẩu mới phải dài 6-32 ký tự và bao gồm chữ cái, chữ số, ký tự đặc biệt.';
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

  const handleChangePassword = async () => {
    const currentPasswordErrors = validateCurrentPassword(currentPassword);
    const newPasswordErrors = validateNewPassword(newPassword);
    const confirmPasswordErrors = validateConfirmPassword(newPassword, confirmPassword);

    if (Object.keys(currentPasswordErrors).length > 0 || Object.keys(newPasswordErrors).length > 0 || Object.keys(confirmPasswordErrors).length > 0) {
      setErrors({ ...currentPasswordErrors, ...newPasswordErrors, ...confirmPasswordErrors });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      console.log('token:', token);

      const response = await fetch(API_CHANGE_PASS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          curPass: currentPassword,
          newPass: newPassword,
        }),
      });

      if (response.status === 200) {
        navigation.navigate('LoginNavigator', { screen: 'LoginScreen' });
        Alert.alert('Thành công', 'Đổi mật khẩu thành công.');
        // Optionally log out the user
        // AsyncStorage.removeItem('token');
      } else if (response.status === 403 || response.status === 401) {
        Alert.alert('Lỗi', 'Mật khẩu hiện tại không đúng.');
      } else {
        throw new Error('Đã xảy ra lỗi khi kết nối đến máy chủ.');
      }
    } catch (error) {
      console.error('Lỗi:', error.message);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thực hiện đổi mật khẩu.');
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
            onStartShouldSetResponder={() => navigation.navigate('MeNavigator', { screen: 'SettingScreen' })}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Cập nhật mật khẩu</Text>
        </View>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: 'center', paddingVertical: 12, backgroundColor: "#DDDDDD", height: 55 }}>
          <Text style={{ fontSize: 12, marginLeft: "6%" }}>Mật khẩu phải bao gồm chữ cái, chữ số và ký tự đặc biệt.</Text>
          <Text style={{ fontSize: 12, marginLeft: "6%" }}>Không được chứa năm sinh, username và tên Zalo của bạn.</Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", marginLeft: "5%", marginTop: "5%" }}>Mật khẩu hiện tại:</Text>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <TextInput
            style={[styles.input, { borderColor: errors.currentPassword ? 'red' : '#1E90FF' }]}
            placeholder='Nhập mật khẩu hiện tại'
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            onBlur={() => setErrors(validateCurrentPassword(currentPassword))}
          />
        </View>
        {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
        <View style={{ flex: 1, top: "6%" }}></View>

        <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", marginLeft: "5%", marginTop: "5%" }}>Nhập mật khẩu:</Text>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <TextInput
            style={[styles.input, { borderColor: errors.newPassword ? 'red' : '#1E90FF' }]}
            placeholder='Nhập mật khẩu mới'
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
            onBlur={() => setErrors(validateNewPassword(newPassword))}
          />
        </View>
        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <TextInput
            style={[styles.input, { borderColor: errors.confirmPassword ? 'red' : '#1E90FF' }]}
            placeholder='Nhập lại mật khẩu mới'
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => setErrors(validateConfirmPassword(newPassword, confirmPassword))}
          />
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        <View style={{ flex: 3, top: "6%" }}></View>
        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center", paddingVertical: 6, height: 50, marginLeft: "10%", marginRight: "10%" }}>
          <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1E90FF" }} onPress={handleChangePassword}>
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
