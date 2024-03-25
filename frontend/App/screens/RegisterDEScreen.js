import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import axios from 'axios'; // Import thư viện axios
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterDEScreen() {
  const navigation = useNavigation();
  
  return (
    <KeyboardAvoidingView style={{ flex: 2 }} behavior="padding">
      <View style={styles.container}>
        <View style={{ flex: 0.6, backgroundColor: "#0000FF" }}></View>
        <View style={{ flex: 0.9, backgroundColor: "#1E90FF",   paddingLeft: "5%", justifyContent: "center"}}>
          <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>Ngày sinh và giới tính</Text>
        </View>
        <View style={{ flex: 7}}>
          <View style={{flex: 0.2, backgroundColor: "#CFCFCF", justifyContent: "center"}}>
            <Text style={{ fontFamily: "Roboto", fontSize: 13 , fontWeight: "700", marginLeft: "5%" }}>Hãy chọn ngày sinh và giới tính của bạn</Text>
          </View>
          <View style={{flex: 3, top: "5%"}}>
            <Text style={{fontSize: 16, fontFamily: "Roboto", fontWeight: "bold", marginLeft: "5%"}} >Giới tính</Text>
            <View style={{flex: 2.5, flexDirection: "row", marginTop: "2%"}}>
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Image style={{width: "50%", height: "40%", resizeMode: "contain", }} source={require("../assets/boy.png")} />
                        <Text style={{textAlign: "center", fontFamily: "Roboto", fontSize: 16, fontWeight: "bold", marginTop: "2%"}}>Nam</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Image style={{width: "50%", height: "40%", resizeMode: "contain", marginLeft: "5%"}} source={require("../assets/girl.png")} />
                        <Text style={{textAlign: "center", fontFamily: "Roboto", fontSize: 16, fontWeight: "bold", marginTop: "2%"}}>Nữ</Text>
                    </View>
                </View>
                <View style={{flex: 0.2, backgroundColor: "#808080"}}></View>
            </View>        
        </View>
        <View style={{flex: 3, marginEnd: "10%"}}>
            <Text style={{fontSize: 16, fontFamily: "Roboto", fontWeight: "bold", marginLeft: "5%"}} >Ngày sinh</Text>
          </View>
        <View style={{ flex: 5 }}></View>
        <View style={{flex: 2, justifyContent: "center", paddingLeft: "70%" }}>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}
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