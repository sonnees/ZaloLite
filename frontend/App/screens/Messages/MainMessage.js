import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      {/* Thiết lập màu nền và kiểu hiển thị của thanh trạng thái */}
      <StatusBar backgroundColor="#FF5733" barStyle="light-content" />

      {/* Nội dung của ứng dụng */}
      <View style={styles.content}>
        {/* Đây có thể là các thành phần khác trong ứng dụng */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Màu nền của ứng dụng
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
