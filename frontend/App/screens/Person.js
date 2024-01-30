import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Person() {
  let navigation = useNavigation();
  return (
    <View style={styles.container}>
      
      <View style={{flex: 1, backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignContent: "space-between"}}>
      <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "100%", height: "50%", resizeMode: "contain"}} source={require("../assets/search.png")}></Image>
      </TouchableOpacity>
      <TextInput style={{flex: 7, borderRadius: 5, backgroundColor: "#1E90FF", height: "70%", paddingLeft: "7%", paddingRight: "7%", marginTop: 7, color: "white"}} placeholder="Tìm kiếm"></TextInput>
      <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "100%", height: "50%", resizeMode: "contain"}} source={require("../assets/settings.png")}></Image>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center"}}>
        <View style={{flex: 0.75, flexDirection: "row"}} 
          onStartShouldSetResponder={() => navigation.navigate("Profile")}
        > 
          <View style={{flex: 0.1}}></View>
          <Image style={{width: 50, height: 50,borderRadius: 50, resizeMode: "contain"}} source={require("../assets/avata.jpg")}></Image>
          <View style={{flex: 0.2}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 18, fontWeight: "bold" }}>Lê Hữu Bằng</Text>
            <Text style={{fontFamily: "Roboto", fontSize: 15, color: "#808080"}}>Xem trang cá nhân</Text>
          </View>
        </View>
        <Image style={{width: "10%", height: 28, resizeMode: "contain", marginRight: -85}} source={require("../assets/transfer.png")}></Image>
      </View>
      <View style={{flex: 0.3}}></View>

      <View style={{flex: 1, backgroundColor: "#FFFFFF"}}></View>
      <View style={{flex: 0.1}}></View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF"}}></View>
      <View style={{flex: 0.1}}></View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF"}}></View>

      <View style={{flex: 0.3}}></View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF"}}></View>

      <View style={{flex: 0.3}}></View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF"}}></View>
      <View style={{flex: 0.1}}></View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF"}}></View>

      <View style={{flex: 4}}></View>
      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row"}}>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "100%", height: "40%", resizeMode: "contain"}} source={require("../assets/message.png")}></Image>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "100%", height: "40%", resizeMode: "contain"}} source={require("../assets/contact.png")}></Image>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "100%", height: "40%", resizeMode: "contain"}} source={require("../assets/clock.png")}></Image>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "100%", height: "40%", resizeMode: "contain"}} source={require("../assets/user.png")}></Image>
        </TouchableOpacity>
        
        
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
})