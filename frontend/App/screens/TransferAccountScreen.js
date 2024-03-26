import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function TransferAccountScreen() {
  let navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{flex: 0.5, backgroundColor: "#0000FF", paddingVertical: 10}}></View>
     <View style={{flex: 0.5, backgroundColor: "#0000FF", paddingVertical: 10}}></View>
      <View style={{flex: 1.2, backgroundColor: "#1E90FF", flexDirection: "row",  alignItems:"center"}}>
        <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate("MeScreen")}
        ></Image>
        <Text style={{fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color:"white"}}>Chuyển tài khoản</Text>
      </View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", backgroundColor: "#D7D7D7"}}>
        <Text style={{fontSize: 13, fontWeight: "bold", fontFamily: "Roboto"}}>Thêm tài khoản để đăng nhập nhanh.</Text>
      </View>

     <View style={{flex: 3.5, backgroundColor: "#FFFFFF"}}>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center"}}>
            <View style={{flex: 0.75, flexDirection: "row"}}> 
                <View style={{flex: 0.1}}></View>
                <Image style={{width: 50, height: 50,borderRadius: 50, resizeMode: "contain"}} source={require("../assets/avata.jpg")}></Image>
                <View style={{flex: 0.2}}></View>
                <View style={{justifyContent: "center"}}>
                    <Text style={{fontFamily: "Roboto", fontSize: 18, fontWeight: "bold" }}>Lê Hữu Bằng</Text>
                </View>
            </View>
            <View style={{flex: 0.1}}></View>
            <Text style={{fontSize: 13, fontWeight: "bold", fontFamily: "Roboto", color: "#808080"}}>Đã đăng nhập</Text>
        </View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center"}}>
            <View style={{flex: 0.75, flexDirection: "row"}}> 
                <View style={{flex: 0.1}}></View>
                <Image style={{width: 50, height: 50,borderRadius: 60, resizeMode: "contain"}} source={require("../assets/plus.png")}></Image>
                <View style={{flex: 0.1}}></View>
                <View style={{justifyContent: "center"}}>
                    <Text style={{fontFamily: "Roboto", fontSize: 18, fontWeight: "bold" }}>Thêm tài khoản</Text>
                </View>
            </View>
            <View style={{flex: 0.1}}></View>
        </View>

    </View>
      
      <View style={{flex: 10.25, backgroundColor: "#D7D7D7"}}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D7D7D7",
  },
})