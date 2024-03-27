import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native'

const HoldButtonExample = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handlePress = () => {
    // Kiểm tra nếu modal đã hiển thị, thì đóng modal
    if (modalVisible) {
      setModalVisible(false);
    } else {
      // Nếu modal chưa hiển thị, thực hiện navigate qua TabNavigator
      navigation.navigate("TabNavigator");
    }
  };

  const handleLongPress = () => {
    // Hiển thị modal khi người dùng nhấn giữ lâu hơn 0.5 giây
    setTimeout(() => {
      setModalVisible(true);
    }, 500);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        <Text>Press and hold me</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>This is a modal!</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10, padding: 10, backgroundColor: 'transparent', borderRadius: 5 }}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HoldButtonExample;
