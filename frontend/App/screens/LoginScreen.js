import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import axios from 'axios'; // Import thư viện axios
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/v1/auth/authenticate', {
        phoneNumber: phoneNumber,
        password: password
      });
      
     
      console.log(response.data); 
      navigation.navigate('TabNavigator'); 
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      // Alert.alert('Đăng nhập thất bại', 'Vui lòng kiểm tra lại số điện thoại và mật khẩu');
    }
  };
  
  return (
    <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding">
      <View style={styles.container}>
        <View style={{ flex: 0.6, backgroundColor: "#0000FF" }}></View>
        <View style={{ flex: 0.9, backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ width: "15%", height: "40%", resizeMode: "contain" }}
            source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate("SlashScreen")}
          ></Image>
          <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>Đăng nhập</Text>
        </View>
        <View style={{ flex: 6}}>
          <View style={{flex: 0.2, backgroundColor: "#CFCFCF", justifyContent: "center"}}>
            <Text style={{ fontFamily: "Roboto", fontSize: 13 , fontWeight: "700", marginLeft: "3%" }}>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
          </View>

          <TextInput
            style={{ borderBottomWidth: 1, borderBottomColor: "#1E90FF", fontSize: 16, fontFamily: "Roboto", top: "4%", padding: 10,marginLeft: "3%", marginRight: "3%" }}
            placeholder='Số điện thoại'
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
          />

          <TextInput
            style={{ borderBottomWidth: 1, borderBottomColor: "#1E90FF", fontSize: 16, fontFamily: "Roboto", top: "4%", padding: 10,marginLeft: "3%", marginRight: "3%" }}
            placeholder='Mật khẩu'
            secureTextEntry={true}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <View style={{flex: 0.1}}></View>
          <TouchableOpacity>
            <Text style={{ fontFamily: "Roboto", fontSize: 16, top: "10%", fontWeight: '700' , color: "#1E90FF", marginLeft: "3%"}}>Lấy lại mật khẩu</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 5 }}></View>
        <View style={{flex: 2, justifyContent: "center", paddingLeft: "70%" }}>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}
          onPress={handleLogin}
        >
          <Image style={{width: "100%", height: "50%", resizeMode: "contain"}} source={require("../assets/right-arrow.png")}></Image>
        </TouchableOpacity>
          
        
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
