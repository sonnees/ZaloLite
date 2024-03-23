import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { BarCodeScanner } from 'expo-barcode-scanner';

const info = {
  "phoneNumber": "0123456789",
  "password": "123"
}

const QRScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation(); // Initialize navigation object

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (scanned) {
      // Khi đã quét xong mã QR, đóng máy quét
      setScanned(false);
    }
  }, [scanned]);

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

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // Xử lý logic của bạn ở đây (mở WebSocket, gửi dữ liệu, vv.)
    // Ví dụ:
    try {
      // Mở WebSocket và gửi dữ liệu
      const newSocket = new WebSocket('ws://172.20.53.85:8081/ws/auth/' + data);
      await waitForWebSocketOpen(newSocket);
      console.log('WebSocket connection is now open.');
      newSocket.send(JSON.stringify(info));

      // Chuyển sang màn hình ConfirmQRScreen
      navigation.navigate('ConfirmQRScreen');

    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      Alert.alert('Error', 'Failed to establish WebSocket connection');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
    </View>
  );
};

export default QRScannerScreen;
