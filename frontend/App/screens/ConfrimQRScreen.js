import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function ConfirmQRScreen({route}) {
  const [socket, setSocket] = useState(null);
  const [device, setDevice] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  let navigation = useNavigation();
  let data = route.params.data;

  useEffect(() => {
    console.log(data);
    if (socket) {
      socket.close();
    }
  
    const newSocket = new WebSocket('ws://172.20.51.21:8081/ws/auth/' + data);
    setSocket(newSocket);
  
    newSocket.onmessage = async (event) => {
      if (isJSON(event.data)) {
        const data = JSON.parse(event.data);
        console.log(data);
        // Cập nhật state từ dữ liệu nhận được từ socket
        if (data.device != null) {
          setDevice(data.device);
        }  
        if (data.time != null) {
          setTime(data.time);
        }
        if (data.location != null) {
          setLocation(data.location);
        }
      }
    };
  
    return () => {
      newSocket.close();
    };
  }, [data]);


  const sendAccept = async (socket) => {
    await waitForWebSocketOpen(socket);
    // console.log('WebSocket connection is now open.');
    socket.send(JSON.stringify({connect:"ACCEPT"}));
  }

  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  function waitForWebSocketOpen(socket) {
    return new Promise((resolve, reject) => {
      if (socket.readyState === WebSocket.OPEN) {
        resolve(socket);
      } else {
        socket.addEventListener('open', () => {
          resolve(socket);
        });
        socket.addEventListener('error', (error) => {
          reject(error);
        });
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}></View>
      <View style={{flex: 2}}>
        {/* <Image style={{width: "100%", height: "100%", resizeMode: "contain"}} source={require("../assets/confirmQR.jpg")}></Image> */}
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
          onPress={() => { socket.send(JSON.stringify({token:"as"}));; navigation.navigate('TabNavigator',{ screen: 'Messages' })}}
        >
          <Text style={{color: "#fff", fontSize: 18, fontFamily: "Roboto", fontWeight: "bold"}}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate('TabNavigator',{ screen: 'Messages' })}} style={{backgroundColor: "#C0C0C0", width: "90%", height: "40%", borderRadius: 40, justifyContent: "center", alignItems: "center", marginLeft: "5%", marginTop: "3%", marginBottom: "5%"}}>
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
