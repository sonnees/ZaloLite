import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddInforScreen = () => {
  let navigation = useNavigation();
  const [userName, setUserName] = useState(''); 

  const navigateToNextScreen = () => {
    if (userName.trim() !== '') {
      navigation.navigate("RegisterScreen", { userName: userName });
    } else {
      // Hiển thị cảnh báo khi userName không được nhập
      alert("Vui lòng nhập tên ZaloLife của bạn");
    }
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
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Tạo tài khoản</Text>
        </View>

        <View style={{ flex: 6, paddingLeft: "5%", paddingRight: "5%", top: "2%", paddingVertical: 10, height: 50 }}>
          <Text style={{ fontFamily: "Roboto", fontSize: 16, fontWeight: "bold" }}>Tên ZaloLife</Text>
          <TextInput
            style={{ borderBottomWidth: 1, borderBottomColor: "#1E90FF", fontSize: 16, fontFamily: "Roboto", top: "4%", padding: 10 }}
            placeholder='Gồm 2-40 kí tự'
            value={userName}
            onChangeText={text => setUserName(text)} 
          />
          
          <Text style={{ fontFamily: "Roboto", fontSize: 16, top: "10%", fontWeight: '700' }}>Lưu ý khi đặt tên:</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 14, top: "14%", marginLeft: "6%", fontWeight: '700' }}>• Không vi phạm Quy định đặt tên trên Zalo</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 14, top: "18%", fontWeight: '700', marginLeft: "6%" }}>• Nên sử dụng tên thật để giúp bạn bè dễ nhận ra bạn</Text>
        </View>
        <View style={{ flex: 5 }}></View>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "flex-end" }}>
          <TouchableOpacity 
            style={{ borderRadius: 20, justifyContent: "center", alignItems: "center", paddingVertical: 5 }}
            onPress={navigateToNextScreen} // Sử dụng hàm navigateToNextScreen thay vì trực tiếp gọi navigation.navigate
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

export default AddInforScreen;
