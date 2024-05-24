import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddInforScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [errors, setErrors] = useState('');

  const validateUserName = (name) => {
    let errors = '';
    if (!name.trim()) {
      errors = 'Tên không được để trống.';
    } else if (name.length < 2 || name.length > 40) {
      errors = 'Tên phải từ 2 đến 40 kí tự.';
    }
    return errors;
  };

  const navigateToNextScreen = () => {
    const error = validateUserName(userName);
    if (error) {
      setErrors(error);
      return;
    }

    navigation.navigate("RegisterScreen", { userName: userName });
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
          />
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Tạo tài khoản</Text>
        </View>

        <View style={{ flex: 6, paddingLeft: "5%", paddingRight: "5%", top: "2%", paddingVertical: 10, height: 50 }}>
          <Text style={{ fontFamily: "Roboto", fontSize: 16, fontWeight: "bold" }}>Tên ZaloLife</Text>
          <View style={{ marginTop: 10 }}>
            <TextInput
              style={[styles.input, { borderBottomColor: errors ? 'red' : '#1E90FF' }]}
              placeholder='Gồm 2-40 kí tự'
              value={userName}
              onChangeText={text => setUserName(text)}
              onBlur={() => setErrors(validateUserName(userName))}
            />
            {errors ? <Text style={styles.errorText}>{errors}</Text> : null}
          </View>

          <Text style={{ fontFamily: "Roboto", fontSize: 16, top: "10%", fontWeight: '700' }}>Lưu ý khi đặt tên:</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 14, top: "14%", marginLeft: "6%", fontWeight: '700' }}>• Không vi phạm Quy định đặt tên trên Zalo</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 14, top: "18%", fontWeight: '700', marginLeft: "6%" }}>• Nên sử dụng tên thật để giúp bạn bè dễ nhận ra bạn</Text>
        </View>
        <View style={{ flex: 5 }}></View>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "flex-end" }}>
          <TouchableOpacity 
            style={{ borderRadius: 20, justifyContent: "center", alignItems: "center", paddingVertical: 5 }}
            onPress={navigateToNextScreen}
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
    borderBottomWidth: 1,
    fontSize: 16,
    fontFamily: "Roboto",
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
});

export default AddInforScreen;
