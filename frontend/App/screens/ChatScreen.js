import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import React, { memo, useState, useRef, useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_LIST_CHAT } from '../api/Api';
import axios from 'axios';
const ChatScreen = () => {
  let navigation = useNavigation();
  let route = useRoute();
  const chatID = route.params?.chatID;
  const [myUserID, setMyUserID] = useState('');
  const [listChat, setListChat] = useState([{}]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChatVisible, setModalChatVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!chatID) {
          console.error('ChatID không tồn tại hoặc không hợp lệ');
          return;
        }
        const userID = await getUserID();
        setMyUserID(userID);
        console.log("USER ID: ", userID);
        const token = await getToken();
        console.log("TOKEN: ", token);
        const data = await fetchListChat(token, chatID, 1, 20);
        console.log("DATA CHAT: ", data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu chat:', error);
      }
    };
    fetchData();
  }, []);


  const getUserID = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      return userID;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
      return null;
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
      return null;
    }
  };
  const fetchListChat = async (token, chatID, x, y) => {
    try {
      console.log("TOKEN:------------- \n", token);
      console.log("hehehehhhhhhhhhhhhhhhh: \n", token);
      console.log("CHAT-------ID: \n", chatID);
      const response = await axios.get(`${API_LIST_CHAT}?id=${chatID}&x=${x}&y=${y}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log("Dữ liệu được trả về: ", data);
      setListChat(data);
      console.log("dữ liệu tronng chat:", data); // Log dữ liệu mới, không phải listChat
      return data; // Trả về dữ liệu mới thay vì listChat
    } catch (error) {
      console.error('Lỗi khi lấy thông tin Chat:', error);
      return null;
    }
  };


  const handlePress = () => {
    if (modalVisible) {
      setModalChatVisible(false);
    } else {
      navigation.navigate("ChatScreen");
    }
  };

  const handleLongPress = () => {
    setTimeout(() => {
      setModalChatVisible(true);
    }, 500);
  };


  const ChatItem = memo(({ item }) => {
    const [textHeight, setTextHeight] = useState(0);
    const touchableRef = useRef(null);

    const handleTextLayout = (e) => {
      const { height } = e.nativeEvent.layout;
      setTextHeight(height);
      if (touchableRef.current) {
        touchableRef.current.setNativeProps({
          style: { height: height + 20 } // 20 là padding dự phòng
        });
      }
    };
    const alignmentStyle = item.userID === myUserID ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
    const backgroundColorStyle = item.userID === myUserID ? { backgroundColor: '#CCFFFF' } : { backgroundColor: 'white' };
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          ref={touchableRef}
          onPress={handlePress}
          onLongPress={handleLongPress}
          style={{
            flexDirection: 'row',
            borderRadius: 12,
            backgroundColor: 'white',
            marginHorizontal: 10,
            alignItems: 'center',
            ...alignmentStyle,
            ...backgroundColorStyle,
            paddingHorizontal: 10,
            maxWidth: 280,
            marginLeft: 50
          }}
        >
          <Text
            onLayout={handleTextLayout}
            style={{ textAlign: 'center', flexWrap: 'wrap' }}
          >
            {item.timestamp}
            {/* hehe */}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 8 }} />
      </View>
    );
  },
    //   (prevProps, nextProps) => {
    //   return prevProps.item.messageID === nextProps.item.messageID;
    // }
  );


  // 6a1c22fa - 73d8 - 4332 - a801 - 4445f06a642d
  // 26ce60d1 - 64b9 - 45d2 - 8053 - 7746760a8354
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TabNavigator')}
        >
          <Icon name='arrowleft' color={'white'} size={25}></Icon>
        </TouchableOpacity>
        <View style={{ flexDirection: "column", marginLeft: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>He He</Text>
          <Text style={{ fontSize: 12, fontFamily: "Roboto", color: "white" }}>Last seen 5 hourse ago</Text>
        </View>

        <View style={{ flex: 3 }}></View>

        <Image
          style={{ width: 22, height: 22, resizeMode: "contain", margin: 8 }}
          source={require("../assets/telephone.png")}
        />
        <Image
          style={{ width: 28, height: 28, resizeMode: "contain", margin: 10 }}
          source={require("../assets/video.png")}
        />
        <Image
          style={{ width: 20, height: 20, resizeMode: "contain", margin: 8 }}
          source={require("../assets/list.png")}
          onStartShouldSetResponder={() => navigation.navigate("OpionNavigator", { screen: "OptionScreen" })}
        />
      </View>



      <View style={{ flex: 9 }}>

        <FlatList
          data={listChat}
          renderItem={({ item }) => item && <ChatItem item={item} />}
          keyExtractor={(item, index) => item?.messageID ?? index.toString()}
        />


      </View>





















      <View style={styles.foter}>
        <Image
          style={{ width: 22, height: 22, resizeMode: "contain", marginLeft: 8 }}
          source={require("../assets/face.png")}
        />
        <TextInput style={{
          flex: 1,
          borderRadius: 5, fontSize: 20,
          marginLeft: 10, color: "#808080", justifyContent: "center",
        }}
          placeholder="Message" placeholderTextColor={'gray'}>

        </TextInput>
        <View style={{ flexDirection: 'row', flex: 0.8, justifyContent: 'space-between', marginBottom: 5, marginRight: -5 }}>
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
            <Image
              style={{ width: 30, height: 30, resizeMode: "contain", marginLeft: 2 }}
              source={require("../assets/morechat.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ justifyContent: 'center' }}>
            <Image
              style={{ width: 23, height: 23, resizeMode: "contain" }}
              source={require("../assets/microphone.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ justifyContent: 'center', marginBottom: 5 }}>
            <EvilIcon name='image' size={38} color={'gray'}></EvilIcon>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0EEEE',
  },
  header: {
    height: 50,
    backgroundColor: "#1E90FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  foter: {
    height: 48,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
});
export default ChatScreen;

