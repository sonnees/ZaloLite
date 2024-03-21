import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';

export default function RegisterACcountScreen() {
  let navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Use "padding" for iOS and "height" for Android
    >
      <View style={styles.container}>
      <View style={{ flex: 0.5, backgroundColor: "#0000FF" }}></View>
        <View style={{ flex: 0.6, backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ width: "15%", height: "40%", resizeMode: "contain" }}
            source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate("RegisterScreen")}
          ></Image>
          <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>Tạo tài khoản</Text>
        </View>
        <View style={{ flex: 0.6, backgroundColor: "#EEEEEE", justifyContent: "center" , }}>
            <Text style={{ fontFamily: "Roboto", fontSize: 14, fontWeight: "700", marginLeft: "3%" }}>Nhập số điện thoại của bạn để tạo tài khoản mới</Text>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#1E90FF",
              fontSize: 16,
              fontFamily: "Roboto",
              top: "4%",
              padding: 10,
              marginLeft: "3%",
              marginRight: "3%"
            }}
            placeholder='Nhập số điện thoại'
          />

          <CheckBox
            checked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
            title='Tôi đồng ý với điều khoản sử dụng của Zalo'
            containerStyle={{ marginLeft: "1%", marginTop: "3%", backgroundColor: "transparent", borderWidth: 0 }}
            textStyle={{ fontFamily: "Roboto", fontSize: 13, fontWeight: '700', color: "#1E90FF" }}
          />

          <CheckBox
            checked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
            title='Tôi đồng ý với điều khoản Mạng xã hội của Zalo'
            containerStyle={{ marginLeft: "1%", marginTop: "1%", backgroundColor: "transparent", borderWidth: 0 }}
            textStyle={{ fontFamily: "Roboto", fontSize: 13, fontWeight: '700', color: "#1E90FF" }}
          />
        </View>

         <View style={{ flex: 5 }}></View>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "flex-end", marginRight: "-80%" }}>
          <Image
            style={{ width: "100%", height: "30%", resizeMode: "contain" }}
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
