import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Diary() {
  let navigation = useNavigation();
  return (
    <View style={styles.container}>
      
      <View style={{flex: 1.2, backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignContent: "space-between"}}>
      <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          {/* <Image style={{width: "100%", height: "50%", resizeMode: "contain"}} source={require("../assets/search.png")}></Image> */}
      </TouchableOpacity>
      <TextInput style={{flex: 6, borderRadius: 5, backgroundColor: "#1E90FF", height: "70%", paddingLeft: "7%", paddingRight: "7%", marginTop: 7, color: "white"}} placeholder="Tìm kiếm"></TextInput>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          {/* <Image style={{width: "100%", height: "50%", resizeMode: "contain"}} source={require("../assets/image.png")}></Image> */}
        </TouchableOpacity>
        <View style={{flex: 0.3}}></View>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          {/* <Image style={{width: "100%", height: "50%", resizeMode: "contain"}} source={require("../assets/bell.png")}></Image> */}
        </TouchableOpacity>
        <View style={{flex: 0.1}}></View>
      </View>
      <View style={{flex: 2, backgroundColor: "#FFFFFF", justifyContent: "center"}}>
        <View style={{flex: 0.75, flexDirection: "row", alignItems: "center"}} > 
          <View style={{flex: 0.1}}></View>
          {/* <Image style={{width: 50, height: 50,borderRadius: 50, resizeMode: "contain"}} source={require("../assets/avata.jpg")}></Image> */}
          <View style={{flex: 0.1}}></View>
            <Text style={{fontFamily: "Roboto", fontSize: 18, color: "#808080"}}>Hôm nay bạn như thế nào?</Text>
        </View>
      </View>
      <View style={{flex: 0.3}}></View>
      <View style={{flex: 3, backgroundColor: "#FFFFFF"}}></View>
      <View style={{flex: 0.3}}></View>

      <View style={{flex: 7.95, backgroundColor: "#FFFFFF"}}></View>
      
     
      <View style={{flex: 0.3}}></View>
      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row"}}>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          {/* <Image style={{width: "100%", height: "40%", resizeMode: "contain"}} source={require("../assets/message.png")}></Image> */}
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          {/* <Image style={{width: "100%", height: "40%", resizeMode: "contain"}} source={require("../assets/contact.png")}></Image> */}
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          {/* <Image style={{width: "100%", height: "40%", resizeMode: "contain"}} source={require("../assets/clock.png")}></Image> */}
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}
            onPress={() => navigation.navigate("Person")}
        >
          {/* <Image style={{width: "100%", height: "40%", resizeMode: "contain"}} source={require(".../")}></Image> */}
        </TouchableOpacity>
        
        
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D7D7D7",
  },
})