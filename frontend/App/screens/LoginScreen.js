import React, { useState, useEffect, useContext } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalContext';
import { API_AUTHENTICATE, API_INFOR_ACCOUNT, API_INFOR_USER, API_PROFILE_BY_USERID, API_CHECKPHONE } from '../api/Api';
import { AddListChatID } from '../utils/AddListChatID';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const newPassword = route.params?.newPassword;
  const isFocused = useIsFocused();
  const { logIn, setMyUserInfo, listChatID, setListChatID, setMyProfile } = useContext(GlobalContext);

  useEffect(() => {
    if (newPassword && isFocused) {
      setPassword(newPassword);
    }
  }, [newPassword, isFocused]);

  const validatePhoneNumber = (phoneNumber) => {
    const errors = {};
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneNumber) {
      errors.phoneNumber = 'Số điện thoại không được để trống.';
    } else if (!phoneRegex.test(phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại phải đủ 10 chữ số và chỉ chứa số.';
    } else if (!phoneNumber.startsWith('0')) {
      errors.phoneNumber = 'Số điện thoại phải bắt đầu bằng số 0.';
    }
    return errors;
  };

  const validatePassword = (password) => {
    const errors = {};
    if (!password) {
      errors.password = 'Mật khẩu không được để trống.';
    }
    return errors;
  };

  const handleLogin = async () => {
    const phoneErrors = validatePhoneNumber(phoneNumber);
    const passwordErrors = validatePassword(password);

    if (Object.keys(phoneErrors).length > 0 || Object.keys(passwordErrors).length > 0) {
      setErrors({ ...phoneErrors, ...passwordErrors });
      return;
    }

    try {
      const phoneCheckResponse = await fetch(`${API_CHECKPHONE}${phoneNumber}`);
      if (phoneCheckResponse.status === 200) {
        setErrors({ phoneNumber: 'Số điện thoại chưa được đăng ký.' });
        return;
      }

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
        logIn(data.field);
        await AsyncStorage.setItem('phoneNumber', phoneNumber);

        const getToken = async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            return token;
          } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
            return null;
          }
        };

        const token = await getToken();
        const dataUserInfor = await fetchUserInfo(token);
        const myProfile = await fetchProfileInfo(dataUserInfor.id, token);
        setMyProfile(myProfile);
        navigation.navigate('TabNavigator');
      } else {
        setErrors({ password: 'Mật khẩu không chính xác.' });
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
    }
  };

  const fetchUserInfo = async (token) => {
    try {
      const accountInfor = await fetAccountInfor(token);
      const user = accountInfor.profile.userID;
      const response = await axios.get(`${API_INFOR_USER}${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataUserInfor = await response.data;

      setMyUserInfo(dataUserInfor);
      const listID = AddListChatID(dataUserInfor.conversations);
      setListChatID(listID);
      return dataUserInfor;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin User:', error);
      return null;
    }
  };

  const fetAccountInfor = async (token) => {
    try {
      const response = await axios.get(API_INFOR_ACCOUNT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataAccountInfor = await response.data;
      return dataAccountInfor;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin cá nhân:', error);
      return null;
    }
  };

  const fetchProfileInfo = async (userID, token) => {
    try {
      const response = await axios.get(`${API_PROFILE_BY_USERID}${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status !== 404) {
          return {
            status: error.response.status,
            message: 'Lỗi khi lấy thông tin cá nhân',
          };
        }
        return {
          status: 404,
          message: 'Không tìm thấy thông tin cá nhân',
        };
      } else {
        return {
          status: -1,
          message: 'Lỗi kết nối máy chủ',
        };
      }
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
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Đăng nhập</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, backgroundColor: "#DDDDDD", height: 45 }}>
          <Text style={{ fontSize: 14, marginLeft: "6%" }}>Vui lòng nhập số tài khoản và mật khẩu để đăng nhập n</Text>
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
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <TextInput
            style={[styles.input, { borderColor: errors.password ? 'red' : '#1E90FF' }]}
            placeholder='Mật khẩu'
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            onBlur={() => setErrors(validatePassword(password))}
          />
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <Text style={{ fontSize: 15, marginLeft: "5%", marginTop: "15%", fontFamily: "Roboto", color: "#1E90FF", fontWeight: "bold" }}
          onPress={() => navigation.navigate('CreatePasswordWhenForgotScreen')}
        >
          Lấy lại mật khẩu
        </Text>
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

export default LoginScreen;
