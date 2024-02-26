import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function TranferAccount() {
  let navigation = useNavigation();
  return (
    <View style={styles.container}>
      
      <View style={{flex: 1.2, backgroundColor: "#1E90FF", flexDirection: "row",  alignItems:"center"}}>
        <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate("Person")}
        ></Image>
        <Text style={{fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color:"white"}}>Cài đặt</Text>
      </View>
      <View style={{flex: 15.75}}>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "center", }} source={require("../assets/shield.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Tài khoản và bảo mật</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "5%", height: "10%", resizeMode: "center"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>

        //
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "center", }} source={require("../assets/lock.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Quyền riêng tư</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "5%", height: "10%", resizeMode: "center"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.05}}></View>

        //
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "center", }} source={require("../assets/pie.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Dung lượng và dữ liệu</Text>
            <Text style={{fontFamily: "Roboto", fontSize: 13, color: "#808080"}}>Quản lý dữ liệu Zalo của bạn</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "5%", height: "10%", resizeMode: "center"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>

        //
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "center"}} source={require("../assets/pie.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Sao lưu và khôi phục</Text>
            <Text style={{fontFamily: "Roboto", fontSize: 13, color: "#808080"}}>Bảo vệ tin nhắn khi đổi máy hoặc cài lại Zalo</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "5%", height: "10%", resizeMode: "center"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>
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