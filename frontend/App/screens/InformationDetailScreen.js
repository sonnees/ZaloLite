import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function InformationDetail() {
  const [userInfo, setUserInfo] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null); // Thêm state để lưu phoneNumber từ AsyncStorage
  const navigation = useNavigation();

  useEffect(() => {

    // Function to get token from AsyncStorage
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        return token;
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
        return null;
      }
    };

    // Function to get phoneNumber from AsyncStorage
    const getPhoneNumber = async () => {
      try {
        const phone = await AsyncStorage.getItem('phoneNumber');
        setPhoneNumber(phone);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
      }
    };
        // Lưu giá trị userName và avatar vào AsyncStorage
        const saveUserInfoToStorage = async (userName, avatar) => {
          try {
            // Kiểm tra xem userName và avatar có tồn tại hay không
            if (userName && avatar) {
              // Nếu cả hai giá trị đều tồn tại, lưu chúng vào AsyncStorage
              await AsyncStorage.setItem('userName', userName);
              await AsyncStorage.setItem('avatar', avatar);
            } else {
              // Nếu userName hoặc avatar không tồn tại, hiển thị thông báo lỗi
              console.error('Lỗi khi lưu thông tin người dùng vào AsyncStorage: userName hoặc avatar không tồn tại');
            }
          } catch (error) {
            console.error('Lỗi khi lưu thông tin người dùng vào AsyncStorage:', error);
          }
        };
        
    // Call getToken function to get token
    getToken().then(token => {
      if (token && phoneNumber) {
        // Send GET request to API to get user info with phoneNumber
        axios.get(`http://192.168.1.10:8081/api/v1/account/profile/${phoneNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        })
        .then(response => {
          // Handle response from API
          setUserInfo(response.data);
        })
        .catch(error => {
          console.error('Lỗi khi lấy thông tin cá nhân:', error);
          // Handle error, for example: show an alert
          Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi lấy thông tin cá nhân.');
        });
      } else {
        console.log('Không tìm thấy token hoặc số điện thoại trong AsyncStorage');
        // Handle case when token or phoneNumber is not found in AsyncStorage
      }
    });

    // Call getPhoneNumber function to get phoneNumber
    getPhoneNumber();
  }, [phoneNumber]); // Thêm phoneNumber vào dependency array để useEffect chạy lại khi phoneNumber thay đổi

  return (
    <View style={styles.container}>
      {/* Check if userInfo is received from API */}
      {userInfo && (
        // Render user information
        <>
          {/* Render cover image */}
          <View style={{ flex: 2 }}>
            <Image source={require('../assets/cover_Image.jpg')} style={{width: '100%', height: '100%'}}/>
            {/* Render avatar */}
            <View style={{ flex: 3, position: "absolute", top: "65%", width: "50%", paddingLeft: "5%" }}>
              <Image style={{ width: 60, height: 60, borderRadius: 60, resizeMode: "contain" }} source={{ uri: userInfo.avatar }} />
            </View>
            {/* Back button */}
            <Image style={{ position: "absolute", width: "16%", height: "8%", resizeMode: "contain", top: "10%" }}
              source={require("../assets/back1.png")}
              onStartShouldSetResponder={() => navigation.navigate("InformationScreen")}
            />
            {/* Render user name */}
            <Text style={{ position: "absolute", top: "70%", fontFamily: "Roboto", fontSize: 20, fontWeight: "bold", color: "white", paddingLeft: "25%" }}>{userInfo.userName}</Text>
          </View>
          {/* Render personal information */}
          <View style={{ flex: 3, backgroundColor: "#fff" }}>
            <Text style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", paddingLeft: "5%", paddingTop: "3%" }}>Thông tin cá nhân</Text>
            {/* Render gender */}
            <View style={{ flex: 1, flexDirection: "row", paddingLeft: "5%", alignItems: "center" }}>
              <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Giới tính</Text>
              <View style={{ flex: 0.2 }}></View>
              <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>{userInfo.gender ? 'Nam' : 'Nữ'}</Text>
            </View>
            <View style={{ flex: 0.02, backgroundColor: "#CCCCCC", paddingLeft: "5%" }}></View>
            {/* Render birthday */}
            <View style={{ flex: 1, flexDirection: "row", paddingLeft: "5%", alignItems: "center" }}>
              <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Ngày sinh</Text>
              <View style={{ flex: 0.2 }}></View>
              <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>{userInfo.birthday ? userInfo.birthday.split('T')[0] : '**/**/****'}</Text>
            </View>
            <View style={{ flex: 0.02, backgroundColor: "#CCCCCC", paddingLeft: "5%" }}></View>
            {/* Render phone number */}
            <View style={{ flex: 1, flexDirection: "row", paddingLeft: "5%", paddingTop: "3%" }}>
              <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Điện thoại</Text>
              <View style={{ flex: 0.2 }}></View>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>{phoneNumber}</Text>
                <Text style={{ fontFamily: "Roboto", fontSize: 12 }}>Số điện thoại chỉ hiển thị với người có lưu số bạn trong danh bạ máy</Text>
              </View>
            </View>
            <View style={{ flex: 3, backgroundColor: "#fff", paddingLeft: "5%" }}></View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCCCCC',
  }
});
