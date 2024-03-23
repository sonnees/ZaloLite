import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ConfirmQRScreen({ device, time, location }) {
  let navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}></View>
      <View style={{flex: 2}}>
        <Image style={{width: "100%", height: "100%", resizeMode: "contain"}} source={require("../assets/confirmQR.jpg")}></Image>
      </View>
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text style={{ fontSize: 20, fontFamily: "Roboto", fontWeight: "bold"}}>Đăng nhập ZaloLife bằng mã QR?</Text>
      </View>
      <View style={{flex: 1, flexDirection: "row", paddingLeft: "6%"}}>
          <Text style={{fontSize: 15, color: "#808080", fontFamily: "Roboto"}}>Thiết bị:</Text>
          <Text style={{fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", marginLeft: 50}}>{device}</Text>
      </View>
      <View style={{flex: 1, flexDirection: "row", paddingLeft: "6%"}}>
          <Text style={{fontSize: 15, color: "#808080", fontFamily: "Roboto"}}>Thời gian:</Text>
          <Text style={{fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", marginLeft: 50}}>{time}</Text>
      </View>
      <View style={{flex: 1, flexDirection: "row", paddingLeft: "6%"}}>
          <Text style={{fontSize: 15, color: "#808080", fontFamily: "Roboto"}}>Địa điểm:</Text>
          <Text style={{fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", marginLeft: 50}}>{location}</Text>
      </View>
      <Text style={{fontSize: 15,  fontFamily: "Roboto", paddingLeft: "6%"}}>Bạn sẽ được yêu cầu xác thực sinh trắc học để bảo vệ tài khoản</Text>
      <View style={{flex: 4.9}}></View>
      <View style={{flex: 2.1, alignItems: "center", justifyContent: "center"}}>
        <TouchableOpacity style={{backgroundColor: "#0000FF", width: "90%", height: "40%", borderRadius: 40, justifyContent: "center", alignItems: "center", marginLeft: "5%"}}
           onPress={() => navigation.navigate('TabNavigator',{ screen: 'Messages' })}
        >
          <Text style={{color: "#fff", fontSize: 18, fontFamily: "Roboto", fontWeight: "bold"}}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor: "#C0C0C0", width: "90%", height: "40%", borderRadius: 40, justifyContent: "center", alignItems: "center", marginLeft: "5%", marginTop: "3%", marginBottom: "5%"}}>
          <Text style={{ fontSize: 18, fontFamily: "Roboto", fontWeight: "bold"}}>Từ chối</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    }
});
