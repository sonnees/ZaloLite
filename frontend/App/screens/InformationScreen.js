import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { GlobalContext } from '../context/GlobalContext';

export default function InformationScreen() {
  let navigation = useNavigation();
  const {myProfile} = useContext(GlobalContext)
  return (
    <View style={styles.container}>
      
      <View style={{flex: 1.2, backgroundColor: "#1E90FF", flexDirection: "row",  alignItems:"center"}}>
        <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate("ProfileScreen")}
        ></Image>
        <Text style={{fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color:"white"}}>{myProfile.userName}</Text>
      </View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF",justifyContent:"center",  paddingLeft: "5%",}}>
        <TouchableOpacity onPress={() => navigation.navigate("InformationDetailScreen")}>
          <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Roboto"}}
          >Thông tin</Text>
        </TouchableOpacity>
        
      </View>
      <View style={{flex: 0.05}}></View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF",justifyContent:"center",  paddingLeft: "5%",}}>
        <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Roboto"}}>Đổi ảnh đại diện</Text>
      </View>
      <View style={{flex: 0.05}}></View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF",justifyContent:"center",  paddingLeft: "5%",}}>
        <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Roboto"}}>Đổi ảnh bìa</Text>
      </View>
      <View style={{flex: 0.05}}></View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF",justifyContent:"center",  paddingLeft: "5%",}}>
        <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Roboto"}}>Cập nhật giới thiệu bản thân</Text>
      </View>
      <View style={{flex: 0.05}}></View>
      <View style={{flex: 1, backgroundColor: "#FFFFFF",justifyContent:"center",  paddingLeft: "5%",}}>
        <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Roboto"}}>Ví của tôi</Text>
      </View>
      <View style={{flex: 0.3}}></View>
  
      <View style={{flex: 5.15, backgroundColor: "#FFFFFF"}}>
        <View style={{flex: 2, justifyContent:"center"}}>
            <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Roboto",paddingLeft: "5%",color:"blue"}}>Cài đặt</Text>
            <View style={{flex: 0.3}}></View>
            <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Roboto",paddingLeft: "5%"}}>Mã QR của tôi</Text>
        </View> 
        <View style={{flex: 0.05, backgroundColor:"#D7D7D7"}}></View>
        <View style={{flex: 1, backgroundColor: "#FFFFFF",justifyContent:"center",  paddingLeft: "5%",}}>
            <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Roboto"}}>Quyền riêng tư</Text>
        </View>
        <View style={{flex: 0.05, backgroundColor:"#D7D7D7"}}></View>
        <View style={{flex: 1, backgroundColor: "#FFFFFF",justifyContent:"center",  paddingLeft: "5%",}}>
            <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Roboto"}}>Quyền quản lý tài khoản</Text>
        </View>
        <View style={{flex: 0.05, backgroundColor:"#D7D7D7"}}></View>
        <View style={{flex: 1, backgroundColor: "#FFFFFF",justifyContent:"center",  paddingLeft: "5%",}}>
            <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Roboto"}}>Cài đặt chung</Text>
        </View>
      </View>
      <View style={{flex: 5.05,backgroundColor: "#FFFFFF"}}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D7D7D7",
  },
})