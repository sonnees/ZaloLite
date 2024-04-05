import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { API_PROFILE } from '../api/Api';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({ userName: '', avatar: '' });
  const [selectedImage, setSelectedImage] = useState(null);

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
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.cancelled) {
      setSelectedImage(result.uri);
      uploadAvatar(result.uri);
    }
  };
  
  

  return (
    <ImageBackground
      blurRadius={0}
      style={{ flex: 1 }}
      source={require("../assets/cover_Image.jpg")}
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
          source={{ uri: selectedImage || userInfo.avatar }}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
