import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { ACCOUNT_SOCKET } from '../api/API';

const QRScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    if (socket) {
      socket.close();
    }

    try {
      const newSocket = new WebSocket(ACCOUNT_SOCKET + data);
      setScanned(true);
      navigation.navigate('ConfirmQRScreen', { data: data });
      await waitForWebSocketOpen(newSocket);
      console.log('WebSocket connection is now open.');
      newSocket.send(JSON.stringify({ connect: "ACCEPT" }));

      // Navigate to ConfirmQRScreen with the scanned data
      navigation.navigate('ConfirmQRScreen', { data: data });
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      Alert.alert('Error', 'Failed to establish WebSocket connection');
    }
  };

  const waitForWebSocketOpen = (socket) => {
    return new Promise((resolve, reject) => {
      if (socket.readyState === WebSocket.OPEN) {
        resolve(socket);
      } else {
        socket.addEventListener('open', () => resolve(socket));
        socket.addEventListener('error', (error) => reject(error));
        socket.addEventListener('open', () => resolve(socket));
        socket.addEventListener('error', (error) => reject(error));
      }
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.description}>Mã QR của tôi</Text>
          <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
            <Icon name="ellipsis1" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.middleOverlay}>
          <View style={styles.leftAndRightOverlay} />
          <View style={styles.rectangle}>
            <View style={styles.topLeftCorner} />
            <View style={styles.topRightCorner} />
            <View style={styles.bottomLeftCorner} />
            <View style={styles.bottomRightCorner} />
          </View>
          <View style={styles.leftAndRightOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <TouchableOpacity onPress={() => {}} style={styles.bottomButton}>
            <Image source={require('../assets/photo-gallery.png')} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Ảnh có sẵn</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.bottomButton}>
            <Image source={require('../assets/recent.png')} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Gần đây</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const overlayColor = 'rgba(0,0,0,0.6)'; // Dark overlay color
const rectDimensions = width * 0.65; // Rectangle size
const cornerSize = 25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: overlayColor,
  },
  middleOverlay: {
    flexDirection: 'row',
  },
  bottomOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: overlayColor,
  },
  leftAndRightOverlay: {
    flex: 1,
    backgroundColor: overlayColor,
  },
  rectangle: {
    width: rectDimensions,
    height: rectDimensions,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: cornerSize,
    height: cornerSize,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'white',
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: cornerSize,
    height: cornerSize,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: 'white',
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: cornerSize,
    height: cornerSize,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'white',
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: cornerSize,
    height: cornerSize,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: 'white',
  },
  description: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  bottomButton: {
    alignItems: 'center',
  },
  bottomButtonIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  bottomButtonText: {
    color: 'white',
  },
  iconButton: {
    padding: 10,
  },
});

export default QRScannerScreen;
