import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  let navigation = useNavigation();
  return (
    <ImageBackground
      blurRadius={0}
      style={{flex: 1}}
      source={require("../assets/cover_Image.jpg")}
    >
      <View style={{ flex: 1,flexDirection: "row",}}>
        <Image style={{width: "20%", height: "100%", resizeMode: "center", marginLeft: "5%", marginTop: "-21%", marginLeft: "-3%"}} source={require("../assets/back.png")}
          onStartShouldSetResponder={() => navigation.navigate('TabNavigator',{ screen: 'Me' })}
        ></Image>
        <View style={{flex: 1.5}}></View>
        <Image style={{width: "20%", height: "100%", resizeMode: "center", marginLeft: "5%", marginTop: "-21%"}} source={require("../assets/more.png")}
          onStartShouldSetResponder={() => navigation.navigate("InformationScreen")}
        ></Image>
      </View>
      <View style={{ flex: 2, backgroundColor: "white" }}>
        <View style={{flex: 0.15}}></View>
        <Text style={{textAlign: "center", fontFamily: "Roboto", fontSize: 20, fontWeight: "bold"}}>Lê Hữu Bằng</Text>
        <View style={{flex: 0.05}}></View>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: "17%", height: "80%", resizeMode: "center", marginLeft: "15%", marginRight: "-4%"}}
            source={require("../assets/pencil.png")}
          ></Image>
          <Text style={{fontSize: 15, fontFamily: "Roboto", color: "blue", }}>Cập nhật giới thiệu bản thân</Text>
        </View>
        <View style={{flex: 0.04}}></View>
        <View style={{flex: 0.3,justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: 100, height: 100,borderRadius: 50}} source={require("../assets/state.jpg")}></Image>
        </View>
        <View style={{flex: 0.1}}>
          <Text style={{textAlign: "center", fontFamily: "Roboto", fontSize: 15, fontWeight: "bold"}}>Hôm nay Lê Hữu Bằng có gì vui?</Text>
          <View style={{flex: 0.04}}></View>
          <Text style={{textAlign: "center", fontFamily: "Roboto", fontSize: 15, color: "#808080", paddingLeft: "5%", paddingRight: "5%"}}>Đây là Nhật ký của bạn - Hãy làm đầy Nhật ký với những dấu ấn cuộc đời và kỹ niệm đáng nhớ nhé!</Text>
        </View>
        <View style={{flex: 0.1}}></View>
        <View style={{flex: 0.3}}>
          <TouchableOpacity style={{backgroundColor: "#0000FF", borderRadius: 20, width: "50%", height: "30%", marginLeft: "25%", marginRight: "10%", justifyContent: "center", alignItems: "center"}}>
            <Text style={{color: "white", fontFamily: "Roboto", fontSize: 15, fontWeight: "bold"}}>Đăng lên Nhật ký</Text>
          </TouchableOpacity>
        </View>  
      </View>
      <View
        style={{
          position: "absolute",
          top: "25%",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Image
          style={{ width: 100, height: 100, borderRadius: 50 }}
          source={require("../assets/avata.jpg")}
        ></Image>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
});
