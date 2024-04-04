import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const CreatePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
  try {
    // Lấy token từ AsyncStorage
    const token = await AsyncStorage.getItem('token');
    console.log('token:', token);
    
    // Kiểm tra xem mật khẩu hiện tại có được nhập vào không
    if (!currentPassword || !currentPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    // Validate passwords
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
  
    const response = await fetch('http://192.168.1.10:8081/api/v1/account/change-password', {
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
      // Quá trình đổi mật khẩu thành công
      // Hiển thị thông báo thành công ở đây
      Alert.alert('Thành công', 'Đổi mật khẩu thành công.');
    
      // Đăng xuất tài khoản khi mật khẩu thay đổi (tùy thuộc vào logic ứng dụng của bạn)
      // Ví dụ: AsyncStorage.removeItem('token');
    } else if (response.status === 403 || response.status === 401) {
      // Trường hợp token sai hoặc mật khẩu hiện tại sai
      // Hiển thị thông báo lỗi tại đây
      Alert.alert('Lỗi', 'Mật khẩu hiện tại không đúng.');
    } else {
      // Xử lý trường hợp lỗi khác
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
          ></Image>
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Cập nhật mật khẩu</Text>
        </View>
        <View style={{ flexDirection: "column", alignItems: "center",justifyContent: 'center', paddingVertical: 12, backgroundColor: "#DDDDDD", height: 55 }}>
          <Text style={{ fontSize: 12, marginLeft: "6%" }}>Mật khẩu phải bao gồm chữ cái và số Không được </Text>
          <Text style={{ fontSize: 12, marginLeft: "6%" }}>chứa năm sinh, username và tên Zalo của bạn </Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", marginLeft: "5%", marginTop: "5%" }}>Mật khẩu hiện tại:</Text>
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
            placeholder='Nhập mật khẩu hiện tại'
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />       
        </View>
        <View style={{ flex: 1,  top: "6%"}}></View>

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
            value={newPassword}
            onChangeText={setNewPassword}
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
        <View style={{ flex: 3,  top: "6%"}}></View>
        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center", paddingVertical: 6, height: 50, marginLeft: "10%", marginRight: "10%"}}>
          <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1E90FF"}} onPress={handleChangePassword}>
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
