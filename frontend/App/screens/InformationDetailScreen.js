import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_PROFILE } from '../api/Api';

export default function InformationDetail() {
  const [userInfo, setUserInfo] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null); // Thêm state để lưu giá trị avatar mới

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        return token;
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
        return null;
      }
    };

    const getPhoneNumber = async () => {
      try {
        const phone = await AsyncStorage.getItem('phoneNumber');
        setPhoneNumber(phone);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
      }
    };

    getToken().then(token => {
      if (token && phoneNumber) {
        axios.get(`${API_PROFILE}${phoneNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(response => {
            setUserInfo(response.data);
          })
          .catch(error => {
            console.error('Lỗi khi lấy thông tin cá nhân:', error);
            Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi lấy thông tin cá nhân.');
          });
      } else {
        console.log('Không tìm thấy token hoặc số điện thoại trong AsyncStorage');
      }
    });

    getPhoneNumber();
  }, [phoneNumber]);

  useEffect(() => {
    const getNewAvatar = async () => {
      try {
        const newAvatar = await AsyncStorage.getItem('newAvatar');
        if (newAvatar !== null) {
          setNewAvatar(newAvatar);
        }
      } catch (error) {
        console.error('Lỗi khi lấy giá trị newAvatar từ AsyncStorage:', error);
      }
    };

    getNewAvatar();
  }, []);


  return (
    <View style={styles.container}>
      {userInfo && (
        <>
          <View style={{ flex: 2 }}>
            <Image source={require('../assets/Cover.jpg')} style={{ width: '100%', height: '100%' }} />
            <View style={{ flex: 3, position: "absolute", top: "65%", width: "50%", paddingLeft: "5%" }}>
              {/* Sử dụng avatar mới nếu có, nếu không sử dụng avatar từ userInfo */}
              <Image style={{ width: 60, height: 60, borderRadius: 60, }} source={{ uri: userInfo.avatar || newAvatar }} />
            </View>
            <Image style={{ position: "absolute", width: "16%", height: "8%", resizeMode: "contain", top: "10%" }}
              source={require("../assets/back1.png")}
              onStartShouldSetResponder={() => navigation.navigate("InformationScreen")}
            />
            <Text style={{ position: "absolute", top: "70%", fontFamily: "Roboto", fontSize: 20, fontWeight: "bold", color: "white", paddingLeft: "25%" }}>{userInfo.userName}</Text>
          </View>
          <View style={{ flex: 3, backgroundColor: "#fff" }}>
            <Text style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", paddingLeft: "5%", paddingTop: "3%" }}>Thông tin cá nhân</Text>
            <View style={{ flex: 1, flexDirection: "row", paddingLeft: "5%", alignItems: "center" }}>
              <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Giới tính</Text>
              <View style={{ flex: 0.2 }}></View>
              <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>{userInfo.gender === true ? 'Nam' : 'Nữ'}</Text>
            </View>
            <View style={{ flex: 0.02, backgroundColor: "#CCCCCC", paddingLeft: "5%" }}></View>
            <View style={{ flex: 1, flexDirection: "row", paddingLeft: "5%", alignItems: "center" }}>
              <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Ngày sinh</Text>
              <View style={{ flex: 0.2 }}></View>
              <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>{userInfo.birthday ? userInfo.birthday.split('T')[0] : '**/**/****'}</Text>
            </View>
            <View style={{ flex: 0.02, backgroundColor: "#CCCCCC", paddingLeft: "5%" }}></View>
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
