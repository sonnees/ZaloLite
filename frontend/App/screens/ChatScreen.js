import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, StatusBar, Keyboard } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlobalContext } from '../context/GlobalContext';
import { ChatItem } from '../component/ChatVIewElement';
import * as ImagePicker from 'expo-image-picker';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { findConversationByID } from '../utils/FindConservation';
import { getDataFromConversationsAndChatData } from '../utils/DisplayLastChat';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_GET_LIST_CHATACTIVITY, API_PROFILE_BY_USERID } from '../api/API';

// import DocumentPicker from 'react-native-document-picker';
const ChatScreen = () => {
  let navigation = useNavigation();
  const route = useRoute();
  const { myUserInfo, setMyUserInfo, chatID } = useContext(GlobalContext)
  const componentChatID = route.params?.conversationOpponent.chatID;
  console.log("CHATID NE: ", componentChatID);
  const [conversationOpponent, setconversationOpponent] = useState([])
  //Profile
  const [myProfile, setMyProfile] = useState({});
  // Xử lý ảnh và File
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  //Xử lý message
  const [message, setMessage] = useState('');
  const [contentType, setContentType] = useState("text"); // Mặc định là gửi tin nhắn text
  // Xử lý Emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  // Xử lý Socket
  const [socket, setSocket] = useState(null);
  //Fectch Data
  useEffect(() => {
    const fetchData = async () => {
      const conversationData = findConversationByID(myUserInfo.conversations, componentChatID)
      const fetchConversationOpponent = async (conversationOpponent) => {
        const chatID = conversationOpponent.chatID;
        const token = await AsyncStorage.getItem('token')
        const chatData = await fetchAllChatbychatID(chatID, token);
        const newChatData = getDataFromConversationsAndChatData(conversationOpponent, chatData);
        if (newChatData) {
          return newChatData;
        }
      }
      const newData = await fetchConversationOpponent(conversationData)
      setconversationOpponent(newData)
      const token = await AsyncStorage.getItem('token');
      fetchProfileInfo(myUserInfo.id, token)
    }
    fetchData()
  }, [myUserInfo]);
  useEffect(() => {
    if (socket) {
      console.log("WEBSOCKET WAS TURN ON");
      socket.onmessage = (event) => {
        const data = event.data;
        console.log("Received data:", data);
        try {
          const jsonData = JSON.parse(data);
          console.log("Received JSON data:", jsonData);
          const newTopChatActivity = {
            messageID: jsonData.id,
            userID: jsonData.userID,
            timestamp: jsonData.timestamp,
            parentID: jsonData.parentID,
            contents: jsonData.contents,
            hiden: [],
            recall: false,
          }
          console.log("NEW MESSAGE", newTopChatActivity);
          // Kiểm tra nếu conversationOpponent.topChatActivity đã được khởi tạo và là một mảng
          if (conversationOpponent.topChatActivity && Array.isArray(conversationOpponent.topChatActivity)) {
            // Thực hiện phép toán push trên mảng
            conversationOpponent.topChatActivity.push(newTopChatActivity);
            console.log("ADD SUCCESS", conversationOpponent);
          } else {
            // Nếu conversationOpponent.topChatActivity chưa được khởi tạo hoặc không phải là một mảng, thông báo lỗi
            console.log('ERR: conversationOpponent.topChatActivity is not initialized or not an array');
          }

          const updateConversationOpponentInUserInfo = () => {
            const updatedConversations = myUserInfo.conversations.map(conversation => {
              if (conversation.chatID === conversationOpponent.chatID) {
                // Nếu tìm thấy conversationOpponent trong mảng conversations của myUserInfo
                // Thực hiện cập nhật dữ liệu cho nó với dữ liệu mới từ conversationOpponent
                return conversationOpponent;
              } else {
                // Nếu không tìm thấy, giữ nguyên dữ liệu
                return conversation;
              }
            });
            // Cập nhật lại mảng conversations trong myUserInfo với dữ liệu đã được cập nhật
            setMyUserInfo({ ...myUserInfo, conversations: updatedConversations });
          };

          // Gọi hàm để cập nhật conversationOpponent trong myUserInfo
          updateConversationOpponentInUserInfo();
        } catch (error) {
          console.error("Error parsing JSON data:", error);
        }
      };

      // Ensure that the socket is closed when the component unmounts
      return () => {
        socket.onmessage = null;
      };
    }
    else {
      console.log("WEBSOCKET NOT ON");
    }
  }, [myUserInfo, socket]
    // [myUserInfo, conversationOpponent,socket]
  );
  // Xử lý Reload dữ liệu
  const fetchAllChatbychatID = async (chatID, token) => {
    try {
      const response = await axios.get(`${API_GET_LIST_CHATACTIVITY}${chatID}&x=0&y=1000`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allChatActivity = await response.data;
      console.log("ALL CHATACTIVITY: ", allChatActivity);
      if (allChatActivity)
        return allChatActivity;
      else
        return null;

    } catch (error) {
      console.error('Lỗi khi lấy thông tin tất cả đoạn chat:', error);
      return null;
    }
  }
  // const fetchConversationOpponent = async (conversationOpponent) => {
  //   const chatID = conversationOpponent.chatID;
  //   const token = await AsyncStorage.getItem('token')
  //   const chatData = await fetchAllChatbychatID(chatID, token);
  //   const newChatData = getDataFromConversationsAndChatData(conversationOpponent, chatData);
  //   if (newChatData) {
  //     return newChatData;
  //   }
  // }

  // Xử lý Emoji
  const handleEmojiSelect = (emoji) => {
    console.log("Emoji selected:", emoji);
    setMessage(message + emoji);
  };
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    Keyboard.dismiss();
  };
  const handleTextInputFocus = () => {
    setShowEmojiPicker(false);
  };

  // Xử lý hình ảnh
  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      multiple: true,
      maxFiles: 50,
    });
    console.log(result);
    if (!result.cancelled) {
      try {
        const imageUrl = await handleUpload(result.assets[0].uri);
        setSelectedImage(imageUrl);
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
      return imageUrl;
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
      throw error;
    }
  };
  //Xử lý file
  const handleChooseFiles = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });

      const files = results.map((result, index) => ({
        uri: result.uri,
        type: result.type,
        name: `file_${index + 1}.${result.uri.split('.').pop()}`,
      }));

      setSelectedFiles(files);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Hủy chọn tệp');
      } else {
        console.error('Lỗi khi chọn tệp:', error);
        Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi chọn tệp.');
      }
    }
  };
  const fetchProfileInfo = async (userID, token) => {
    try {
      const response = await axios.get(`${API_PROFILE_BY_USERID}${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("PROFILE FRIEND REQUEST:\n", response.data);
      setMyProfile(response.data)
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
  useEffect(() => {
    const newSocket = new WebSocket(`ws://192.168.1.7:8082/ws/chat/${componentChatID}`);
    newSocket.onopen = () => {
      console.log("WebSocket connected >>>>>>>>");
    };
    setSocket(newSocket);
  }, [componentChatID]);

  const sendMessageWithTextViaSocket = (messageContent, contentType, parentID) => {
    console.log("MY USER ID:__________", myProfile.userID);
    console.log("MY USER AVATAR:__________", myProfile.avatar);
    console.log("MY USER NAME:__________", myProfile.userName);
    console.log("TIMESTAMP:__________", new Date().toISOString());
    console.log("ID:__________", generateUUID());
    if (socket) {
      const messageSocket = {
        id: generateUUID(),
        tcm: "TCM01",
        userID: myProfile.userID,
        userAvatar: myProfile.avatar,
        userName: myProfile.userName,
        timestamp: new Date().toISOString(),
        parentID: parentID,
        contents: [],
      };
      // Thêm nội dung tương ứng vào tin nhắn
      if (contentType === "text") {
        messageSocket.contents.push({
          key: "text",
          value: messageContent,
        });
      } else if (contentType === "file") {
        // Lấy phần tử đầu tiên trong mảng contents
        const fileContent = messageContent.contents[0];
        messageSocket.contents.push({
          key: fileContent.key,
          value: fileContent.value, // Đây là đường dẫn URL của file
        });
      } else if (contentType === "emoji") {
        messageSocket.contents.push({
          key: "emoji",
          value: messageContent,
        });
      } else if (contentType === "link") {
        messageSocket.contents.push({
          key: "link",
          value: messageContent,
        });
      }
      console.log("MESSAGE:__________", messageSocket);
      socket.send(JSON.stringify(messageSocket));
      setMessage(""); // Xóa nội dung của input message sau khi gửi
    } else {
      console.error("WebSocket is not initialized.");
    }
  };
  const handleSendMessage = () => {
    if (message.startsWith("http://") || message.startsWith("https://")) {
      setKeyTypeMessage("link");
      sendMessageWithTextViaSocket(message, "link", null);
    } else if (contentType === "text" && message.trim() !== "") {
      console.log("Gửi tin nhắn:", message);
      sendMessageWithTextViaSocket(message, "text", null);
    } else if (contentType === "file" && imageUrl) {
      console.log("Gửi file:", imageUrl);
      sendMessageWithTextViaSocket(imageUrl, "file", null);
    }
  };

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
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>
            {conversationOpponent && conversationOpponent.chatName ? conversationOpponent.chatName : null}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: "Roboto", color: "white" }}>Last 5 hours</Text>
        </View>

        <View style={{ flex: 3 }}></View>
        {conversationOpponent.type && conversationOpponent.type !== "GROUP" && (
          <View style={{ flexDirection: 'row', }}>
            <Image
              style={{ width: 22, height: 22, resizeMode: "contain", margin: 10 }}
              source={require("../assets/telephone.png")}
            />
            <Image
              style={{ width: 28, height: 28, resizeMode: "contain", margin: 10 }}
              source={require("../assets/video.png")}
            />
            <Image
              style={{ width: 20, height: 20, resizeMode: "contain", margin: 10 }}
              source={require("../assets/list.png")}
              onStartShouldSetResponder={() => navigation.navigate("OpionNavigator", { screen: "OptionScreen" })}
            />
          </View>
        )}
        {conversationOpponent.type && conversationOpponent.type === "GROUP" && (
          <View style={{ flexDirection: 'row', }}>
            <Icon name='addusergroup' size={22} color={'white'} style={{ margin: 10 }} />
            <Icon name='search1' size={22} color={'white'} style={{ margin: 10 }} />
            <Image
              style={{ width: 20, height: 20, resizeMode: "contain", margin: 10 }}
              source={require("../assets/list.png")}
              onStartShouldSetResponder={() => navigation.navigate("OpionNavigator", { screen: "OptionScreen" })}
            />
          </View>
        )}
      </View>
      {conversationOpponent.topChatActivity && conversationOpponent.topChatActivity.length > 0 && (
        <View style={{ flex: 1 }}>
          {conversationOpponent.type == 'REQUESTED' && (
            <View
              style={{
                backgroundColor: 'white',
                height: 40, width: '100%',
                position: 'absolute', top: '50', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center',
                zIndex: 1
              }}
            >
              <Text style={{ marginLeft: 20 }}>Sent you a friend request</Text>
              <TouchableOpacity
                style={{
                  height: 30, width: 80, alignSelf: 'center', justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  backgroundColor: '#1E90FF', marginRight: 10
                }}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>ACCEPT</Text>
              </TouchableOpacity>
            </View>
          )}
          {conversationOpponent.type == 'REQUESTS' && (
            <View
              style={{
                backgroundColor: 'white',
                height: 40, width: '100%',
                position: 'absolute', top: '50', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center',
                zIndex: 1, justifyContent: 'center', alignContent: 'center'
              }}
            >
              <Icon name='adduser' size={20} color={'gray'}></Icon>
              <Text style={{ marginLeft: 10 }}>Friend request has been sent</Text>
            </View>
          )}
          {conversationOpponent.type == 'STRANGER' && (
            <View
              style={{
                backgroundColor: 'white',
                height: 40, width: '100%',
                position: 'absolute', top: '50', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center',
                zIndex: 1, justifyContent: 'center', alignContent: 'center'
              }}
            >
              <Icon name='adduser' size={20} color={'gray'}></Icon>
              <Text style={{ marginLeft: 10 }}>Add friend</Text>
            </View>
          )}
          <FlatList
            ListHeaderComponent={(
              <View
                style={{ height: 205, width: '85%', alignSelf: 'center', margin: 30, marginTop: 10, backgroundColor: 'white', borderRadius: 10 }}
              >
                <Image source={{ uri: 'https://i.pinimg.com/736x/c2/e9/02/c2e902e031e1d9d932411dd0b8ab5eef.jpg' }}
                  style={{ height: 120, width: '100%', alignSelf: 'center' }}
                />
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={conversationOpponent.chatAvatar ? { uri: conversationOpponent.chatAvatar } : null}
                    style={{ height: 70, width: 70, borderRadius: 50, margin: 10 }}
                  />

                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 12, marginLeft: 10 }}>
                      {conversationOpponent && conversationOpponent.chatName ? conversationOpponent.chatName : null}</Text>
                    <Text style={{ fontSize: 12, marginTop: 7, marginLeft: 10 }}>
                      No one can change my life</Text>
                  </View>
                </View>
              </View>
            )}
            data={conversationOpponent.topChatActivity}
            renderItem={({ item, index }) =>
              <ChatItem
                index={index}
                item={item}
                conversationOpponent={conversationOpponent}
                myUserInfo={myUserInfo} />}

            keyExtractor={(item) => item.messageID}
            ListFooterComponent={(
              <View style={{ height: 10 }}></View>
            )}
          />

        </View>
      )}
      {!conversationOpponent.topChatActivity || conversationOpponent.topChatActivity.length === 0 && (
        <View style={{ flex: 1 }}>
          {conversationOpponent.type == 'REQUESTED' && (
            <View
              style={{
                backgroundColor: 'white',
                height: 40, width: '100%',
                position: 'absolute', top: '50', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center',
                zIndex: 1
              }}
            >
              <Text style={{ marginLeft: 20 }}>Sent you a friend request</Text>
              <TouchableOpacity
                style={{
                  height: 30, width: 80, alignSelf: 'center', justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  backgroundColor: '#1E90FF', marginRight: 10
                }}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>ACCEPT</Text>
              </TouchableOpacity>
            </View>
          )}
          {conversationOpponent.type == 'REQUESTS' && (
            <View
              style={{
                backgroundColor: 'white',
                height: 40, width: '100%',
                position: 'absolute', top: '50', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center',
                zIndex: 1, justifyContent: 'center', alignContent: 'center'
              }}
            >
              <Icon name='adduser' size={20} color={'gray'}></Icon>
              <Text style={{ marginLeft: 10 }}>Friend request has been sent</Text>
            </View>
          )}
          {conversationOpponent.type == 'STRANGER' && (
            <View
              style={{
                backgroundColor: 'white',
                height: 40, width: '100%',
                position: 'absolute', top: '50', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center',
                zIndex: 1, justifyContent: 'center', alignContent: 'center'
              }}
            >
              <Icon name='adduser' size={20} color={'gray'}></Icon>
              <Text style={{ marginLeft: 10 }}>Add friend</Text>
            </View>
          )}
          <View
            style={{ height: 205, width: '85%', alignSelf: 'center', margin: 30, marginTop: 10, backgroundColor: 'white', borderRadius: 10 }}
          >
            <Image source={{ uri: 'https://i.pinimg.com/736x/c2/e9/02/c2e902e031e1d9d932411dd0b8ab5eef.jpg' }}
              style={{ height: 120, width: '100%', alignSelf: 'center' }}
            />
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={conversationOpponent.chatAvatar ? { uri: conversationOpponent.chatAvatar } : null}
                style={{ height: 70, width: 70, borderRadius: 50, margin: 10 }}
              />

              <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 12, marginLeft: 10 }}>
                  {conversationOpponent && conversationOpponent.chatName ? conversationOpponent.chatName : null}</Text>
                <Text style={{ fontSize: 12, marginTop: 7, marginLeft: 10 }}>
                  No one can change my life</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      < View style={styles.foter} >
        <TouchableOpacity onPress={toggleEmojiPicker}>
          <Image
            style={{ width: 22, height: 22, resizeMode: "contain", marginLeft: 8 }}
            source={require("../assets/face.png")}
          />
        </TouchableOpacity>
        <TextInput style={{
          flex: 1,
          borderRadius: 5, fontSize: 20,
          marginLeft: 10, color: "#808080", justifyContent: "center",
        }}
          placeholder="Message"
          placeholderTextColor={'gray'}
          onChangeText={(text) => setMessage(text)}
          value={message}
          onFocus={handleTextInputFocus}
          onPressIn={handleTextInputFocus}
        >
        </TextInput>
        {message.length === 0 && (
          <View style={{ flexDirection: 'row', flex: 0.8, justifyContent: 'space-between', marginBottom: 5, marginRight: -5 }}>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'flex-start' }} onPress={handleChooseFiles}>
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

            <TouchableOpacity style={{ justifyContent: 'center', marginBottom: 5 }}
              onPress={handleChoosePhoto}
            >
              <EvilIcon name='image' size={38} color={'gray'}></EvilIcon>
            </TouchableOpacity>
          </View>
        )}
        {message.length > 0 && (
          <View style={{ flexDirection: 'row', flex: 0.8, justifyContent: 'flex-end', marginBottom: 5, marginRight: -5 }}>
            <TouchableOpacity
              style={{ justifyContent: 'center', alignItems: 'flex-start' }}
              onPress={handleSendMessage}
            >
              <Image
                style={{ width: 30, height: 30, resizeMode: "contain", marginRight: 5 }}
                source={require("../assets/send.png")}
              />
            </TouchableOpacity>
          </View>
        )}
      </View >
      {showEmojiPicker &&
        <View style={{ backgroundColor: 'white', height: '40%' }}>
          <EmojiSelector
            onEmojiSelected={handleEmojiSelect}
            showSearchBar={false}
          // Điều chỉnh kích thước của thanh tabs
          />
        </View>
      }
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
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
    justifyContent: 'center',
  },
});

export default ChatScreen;
const generateUUID = () => {
  const randomPart = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  return (
    randomPart() +
    randomPart() +
    '-' +
    randomPart() +
    '-0000-' +
    randomPart() +
    '-' +
    randomPart() +
    randomPart() +
    randomPart()
  );
};