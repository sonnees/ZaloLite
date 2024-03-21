import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';

const QRScannerScreen = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleScanQRCode = async () => {
    setIsCameraOpen(true);
  };

  const handleBarCodeRead = ({ data }) => {
    Alert.alert('QR Code Scanned', data, [{ text: 'OK', onPress: () => setIsCameraOpen(false) }]);
  };

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <View style={styles.cameraContainer}>
          <RNCamera
            style={styles.cameraPreview}
            onBarCodeRead={handleBarCodeRead}
            captureAudio={false}
          />
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleScanQRCode}>
          <Text style={styles.buttonText}>Open Camera to Scan QR Code</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  cameraPreview: {
    flex: 1,
  },
});

export default QRScannerScreen;
