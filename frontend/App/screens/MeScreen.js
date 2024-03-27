import { Platform, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { StatusBar } from 'react-native';
import Navbar from '../layout/Navbar';

export default function MeScreen() {
  let navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <Navbar type={'MeScreen'}></Navbar>
      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center",}}>
        <View style={{flex: 0.75, flexDirection: "row"}} 
          onStartShouldSetResponder={() => navigation.navigate('MeNavigator', { screen: 'ProfileScreen' })}
        > 
          <View style={{flex: 0.1}}></View>
          <Image style={{width: 50, height: 50,borderRadius: 50, resizeMode: "contain"}} source={require("../assets/avata.jpg")}></Image>
          <View style={{flex: 0.2}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 18, fontWeight: "bold" }}>Lê Hữu Bằng</Text>
            <Text style={{fontFamily: "Roboto", fontSize: 15, color: "#808080"}}>Xem trang cá nhân</Text>
          </View>
        </View>
        <Image style={{width: "10%", height: 28, resizeMode: "contain", marginRight: -100}} source={require("../assets/transfer.png")}
           onStartShouldSetResponder={() => navigation.navigate('MeNavigator', { screen: 'SwitchAccountScreen' })}
        ></Image>
      </View>
      <View style={{flex: 0.2}}></View>

      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <View style={{flex: 0.01}}></View>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/musical.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}
            
          >
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Nhạc chờ Zalo</Text>
            <Text style={{fontFamily: "Roboto", fontSize: 13, color: "#808080"}}>Đăng ký nhạc chờ, thể hiện cá tính</Text>
          </View>
          <View style={{flex: 1}}></View>
      </View>
      <View style={{flex: 0.05}}></View>
      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <View style={{flex: 0.01}}></View>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/wallet.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Ví QR</Text>
            <Text style={{fontFamily: "Roboto", fontSize: 13, color: "#808080"}}>Lưu trữ và xuất trình các mã QR quan trọng</Text>
          </View>
          <View style={{flex: 1}}></View>
      </View>
      <View style={{flex: 0.05}}></View>
      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <View style={{flex: 0.01}}></View>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/cloud.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Cloud của tôi</Text>
          </View>
          <View style={{flex: 1}}></View>
          <Image style={{width: "15%", height: "20%", resizeMode: "contain"}} source={require("../assets/next.png")}></Image>
      </View>

      <View style={{flex: 0.2}}></View>
      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <View style={{flex: 0.01}}></View>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/pie.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Dung lượng và dữ liệu</Text>
            <Text style={{fontFamily: "Roboto", fontSize: 13, color: "#808080"}}>Quản lý dung lượng và dữ liệu</Text>

          </View>
          <View style={{flex: 1}}></View>
          <Image style={{width: "15%", height: "20%", resizeMode: "contain"}} source={require("../assets/next.png")}></Image>
      </View>

      <View style={{flex: 0.2}}></View>
      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <View style={{flex: 0.01}}></View>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/shield.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Tài khoản và bảo mật</Text>
          </View>
          <View style={{flex: 1}}></View>
          <Image style={{width: "15%", height: "20%", resizeMode: "contain"}} source={require("../assets/next.png")}></Image>
      </View>
      <View style={{flex: 0.05}}></View>
      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <View style={{flex: 0.01}}></View>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/lock.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Quyền riêng tư</Text>
          </View>
          <View style={{flex: 1}}></View>
          <Image style={{width: "15%", height: "20%", resizeMode: "contain"}} source={require("../assets/next.png")}></Image>
      </View>

      <View style={{flex: 3}}></View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D7D7D7",

  },
})
