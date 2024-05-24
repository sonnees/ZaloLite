import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { BarCodeScanner } from 'expo-barcode-scanner';
import { host } from '../api/API';

const QRScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigation = useNavigation(); // Initialize navigation object

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (socket) {
      socket.close();
    }

    try {
      const newSocket = new WebSocket(`ws://${host}:8081/ws/auth/` + data);
      setScanned(true);
      navigation.navigate('ConfirmQRScreen', { data: data });
      await waitForWebSocketOpen(newSocket);
      newSocket.send(JSON.stringify({ connect: "ACCEPT" }));
      setSocket(newSocket);
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  };

  function waitForWebSocketOpen(socket) {
    return new Promise((resolve, reject) => {
      if (socket.readyState === WebSocket.OPEN) {
        resolve(socket);
      } else {
        socket.addEventListener('open', () => resolve(socket));
        socket.addEventListener('error', (error) => reject(error));
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
