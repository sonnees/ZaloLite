import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { API_PROFILE, API_UpdateProfile } from '../api/API';


export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({ userName: '', avatar: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null); // Khai báo newAvatar state

  useEffect(() => {
    const fetchUserInfo = async (phoneNumber, token) => {
      try {
        const response = await axios.get(`${API_PROFILE}${phoneNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin cá nhân:', error);
        Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi lấy thông tin cá nhân.');
      }
    };

    const getPhoneNumberAndToken = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem('phoneNumber');
        const token = await AsyncStorage.getItem('token');
        if (phoneNumber && token) {
          fetchUserInfo(phoneNumber, token);
        } else {
          console.log('Không tìm thấy số điện thoại hoặc token trong AsyncStorage');
        }
      } catch (error) {
        console.error('Lỗi khi lấy số điện thoại hoặc token từ AsyncStorage:', error);
      }
    };

    getPhoneNumberAndToken();
  }, []);

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

  
  
  const changeAvatar = async (imageUrl, token) => {
    try {
      const requestBody = {
        field: imageUrl,
      };
  
      const response = await axios.post(API_UpdateProfile, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Response from API_UpdateProfile:', response.data);
  
      if (response.status === 200) {
        console.log('Thay đổi avatar thành công');
        // Xử lý logic khi thay đổi avatar thành công
      } else {
        console.error('Thay đổi avatar không thành công:', response.data);
        // Xử lý logic khi thay đổi avatar không thành công
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thay đổi avatar:', error);
      // Xử lý logic khi gặp lỗi
    }
  };
  useEffect(() => {
    const getNewAvatar = async () => {
      try {
        const newAvatar = await AsyncStorage.getItem('newAvatar');
        if (newAvatar) {
          setNewAvatar(newAvatar); // Gán giá trị newAvatar từ AsyncStorage vào state
          console.log('newAvatar:', newAvatar);
        }
      } catch (error) {
        console.error('Lỗi khi lấy newAvatar từ AsyncStorage:', error);
      }
    };

    getNewAvatar();
  }, []);
  
  
  

  return (
    <ImageBackground
      blurRadius={0}
      style={{ flex: 1 }}
      source={require("../assets/Cover.jpg")}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Image style={{ width: "7%", height: "30%", resizeMode: "contain", marginLeft: "5%", marginTop: "1%" }} source={require("../assets/back1.png")}
          onStartShouldSetResponder={() => navigation.navigate('TabNavigator', { screen: 'Me' })}
        />
        <View style={{ flex: 1.5 }} />
        <Image style={{ width: "7%", height: "30%", resizeMode: "contain", marginTop: "1%", marginRight: "5%" }} source={require("../assets/more.png")}
          onStartShouldSetResponder={() => navigation.navigate("InformationScreen")}
        />
      </View>
      <View style={{ flex: 2, backgroundColor: "white" }}>
        <View style={{ flex: 0.15 }} />
        <Text style={{ textAlign: "center", fontFamily: "Roboto", fontSize: 20, fontWeight: "bold" }}>{userInfo.userName}</Text>
        <View style={{ flex: 0.05 }} />
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: "17%", height: "80%", resizeMode: "contain", marginLeft: "15%", marginRight: "-4%" }}
            source={require("../assets/pencil.png")}
          />
          <Text style={{ fontSize: 15, fontFamily: "Roboto", color: "blue" }}>Cập nhật giới thiệu bản thân</Text>
        </View>
        <View style={{ flex: 0.04 }} />
        <View style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}>
          <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={require("../assets/state.jpg")} />
        </View>
        <View style={{ flex: 0.1 }}>
          <Text style={{ textAlign: "center", fontFamily: "Roboto", fontSize: 15, fontWeight: "bold" }}>Hôm nay {userInfo.userName} có gì vui?</Text>
          <View style={{ flex: 0.04 }} />
          <Text style={{ textAlign: "center", fontFamily: "Roboto", fontSize: 15, color: "#808080", paddingLeft: "5%", paddingRight: "5%" }}>Đây là Nhật ký của bạn - Hãy làm đầy Nhật ký với những dấu ấn cuộc đời và kỹ niệm đáng nhớ nhé!</Text>
        </View>
        <View style={{ flex: 0.1 }} />
        <View style={{ flex: 0.3 }}>
          <TouchableOpacity style={{ backgroundColor: "#0000FF", borderRadius: 20, width: "50%", height: "30%", marginLeft: "25%", marginRight: "10%", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontFamily: "Roboto", fontSize: 15, fontWeight: "bold" }}>Đăng lên Nhật ký</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          top: "27%",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        onPress={handleChoosePhoto}
      >
        <Image
          style={{ width: 100, height: 100, borderRadius: 50 }}
          source={{ uri: userInfo.avatar || newAvatar|| selectedImage }}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
