import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios'; // Import thư viện Axios
import cloudinaryConfig from '../config/cloudinaryConfig';
import { API_RGT } from '../api/Api';

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

  //Upload ảnh lên Cloudinary
  const handleUpload = (image) =>{
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'ZaloLife');
    data.append('cloud_name', 'dbmkvqy3b');

    fetch('https://api.cloudinary.com/v1_1/dbmkvqy3b/image/upload', {
      method: 'post',
      body: data
    }).then(res => res.json())
    .then(data => {
      console.log(data);
    })
  }

  const handleRegister = async () => {
    // Nếu người dùng đã chọn ảnh mới, thực hiện upload ảnh lên Cloudinary trước khi đăng ký
    if (selectedImage) {
      try {
        await handleUpload(selectedImage); // Gọi hàm handleUpload với ảnh đã chọn
      } catch (error) {
        console.error("Upload image failed:", error);
        Alert.alert("Upload ảnh thất bại", "Vui lòng thử lại sau.");
        return; // Nếu upload ảnh thất bại, dừng hàm handleRegister
      }
    }

    // Tạo object body cho request API
    const body = {
      phoneNumber: phoneNumber,
      password: "123", // Giá trị mặc định cho password
      userName: userName ,
      avatar: selectedImage ? "" : "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711532179/nu1_uq2zmu.png", // Sử dụng ảnh đã chọn hoặc ảnh mặc định nếu không có ảnh đã chọn
      gender: gender === "male" ? "true" : "false", // Chuyển đổi giá trị gender thành true hoặc false
      birthday: birthDate, 
      role: "USER" 
    };

    try {
      const response = await axios.post(API_RGT, body);
      console.log("Registration successful:", response.data);
      // Chuyển hướng sang màn hình TabNavigator sau khi đăng ký thành công
      navigation.navigate('OtpScreen');
    } catch (error) {
      console.error("Registration failed:", error);
      Alert.alert("Đăng ký thất bại", "Vui lòng kiểm tra lại thông tin đăng ký và thử lại sau.");
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
        onPress={handleRegister} // Gọi hàm xử lý đăng ký khi người dùng nhấn nút
        >
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