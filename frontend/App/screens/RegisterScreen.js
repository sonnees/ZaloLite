import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import PhoneNumberInput from './PhoneNumberInput'; // Import component PhoneNumberInput
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { API_CHECKPHONE } from '../api/Api';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Nhận giá trị userName từ tham số được truyền qua
  const { userName } = route.params;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCheckedTerm1, setIsCheckedTerm1] = useState(false);
  const [isCheckedTerm2, setIsCheckedTerm2] = useState(false);
  const [errors, setErrors] = useState('');

  const validatePhoneNumber = (number) => {
    let errors = '';
    const phoneRegex = /^0[0-9]{9}$/;

    if (!number.trim()) {
      errors = 'Số điện thoại không được để trống.';
    } else if (!phoneRegex.test(number)) {
      errors = 'Số điện thoại phải bắt đầu bằng số 0 và đúng 10 chữ số.';
    }

    return errors;
  };

  const checkPhoneNumber = async () => {
    try {
      const response = await fetch(`${API_CHECKPHONE}${phoneNumber}`);
      const status = response.status; // Lấy mã trạng thái của phản hồi

      if (status === 409) {
        // Số điện thoại đã được đăng ký
        Alert.alert('Thông báo', 'Số điện thoại đã được đăng ký. Vui lòng sử dụng số điện thoại khác.');
      } else if (status === 200) {
        // Số điện thoại chưa được đăng ký
        navigation.navigate('RegisterDEScreen', { userName: userName, phoneNumber: phoneNumber });
      } else {
        // Xử lý các trường hợp khác nếu cần
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi kiểm tra số điện thoại.');
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra số điện thoại:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi kiểm tra số điện thoại.');
    }
  };

  const handleNext = () => {
    const phoneErrors = validatePhoneNumber(phoneNumber);

    if (phoneErrors) {
      setErrors(phoneErrors);
      return;
    }

    if (!isCheckedTerm1 || !isCheckedTerm2) {
      Alert.alert('Lỗi', 'Vui lòng đồng ý với các điều khoản sử dụng.');
      return;
    }

    // Gọi hàm kiểm tra số điện thoại
    checkPhoneNumber();
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
            onStartShouldSetResponder={() => navigation.navigate('LoginNavigator', { screen: 'AddInforScreen' })}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Tạo tài khoản</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, backgroundColor: "#DDDDDD", height: 45 }}>
          <Text style={{ fontSize: 14, marginLeft: "6%" }}>Nhập số điện thoại của bạn để tạo tài khoản mới</Text>
        </View>

        <View style={{ flexDirection: "row", paddingHorizontal: 10, marginLeft: "-22%" }}>
          {/* Sử dụng component PhoneNumberInput */}
          <PhoneNumberInput />
          <TextInput
            style={{
              marginLeft: "-20%",
              marginRight: "5%",
              borderBottomWidth: 1,
              borderBottomColor: errors ? 'red' : '#1E90FF',
              fontSize: 16,
              fontFamily: "Roboto",
              top: "4%",
              padding: 10,
              flex: 1 // Đảm bảo TextInput chiếm hết không gian còn lại của row
            }}
            placeholder='Nhập số điện thoại'
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            onBlur={() => setErrors(validatePhoneNumber(phoneNumber))}
          />
        </View>
        {errors ? <Text style={styles.errorText}>{errors}</Text> : null}
        <CheckBox
          checked={isCheckedTerm1}
          onPress={() => setIsCheckedTerm1(!isCheckedTerm1)}
          title='Tôi đồng ý với điều khoản sử dụng của Zalo'
          containerStyle={{ marginLeft: "3%", marginTop: "10%", backgroundColor: "transparent", borderWidth: 0 }}
          textStyle={{ fontFamily: "Roboto", fontSize: 13, fontWeight: '700', color: "#1E90FF" }}
        />
        <CheckBox
          checked={isCheckedTerm2}
          onPress={() => setIsCheckedTerm2(!isCheckedTerm2)}
          title='Tôi đồng ý với điều khoản Mạng xã hội của Zalo'
          containerStyle={{ marginLeft: "3%", marginTop: "0%", backgroundColor: "transparent", borderWidth: 0 }}
          textStyle={{ fontFamily: "Roboto", fontSize: 13, fontWeight: '700', color: "#1E90FF" }}
        />
        <View style={{ flex: 5 }}></View>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "flex-end" }}>
          <TouchableOpacity
            style={{ borderRadius: 20, justifyContent: "center", alignItems: "center", paddingVertical: 5 }}
            onPress={handleNext}
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
  errorText: {
    color: 'red',
    marginLeft: 100,
    marginTop: 30,
    fontSize: 14,
  },
});

export default RegisterScreen;
