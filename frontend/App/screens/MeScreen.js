import React, { useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Thêm useRoute vào đây
import Icon from 'react-native-vector-icons/AntDesign';

export default function MeScreen() {
  const navigation = useNavigation();
  

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 48 }}>
        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 14 }}>
          <Icon name='search1' size={22} color={'white'} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 7, borderRadius: 5, backgroundColor: "transparent", height: 40, width: 300, justifyContent: "center", alignItems: "flex-start" }}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <Text style={{ marginLeft: 20, fontSize: 15.5, color: "#CCCCCC" }}>Search</Text>
        </TouchableOpacity>


        <View style={{ flexDirection: 'row', width: 80 }}>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", marginRight: 12 }}
            onPress={() => navigation.navigate('MeNavigator', { screen: 'SettingScreen' })}
          >
            <Icon name='setting' size={23} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center"}}>
        <TouchableOpacity style={{ flex: 0.75, flexDirection: "row" }}
          onPress={() => navigation.navigate('MeNavigator', { screen: 'ProfileScreen' })}
        >
          <View style={{ flex: 0.1 }}></View>
          <Image style={{ width: 50, height: 50, borderRadius: 50, resizeMode: "contain" ,marginLeft: "5%" }} source={require("../assets/avata.jpg")}></Image>
          <View style={{ marginLeft: "7%" }}></View>
          <View style={{ justifyContent: "center" }}>
            <Text style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold" }}>Lê Hữu Bằng</Text>
            <Text style={{ fontFamily: "Roboto", fontSize: 15, color: "#808080" }}>Xem trang cá nhân</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, alignItems: "flex-end", marginRight: "5%"}}
          onPress={() => navigation.navigate('MeNavigator', { screen: 'SwitchAccountScreen' })}
        >
          <Image style={{ width: 28, height: 28, resizeMode: "contain" }} source={require("../assets/transfer.png")} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 0.2 }}></View>

      <View style={{ flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 0.01 }}></View>
        <Image style={{ width: "15%", height: "40%", resizeMode: "contain" }} source={require("../assets/musical.png")}></Image>
        <View style={{ flex: 0.05 }}></View>
        <View style={{ justifyContent: "center" }}
           onStartShouldSetResponder={() => navigation.navigate('LoginNavigator', { screen: 'OtpScreen' })}
        >
          <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Nhạc chờ Zalo</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 13, color: "#808080" }}>Đăng ký nhạc chờ, thể hiện cá tính</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={{ flex: 0.05 }}></View>
      <View style={{ flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 0.01 }}></View>
        <Image style={{ width: "15%", height: "40%", resizeMode: "contain" }} source={require("../assets/wallet.png")}></Image>
        <View style={{ flex: 0.05 }}></View>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Ví QR</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 13, color: "#808080" }}>Lưu trữ và xuất trình các mã QR quan trọng</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={{ flex: 0.05 }}></View>
      <View style={{ flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 0.01 }}></View>
        <Image style={{ width: "15%", height: "40%", resizeMode: "contain" }} source={require("../assets/cloud.png")}></Image>
        <View style={{ flex: 0.01 }}></View>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Cloud của tôi</Text>
        </View>
        <View style={{ flex: 1 }}></View>
        <Image style={{ width: "15%", height: "20%", resizeMode: "contain" }} source={require("../assets/next.png")}></Image>
      </View>

      <View style={{ flex: 0.2 }}></View>
      <View style={{ flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 0.01 }}></View>
        <Image style={{ width: "15%", height: "40%", resizeMode: "contain" }} source={require("../assets/pie.png")}></Image>
        <View style={{ flex: 0.01 }}></View>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Dung lượng và dữ liệu</Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 13, color: "#808080" }}>Quản lý dung lượng và dữ liệu</Text>
        </View>
        <View style={{ flex: 1 }}></View>
        <Image style={{ width: "15%", height: "20%", resizeMode: "contain" }} source={require("../assets/next.png")}></Image>
      </View>

      <View style={{ flex: 0.2 }}></View>
      <View style={{ flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 0.01 }}></View>
        <Image style={{ width: "15%", height: "40%", resizeMode: "contain" }} source={require("../assets/shield.png")}></Image>
        <View style={{ flex: 0.01 }}></View>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Tài khoản và bảo mật</Text>
        </View>
        <View style={{ flex: 1 }}></View>
        <Image style={{ width: "15%", height: "20%", resizeMode: "contain" }} source={require("../assets/next.png")}></Image>
      </View>
      <View style={{ flex: 0.05 }}></View>
      <View style={{ flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 0.01 }}></View>
        <Image style={{ width: "15%", height: "40%", resizeMode: "contain" }} source={require("../assets/lock.png")}></Image>
        <View style={{ flex: 0.01 }}></View>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Quyền riêng tư</Text>
        </View>
        <View style={{ flex: 1 }}></View>
        <Image style={{ width: "15%", height: "20%", resizeMode: "contain" }} source={require("../assets/next.png")}></Image>
      </View>

      <View style={{ flex: 3 }}></View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D7D7D7",

  },
})
