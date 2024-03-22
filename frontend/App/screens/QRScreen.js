import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

const QRScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Xử lý dữ liệu mã QR ở đây
    Alert.alert(
      `QR Code Scanned!`,
      `Type: ${type}\nData: ${data}`,
      [{ text: 'OK', onPress: () => setScanned(false) }],
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
