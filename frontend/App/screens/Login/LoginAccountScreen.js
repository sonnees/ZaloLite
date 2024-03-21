import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function LoginAccount() {
  let navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding">
      <View style={styles.container}>
        <View style={{ flex: 0.6, backgroundColor: "#0000FF" }}></View>
        <View style={{ flex: 0.9, backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ width: "15%", height: "40%", resizeMode: "contain" }}
            source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate("Login")}
          ></Image>
          <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>Đăng nhập</Text>
        </View>
        <View style={{ flex: 6}}>
          <View style={{flex: 0.2, backgroundColor: "#CFCFCF", justifyContent: "center"}}>
            <Text style={{ fontFamily: "Roboto", fontSize: 13 , fontWeight: "700", marginLeft: "3%" }}>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
          </View>

        
            <TextInput style={{ borderBottomWidth: 1, borderBottomColor: "#1E90FF", fontSize: 16, fontFamily: "Roboto", top: "4%", padding: 10,marginLeft: "3%", marginRight: "3%"}}></TextInput>

            <TextInput style={{ borderBottomWidth: 1, borderBottomColor: "#1E90FF", fontSize: 16, fontFamily: "Roboto", top: "4%", padding: 10,marginLeft: "3%", marginRight: "3%"}} placeholder='Mật khẩu'></TextInput>
         
          

          <Text style={{ fontFamily: "Roboto", fontSize: 16, top: "10%", fontWeight: '700' , color: "#1E90FF", marginLeft: "3%"}}>Lấy lại mật khẩu</Text>
        </View>
        <View style={{ flex: 5 }}></View>
        <View style={{flex: 2, justifyContent: "center", alignItems: "flex-end", marginRight: "-80%"}}>
        <Image
            style={{ width: "100%", height: "40%", resizeMode: "contain"}}
            source={require("../assets/right-arrow.png")}
          ></Image>

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
