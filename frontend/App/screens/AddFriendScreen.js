import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView, StatusBar, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { useRoute } from '@react-navigation/native';
const AddFriendScreen = () => {
  const [borderColor, setBorderColor] = useState('gray');
  const [phoneCountry, setPhoneCountry] = useState('+84');
  const [backgroundPhone, setBackgroundPhone] = useState('#DDDDDD');
  const route = useRoute();
  const [typeScreen, setTypeScreen] = useState(route.params.typeScreen);

  useEffect(() => {
    if (route.params?.phoneCountry) {
      setPhoneCountry(route.params.phoneCountry);
    }
  }, [route.params?.phoneCountry]);


  let navigation = useNavigation();
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
        <TouchableOpacity style={{ paddingLeft: '2%', paddingRight: '4%' }}
          onPress={() => navigation.navigate("TabNavigator", { screen: typeScreen })}
        >
          <Icon name='arrowleft' size={22} color={'black'} />
        </TouchableOpacity>
        <Text style={{ fontSize: 15 }}>Add friends</Text>
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
                <TextInput style={{ flex: 2.5, marginLeft: 15 }} placeholder='Enter phone number'
                  onFocus={changeColor}
                  onBlur={revertColor}
                ></TextInput>
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#DDDDDD', borderRadius: 50, width: 45, height: 45, justifyContent: 'center', alignItems: 'center', margin: 10, marginRight: 20 }}
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
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddFriendScreen;
