import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios'; // Import thư viện Axios

const RegisterProfileScreen = () => {
  let navigation = useNavigation();
  let route = useRoute();

  // Nhận các giá trị từ tham số được truyền qua
  const { userName, phoneNumber, gender, birthDate } = route.params;

  const [selectedImage, setSelectedImage] = useState(null);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri); // Lưu trữ ảnh đã chọn
    }
  };

  const handleRegister = async () => {
    // Tạo dữ liệu để gửi đi
    const formData = new FormData();
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', '123'); // Thay 'your_password' bằng mật khẩu thực tế
    formData.append('userName', userName);
    formData.append('gender', gender);
    formData.append('birthday', birthDate);
    formData.append('role', {
      uri: selectedImage,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    try {
      // Gọi API với Axios
      const response = await axios.post('http://192.168.1.6:8081/api/v1/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Xử lý kết quả từ API (response.data)
      console.log(response.data);

      // Nếu đăng ký thành công, chuyển sang màn hình TabNavigator
      navigation.navigate('TabNavigator');
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Điều chỉnh offset nếu cần thiết
    >
      <StatusBar />
      <View style={{ flex: 1}}>
        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center", paddingVertical: 6, height: 50 }}>
          <Image style={{ width: "15%", height: "65%", resizeMode: "contain" }} source={require("../assets/back1.png")}
             onStartShouldSetResponder={() => navigation.navigate('LoginNavigator', { screen: 'RegisterDEScreen' })}
          ></Image>
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white", marginLeft: "2%" }}>Ảnh đại diện</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, backgroundColor: "#DDDDDD", height: 45 }}>
          <Text style={{ fontSize: 14, marginLeft: "6%" }}>Cập nhật ảnh đại diện đẹp nhất c</Text>
        </View>
        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, width: '100%' }} />
        <View style={{ flex: 5, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity 
            style={{ width: "60%", height: "40%", resizeMode: "contain" }}
            onPress={handleChoosePhoto}
          >
          <Image
          style={{ width: 130, height: 130,borderRadius: 100, resizeMode: "cover", marginLeft: "25%" }}
          source={selectedImage ? { uri: selectedImage } : require("../assets/avat.png")} // Sử dụng ảnh đã chọn hoặc mặc định
          />
          </TouchableOpacity>

            <Text style={{fontSize: 14, color: "#999999", top: "3%"}}>Bạn có thể chỉnh sủa ảnh với nhiều tùy c</Text>
            <Text style={{fontSize: 14, color: "#999999",top: "3%"}}>và chọn bộ lọc màu thú vị v</Text>
        </View>
        <View style={{flex: 3,backgroundColor: "#fff"}}></View>
        <View style={{flex: 2, justifyContent: "center", paddingLeft: "70%",backgroundColor: "#fff"}}>
        <TouchableOpacity style={{flex: 0.7, borderRadius: 20, justifyContent: "center", alignItems: "center"}} 
        onPress={handleRegister}>
          <Image style={{width: "70%", height: "50%", resizeMode: "contain"}} source={require("../assets/right-arrow.png")}></Image>
        </TouchableOpacity>
          
        
        </View>
      </View>

    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export default RegisterProfileScreen;
