import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import React from 'react'

export default function LoginScreen() {

  return (
    <View style={styles.container}>
        <View style={{flex: 0.5}}></View>
        <View style={{flex: 0.5, justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize: 40, fontWeight: "bold", color: "#0000FF",fontFamily: "Roboto"}}>ZaloLite</Text>
        </View>
        <Text style={{fontSize: 28, fontWeight: "bold", textAlign: "center",fontFamily: "Roboto"}}>Đăng nhập tài khoản</Text>
        <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: "bold",fontFamily: "Roboto"}}>QUÉT MÃ QR</Text>
            </TouchableOpacity>
            <View style={{flex: 0.5}}></View>
            <TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: "bold",fontFamily: "Roboto"}}>SỐ ĐIỆN THOẠI</Text>
            </TouchableOpacity>  
        </View>
        <View style={{flex: 1,}}>
            <TextInput style={{flex: 0.5,  borderBottomColor: "grey", borderBottomWidth: 1, borderColor: "red"}} placeholder="Số điện thoại"></TextInput>
        </View>
        <View style={{flex: 1,}}>
            <TextInput style={{flex: 0.5,  borderBottomColor: "grey", borderBottomWidth: 1, borderColor: "red"}} placeholder="Mật khẩu"></TextInput>
        </View>
        <View style={{flex: 1}}>
            <TouchableOpacity style={{flex: 0.5, backgroundColor: "#0000FF", justifyContent: "center", alignItems: "center", borderRadius: 8}}>
                <Text style={{fontSize: 20, fontWeight: "bold", color: "white"}}>Đăng nhập</Text>
            </TouchableOpacity>
            <View style={{flex: 0.3}}></View>
            <Text style={{fontSize: 15, fontFamily: "Roboto"}}>Quên mật khẩu?</Text>
        </View>
        
        <View style={{flex: 1}}></View>
        <View style={{flex: 1}}></View>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingLeft: "5%",
      paddingRight: "5%"
    },
  });