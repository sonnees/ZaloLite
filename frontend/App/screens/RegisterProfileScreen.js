import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, Text, StatusBar, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios'; // Import thư viện Axios
import cloudinaryConfig from '../config/cloudinaryConfig';
import { API_REGISTER } from '../api/API';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const RegisterProfileScreen = () => {
  let navigation = useNavigation();
  let route = useRoute();

  // Nhận các giá trị từ tham số được truyền qua
  const { userName, phoneNumber, gender, birthDate } = route.params;

  const [selectedImage, setSelectedImage] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // Initialize userInfo state
  const [newAvatar, setNewAvatar] = useState(null); // Initialize newAvatar state

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      try {
        const imageUrl = await handleUpload(result.assets[0].uri);
        setSelectedImage(imageUrl);
        setUserInfo(prevState => ({ ...prevState, avatar: imageUrl }));
        await AsyncStorage.setItem('newAvatar', imageUrl);
      } catch (error) {
        console.error('Lỗi khi xử lý ảnh:', error);
        Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi xử lý ảnh.');
      }
    }
  };

  const handleUpload = async (imageUri) => {
    try {
      const data = new FormData();
      data.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
      data.append('upload_preset', 'ZaloLife');
      data.append('cloud_name', 'dbmkvqy3b');

      const response = await fetch('https://api.cloudinary.com/v1_1/dbmkvqy3b/image/upload', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const responseData = await response.json();
      console.log('Upload successful:', responseData);

      const imageUrl = responseData.secure_url;
      await AsyncStorage.setItem('newAvatar', imageUrl); // Lưu URL của ảnh mới vào AsyncStorage
      setUserInfo(prevState => ({ ...prevState, avatar: imageUrl })); // Cập nhật state userInfo với URL của ảnh mới
      setNewAvatar(imageUrl); // Cập nhật giá trị newAvatar với URL của ảnh mới
      return imageUrl;
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
      throw error;
    }
  };

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
      userName: userName,
      avatar: selectedImage ? selectedImage : "https://res.cloudinary.com/dbmkvqy3b/image/upload/v1712158193/bihirvugrglydydg1htz.jpg", // Sử dụng ảnh đã chọn hoặc ảnh mặc định nếu không có ảnh đã chọn
      gender: gender === "male" ? "true" : "false", // Chuyển đổi giá trị gender thành true hoặc false
      birthday: birthDate,
      role: "USER"
    };

    console.log("Registration body:", body);
    try {
      const response = await axios.post(API_REGISTER, body);
      console.log("Registration successful:", response.data);
      // Chuyển hướng sang màn hình TabNavigator sau khi đăng ký thành công
      navigation.navigate('OtpScreen', { p: phoneNumber });
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
      <View style={{ flex: 1 }}>
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
              style={{ width: 130, height: 130, borderRadius: 100, resizeMode: "cover", marginLeft: "25%" }}
              source={selectedImage ? { uri: selectedImage } : require("../assets/avat.png")} // Sử dụng ảnh đã chọn hoặc mặc định
            />
          </TouchableOpacity>

          <Text style={{ fontSize: 14, color: "#999999", top: "3%" }}>Bạn có thể chỉnh sủa ảnh với nhiều tùy c</Text>
          <Text style={{ fontSize: 14, color: "#999999", top: "3%" }}>và chọn bộ lọc màu thú vị v</Text>
        </View>
        <View style={{ flex: 3, backgroundColor: "#fff" }}></View>
        <View style={{ flex: 2, justifyContent: "center", paddingLeft: "70%", backgroundColor: "#fff" }}>
          <TouchableOpacity style={{ flex: 0.7, borderRadius: 20, justifyContent: "center", alignItems: "center" }}
            onPress={handleRegister} // Gọi hàm xử lý đăng ký khi người dùng nhấn nút
          >
            <Image style={{ width: "70%", height: "50%", resizeMode: "contain" }} source={require("../assets/right-arrow.png")}></Image>
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