import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { BarCodeScanner } from 'expo-barcode-scanner';



const QRScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  // const [showScanner, setShowScanner] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigation = useNavigation(); // Initialize navigation object

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    
  }, []);

  // useEffect(() => {
  //   if (scanned) {
  //     // Khi đã quét xong mã QR, đóng máy quét
  //     setScanned(false);
  //   }
  // }, [scanned]);

  

  const handleBarCodeScanned = async ({ type, data }) => {
    // setScanned(false);
    // //========SOCKET=========
    if (socket) {
      socket.close();
    }

    // const newSocket = new WebSocket('ws://192.168.1.19:8081/ws/auth/' + data);
    
    try {
      // Mở WebSocket và gửi dữ liệu
      const newSocket = new WebSocket('ws://192.168.137.235:8081/ws/auth/' + data);
      setScanned(true);
      navigation.navigate('ConfirmQRScreen', {data: data});
      await waitForWebSocketOpen(newSocket);
      console.log('WebSocket connection is now open.');
      newSocket.send(JSON.stringify({connect:"ACCEPT"}));
      // console.log("ACCEPT");
      

      


      
      // Chuyển sang màn hình ConfirmQRScreen
      

    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      // Alert.alert('Error', 'Failed to establish WebSocket connection');
    }
    
    // Alert.alert(
    //   `QR Code Scanned!`,
    //   `Type: ${type}\nData: ${data}`,
    //   [{ text: 'OK', onPress: () =>{ setScanned(false); }}],
    //   { cancelable: false }
    // );
  };

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


  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View  style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
    </View>
  );
};

export default QRScannerScreen;
