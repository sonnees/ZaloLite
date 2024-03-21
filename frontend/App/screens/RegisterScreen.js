import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  let navigation = useNavigation();

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
          <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>Tạo tài khoản</Text>
        </View>
        <View style={{ flex: 6, paddingLeft: "5%", paddingRight: "5%", top: "2%" }}>
          <Text style={{ fontFamily: "Roboto", fontSize: 16, fontWeight: "bold" }}>Tên ZaloLife</Text>
          <TextInput style={{ borderBottomWidth: 1, borderBottomColor: "#1E90FF", fontSize: 16, fontFamily: "Roboto", top: "4%", padding: 10}} placeholder='Gồm 2-40 kí tự'></TextInput>

          <Text style={{ fontFamily: "Roboto", fontSize: 16, top: "10%", fontWeight: '700' }}>Lưu ý khi đặt tên:</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 14, top: "14%", marginLeft: "6%", fontWeight: '700' }}>• Không vi phạm Quy định đặt tên trên zalo</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 14, top: "18%", fontWeight: '700', marginLeft: "6%" }}>• Nên sử dụng tên thật để giúp bạn bè dễ nhận ra bạn</Text>
        </View>
        <View style={{ flex: 5 }}></View>
        <View style={{flex: 2, justifyContent: "center", alignItems: "flex-end", marginRight: "-80%"}}>
        <Image
            style={{ width: "100%", height: "40%", resizeMode: "contain"}}
            source={require("../assets/right-arrow.png")}
            onStartShouldSetResponder={() => navigation.navigate("RegisterACcountScreen")}
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
