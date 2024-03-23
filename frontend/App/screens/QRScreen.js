import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
// import { weWebSocket } from 'react-native-websocket';

const info = {
  "phoneNumber": "0123456789",
  "password": "123"
}


const QRScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

  

  }, []);

  function waitForWebSocketOpen(socket) {
    return new Promise((resolve, reject) => {
      if (socket.readyState === WebSocket.OPEN) {
        // Nếu kết nối đã mở ngay lập tức, giải quyết promise
        resolve(socket);
      } else {
        // Nếu kết nối chưa mở, thiết lập sự kiện lắng nghe khi kết nối mở
        socket.addEventListener('open', () => {
          resolve(socket);
        });
  
        // Xử lý trường hợp kết nối gặp lỗi
        socket.addEventListener('error', (error) => {
          reject(error);
        });
      }
    });
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // //========SOCKET=========
    if (socket) {
      socket.close();
    }

    const newSocket = new WebSocket('ws://192.168.1.19:8081/ws/auth/0d7d5940-ee27-4c4b-be45-b603723f1d2f');
    
    try {
      // Đợi cho kết nối mở
      await waitForWebSocketOpen(newSocket);
      
      // Kết nối đã mở, bạn có thể gửi dữ liệu thông qua socket ở đây
      console.log('WebSocket connection is now open.');

      newSocket.send(JSON.stringify(info))
    } catch (error) {
      // Xử lý lỗi nếu kết nối không thành công
      console.error('Failed to establish WebSocket connection:', error);
    }
    //=======================
    // Xử lý dữ liệu mã QR ở đây
    Alert.alert(
      `QR Code Scanned!`,
      `Type: ${type}\nData: ${data}`,
      [{ text: 'OK', onPress: () =>{ setScanned(false); }}],
      { cancelable: false }
    );


  };

  const handleScanButtonPress = () => {
    setShowScanner(true);
  };

  const handleCancelScan = () => {
    setShowScanner(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!showScanner ? (
        <Button title="Scan QR Code" onPress={handleScanButtonPress} />
      ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 350, height: 350 }}>
          <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{flex:1 }}
            type={Camera.Constants.Type.back}
          />
            </View>
        <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}
          {!scanned && <Button title="Back" onPress={handleCancelScan} />}
        </View>
            </View>
      )}
    </View>
  );
};

export default QRScannerScreen;
