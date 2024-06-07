import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, StatusBar, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_PROFILE } from '../api/API';

const AddFriendScreen = () => {
  const navigation = useNavigation();
  const [borderColor, setBorderColor] = useState('gray');
  const [phoneCountry, setPhoneCountry] = useState('+84');
  const [backgroundPhone, setBackgroundPhone] = useState('#DDDDDD');
  const [phoneNumber, setPhoneNumber] = useState("");
  const route = useRoute();
  const [typeScreen, setTypeScreen] = useState(route.params.typeScreen);
  // modal
  const [modalInvalidPhone, setModalInvalidPhone] = useState(false)
  const [modalPhoneNotLinked, setModalPhoneNotLinked] = useState(false)

  useEffect(() => {
    if (route.params?.phoneCountry) {
      setPhoneCountry(route.params.phoneCountry);
    }
  }, [route.params?.phoneCountry]);


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

  // Function to fetch user info
  const fetchUserInfo = async (phoneNumber, token) => {
    try {
      const response = await axios.get(`${API_PROFILE}${phoneNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status !== 404) {
          return {
            status: error.response.status,
            message: 'Lỗi khi lấy thông tin cá nhân'
          };
        }
        return {
          status: 404,
          message: 'Không tìm thấy thông tin cá nhân'
        };
      } else {
        return {
          status: -1,
          message: 'Lỗi kết nối máy chủ'
        };
      }
    }
  };


  const handleCheckProfile = async () => {
    if (phoneNumber.length !== 10) {
      setModalInvalidPhone(true);
      return;
    }
    const token = await getToken();
    const myPhoneNumber = await AsyncStorage.getItem('phoneNumber');

    if (!token) {
      console.log("Lỗi không tìm thấy token");
    }

    // console.log("MY PHONE NUMBER : ", myPhoneNumber);
    if (phoneNumber === myPhoneNumber) {
      navigation.navigate('MeNavigator', { screen: 'ProfileScreen' });
      return;
    }
    const userInfo = await fetchUserInfo(phoneNumber, token);
    if (userInfo.status === 404) {
      setModalPhoneNotLinked(true);
      setTimeout(() => {
        setModalPhoneNotLinked(false);
      }, 5000);
      return;
    }
    // Xử lý các trường hợp lỗi khác
    // if (userInfo.status !== 200) {
    //   console.log("Lỗi khi lấy thông tin cá nhân:", userInfo.message);
    //   // Xử lý lỗi ở đây nếu cần thiết
    //   return;
    // }
    navigation.navigate('ProfileFriendScreen', { profile: userInfo });
  }
  const handleNavi = (typeScreen) => {
    if (typeScreen === 'PofileFriendScreen') {
      navigation.navigate("PofileFriendScreen")
    } else if (typeScreen == 'ContactsScreen') {
      navigation.navigate("TabNavigator", { screen: typeScreen })
    }
    else {
      navigation.navigate("TabNavigator", { screen: typeScreen })
    }
  }
  const changeColor = () => {
    setBorderColor('#0033CC');
    setBackgroundPhone('#99CCFF')
  }
  const revertColor = () => {
    setBorderColor('gray');
    setBackgroundPhone('#DDDDDD');
  }
  return (

    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar />
      <View style={{ flexDirection: "row", paddingVertical: 8, height: 48, alignItems: 'center' }}>
        <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 15 }}
          onPress={() => handleNavi(typeScreen)}
        >
          <Icon name='arrowleft' size={22} color={'black'} />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '500' }}>Add friends</Text>
      </View>

      <View style={{ borderBottomColor: '#CCCCCC', borderBottomWidth: 1, width: '100%' }} />

      <View style={{ flex: 1, backgroundColor: "#fff" }}>

        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center', alignContent: 'center', backgroundColor: '#EEEEEE' }}>
          <View style={{ backgroundColor: "#003366", height: 215, width: 220, borderRadius: 25, alignItems: 'center' }}>
            <Text style={{ color: "white", fontSize: 15.5, marginTop: 15, marginBottom: 15, fontWeight: '500' }}>Trần Thiện Đạt</Text>
            <Image source={require("../assets/QR_Test.jpeg")} style={{ width: 120, height: 120, borderRadius: 10 }} />
            <Text style={{ color: "#CCCCCC", fontSize: 11.5, marginTop: 10 }}>Quét mã để thêm bạn Zalo với tôi</Text>
          </View>
        </View>

        <View style={{ flex: 4, backgroundColor: 'white' }}>
          <View style={{ flex: 1 }}>

            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>

              <View style={{ flex: 5, borderWidth: 1, borderColor: borderColor, flexDirection: 'row', height: 48, marginLeft: 15, borderRadius: 10 }}>
                <TouchableOpacity style={{
                  flex: 1, flexDirection: 'row', backgroundColor: backgroundPhone,
                  borderRadius: 10, justifyContent: 'center', alignItems: 'center'
                }}
                  onPress={() => navigation.navigate("ListCountryScreen", { phoneCountry: phoneCountry })}
                >
                  <Text style={{ textAlign: 'center', fontSize: 15 }} >{phoneCountry}</Text>
                  <Icon name='down' size={22} style={{ marginLeft: 10 }}></Icon>
                </TouchableOpacity>
                <TextInput style={{ flex: 2.5, marginLeft: 15, }}
                  placeholder='Enter phone number'
                  keyboardType='numeric'
                  onFocus={changeColor}
                  onBlur={revertColor}
                  onChangeText={text => setPhoneNumber(text)}
                ></TextInput>
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#DDDDDD', borderRadius: 50, width: 45, height: 45, justifyContent: 'center', alignItems: 'center', margin: 10, marginRight: 20 }}
                onPress={handleCheckProfile}
              >
                <Icon name='arrowright' size={22} color={'black'} />
              </TouchableOpacity>
            </View>

            <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 1, width: '100%', marginLeft: 20 }} />

            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}
              onPress={() => navigation.navigate('MeNavigator', { screen: 'QRScreen' })}
            >
              <Image source={require("../assets/qr-code_blue.png")} style={{ width: 25, height: 25, borderRadius: 2, margin: 15 }} />
              <Text style={{ fontSize: 16 }}>Scan QR Code</Text>
            </TouchableOpacity>

          </View>
          <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 7, width: '100%' }} />


          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
              <Icon name='contacts' size={25} color={'#002c8c'} style={{ margin: 15 }}></Icon>
              <Text style={{ fontSize: 16 }}>Phonebook</Text>
            </TouchableOpacity>
            <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 1, width: '100%', marginLeft: 20 }} />
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
              <Image source={require("../assets/peoplemayknow.png")} style={{ width: 25, height: 25, borderRadius: 2, margin: 15 }} />
              <Text style={{ fontSize: 16 }}>People you may know</Text>
            </TouchableOpacity>
          </View>


        </View>
        <View style={{ backgroundColor: '#EEEEEE', alignItems: 'center', flex: 2.3 }}>
          <Text style={{ color: '#999', marginTop: 20 }}>
            View sent friend requests in Contacts
          </Text>

        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalInvalidPhone}
      >
        <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ height: '25%', width: '90%', backgroundColor: 'white', padding: 10 }}>
            <Text style={{ fontSize: 20, alignSelf: 'flex-start', fontWeight: '600', margin: 10 }}>Notification</Text>
            <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 0.2, width: '100%' }} />
            <Text style={{ fontSize: 14, color: '#555555', alignSelf: 'flex-start' }}>The phone number is invalid. Please check again</Text>
            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: '18%' }}>
              <TouchableOpacity
                onPress={() => setModalInvalidPhone(false)}
                style={{ height: 50, width: 100, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 15, alignSelf: 'center', textAlign: 'center', fontWeight: '600' }}>CLOSE</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPhoneNotLinked}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#222222', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 16, color: 'white' }}>This phone number has not been linked to{"\n"} an account or does not allow searching</Text>
          </View>
        </View>
      </Modal>


    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddFriendScreen;
