import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import PhoneNumberInput from './PhoneNumberInput'; // Import component PhoneNumberInput
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';

const RegisterScreen = () => {
  let navigation = useNavigation();
  let route = useRoute();

  // Nhận giá trị userName từ tham số được truyền qua
  const { userName } = route.params;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCheckedTerm1, setIsCheckedTerm1] = useState(false);
  const [isCheckedTerm2, setIsCheckedTerm2] = useState(false);

  const handleNext = () => {
    if (phoneNumber.trim() === '' || phoneNumber.length !== 10) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }
    
    if (!isCheckedTerm1 || !isCheckedTerm2) {
      Alert.alert('Lỗi', 'Vui lòng đồng ý với các điều khoản sử dụng.');
      return;
    }

    // Truyền userName sang màn hình tiếp theo (nếu cần)
    navigation.navigate('RegisterDEScreen', { userName: userName, phoneNumber: phoneNumber });
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
             onStartShouldSetResponder={() => navigation.navigate('LoginNavigator', { screen: 'AddInforScreen' })}
          ></Image>
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Tạo tài khoản</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, backgroundColor: "#DDDDDD", height: 45 }}>
          <Text style={{ fontSize: 14, marginLeft: "6%" }}>Nhập số điện thoại của bạn để tạo tài khoản mới m</Text>
        </View>

        <View style={{ flexDirection: "row", paddingHorizontal: 10, marginLeft: "-22%" }}> 
          {/* Sử dụng component PhoneNumberInput */}
          <PhoneNumberInput />
          <TextInput
            style={{
              marginLeft: "-20%",
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
            onChangeText={text => setPhoneNumber(text)}
          />
        </View>
      {/* <View style={{flex: 0.5}}></View> */}
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
});

export default RegisterScreen;
