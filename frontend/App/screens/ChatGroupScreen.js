import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, StatusBar, Keyboard, RefreshControl } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlobalContext } from '../context/GlobalContext';
import { ChatItem } from '../component/ChatVIewElement';
import * as ImagePicker from 'expo-image-picker';
import EmojiSelector from "react-native-emoji-selector";
import { findConversationByID } from '../utils/FindConservation';
import { getDataFromConversationsAndChatData } from '../utils/DisplayLastChat';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_GET_LIST_CHATACTIVITY, API_PROFILE_BY_USERID, CHAT_SERVER, host } from '../api/API';
import uuid from 'react-native-uuid'
import BackgroundInChat from '../component/BackgroundInChat';
// import DocumentPicker from 'react-native-document-picker';
const ChatGroupScreen = () => {
  let navigation = useNavigation();
  const route = useRoute();
  const { myUserInfo, setMyUserInfo, chatID, myProfile, setMyProfile,setComponentChatID } = useContext(GlobalContext)
  const componentChatID = route.params?.conversationOpponent.chatID;
  useEffect(() => {
    setComponentChatID(componentChatID);
  }, [componentChatID]);
  // console.log("CHATID NE: ", componentChatID);
  const [conversationOpponent, setconversationOpponent] = useState([])
  // Xử lý ảnh và File
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // Xử lý Emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // Xử lý Socket
  const [socket, setSocket] = useState(null);
  //Xử lý message
  const [message, setMessage] = useState('');
  const [contentType, setContentType] = useState("text"); // Mặc định là gửi tin nhắn text
  const [textInputHeight, setTextInputHeight] = useState(40); // Chiều cao ban đầu là 20

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Call your function to fetch data
    setRefreshing(false);
  };



  const flatListRef = useRef();

  const handleContentChange = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleContentSizeChange = (event) => {
    const newHeight = Math.max(20, event.nativeEvent.contentSize.height);
    if (newHeight <= 4 * 20) { // 4 hàng * chiều cao của mỗi hàng (20)
      setTextInputHeight(newHeight);
    }

  };

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
    // fetchProfileInfo(myUserInfo.id, token)
  }
  
  //Fectch Data
  useEffect(() => {
    fetchData()
  }, [myUserInfo]);

  useEffect(() => {
    if (socket) {
      console.log("WEBSOCKET WAS TURN ON");
      // console.log("Socket", socket);
      socket.onmessage = (event) => {
        const data = event.data;
        console.log("Received data:", data);
        // Check if the data starts with an opening curly brace, indicating it's a JSON object
        if (data.trim().startsWith('{')) {
          try {
            const jsonData = JSON.parse(data);
            if (jsonData.tcm === "TCM00" && jsonData.typeNotify === "SUCCESS") {
              // console.log("NEW MESSAGE", messageSocket);
              // // Kiểm tra nếu conversationOpponent.topChatActivity đã được khởi tạo và là một mảng
              // if (conversationOpponent.topChatActivity && Array.isArray(conversationOpponent.topChatActivity)) {
              //   // Thực hiện phép toán push trên mảng
              //   conversationOpponent.topChatActivity.push(messageSocket);
              //   console.log("ADD SUCCESS");
              // } else {
              // }
              // const updateConversationOpponentInUserInfo = () => {
              //   const updatedConversations = myUserInfo.conversations.map(conversation => {
              //     if (conversation.chatID === conversationOpponent.chatID) {
              //       // Nếu tìm thấy conversationOpponent trong mảng conversations của myUserInfo
              //       // Thực hiện cập nhật dữ liệu cho nó với dữ liệu mới từ conversationOpponent
              //       return conversationOpponent;
              //     } else {
              //       // Nếu không tìm thấy, giữ nguyên dữ liệu
              //       return conversation;
              //     }
              //   });
              //   // Cập nhật lại mảng conversations trong myUserInfo với dữ liệu đã được cập nhật
              //   setMyUserInfo({ ...myUserInfo, conversations: updatedConversations });
              // };
              // // Gọi hàm để cập nhật conversationOpponent trong myUserInfo
              // updateConversationOpponentInUserInfo();
              fetchData()
            }
            if (jsonData.tcm === "TCM01") {
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
                console.log("ADD SUCCESS");
              } else {
                // Nếu conversationOpponent.topChatActivity chưa được khởi tạo hoặc không phải là một mảng, thông báo lỗi
                // console.log('ERR: conversationOpponent.topChatActivity is not initialized or not an array');
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
            }
            if (jsonData.tcm === "TCM02") {
              fetchData()
            }
            if (jsonData.tcm === "TCM03") {
              fetchData()
            }
          } catch (error) {
            console.error("Error parsing JSON data:", error);
          }
        } else {
          console.log("Received data is not a JSON object, ignoring...");
        }
      };
      return () => {
        socket.onmessage = null;
      };
    } else {
      console.log("WEBSOCKET NOT ON");
    }
  }, [myUserInfo, socket]);

  // Xử lý Reload dữ liệu
  const fetchAllChatbychatID = async (chatID, token) => {
    try {
      const response = await axios.get(`${API_GET_LIST_CHATACTIVITY}${chatID}&x=0&y=1000`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allChatActivity = await response.data;
      // console.log("ALL CHATACTIVITY: ", allChatActivity);
      if (allChatActivity)
        return allChatActivity;
      else
        return null;

    } catch (error) {
      console.error('Lỗi khi lấy thông tin tất cả đoạn chat:', error);
      return null;
    }
  }

  // Xử lý Emoji
  const handleEmojiSelect = (emoji) => {
    // console.log("Emoji selected:", emoji);
    setMessage(message + emoji);
  };
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    Keyboard.dismiss();
  };
  const handleTextInputFocus = () => {
    setShowEmojiPicker(false);
  };
  useEffect(() => {
    const newSocket = new WebSocket(`${CHAT_SERVER}/ws/chat/${componentChatID}`);
    newSocket.onopen = () => {
      console.log("WebSocket connected >>>>>>>>");
    };
    setSocket(newSocket);
  }, [componentChatID]);

  const sendMessageWithTextViaSocket = (messageContent, contentType, parentID) => {
    if (socket) {
      messageSocket = {
        id: uuid.v4(),
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
        
      } else if (contentType === "image") {
        // Lấy phần tử đầu tiên trong mảng contents
        messageSocket.contents.push({
          key: "image",
          value: messageContent, // Đây là đường dẫn URL của file
        });
        
      }else if (contentType === "emoji") {
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
      // console.log("MESSAGE:__________", messageSocket);
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
      // console.log("Gửi tin nhắn:", message);
      sendMessageWithTextViaSocket(message, "text", null);
    } else if (contentType === "file" && imageUrl) {
      // console.log("Gửi file:", imageUrl);
      sendMessageWithTextViaSocket(imageUrl, "file", null);
    }
  };
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
        // console.error('Lỗi khi xử lý ảnh:', error);
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
      // console.log('Upload successful:', responseData);

      const imageUrl = responseData.secure_url;
      console.log(">>>>>>>>>>",responseData.secure_url);
      sendMessageWithTextViaSocket(imageUrl,"image",null)
      return imageUrl;

    } catch (error) {
      console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
      throw error;
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
        <View style={{ flexDirection: 'row', }}>
          <Icon name='addusergroup' size={22} color={'white'} style={{ margin: 10 }} />
          <Icon name='search1' size={22} color={'white'} style={{ margin: 10 }} />
          <Image
            style={{ width: 20, height: 20, resizeMode: "contain", margin: 10 }}
            source={require("../assets/list.png")}
            onStartShouldSetResponder={() => navigation.navigate("OpionNavigator", { screen: "OptionScreen" })}
          />
        </View>
      </View>
      {conversationOpponent.topChatActivity && conversationOpponent.topChatActivity.length > 0 && (
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            onContentSizeChange={handleContentChange}
            ListHeaderComponent={(
              <BackgroundInChat
                conversationOpponent={conversationOpponent}
              />
            )}
            data={conversationOpponent.topChatActivity}
            renderItem={({ item, index }) =>
              <ChatItem
                index={index}
                item={item}
                friend={false}
                conversationOpponent={conversationOpponent}
                 />}

            keyExtractor={(item) => item.messageID}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ListFooterComponent={(
              <View style={{ height: 10 }}></View>
            )}
          />

        </View>
      )}
      {!conversationOpponent.topChatActivity || conversationOpponent.topChatActivity.length === 0 && (
        <View style={{ flex: 1 }}>
          <BackgroundInChat
            conversationOpponent={conversationOpponent}
          />
        </View>
      )}
      <View style={[styles.footer, { height: textInputHeight + 8 }]}>
        <TouchableOpacity onPress={toggleEmojiPicker}>
          <Image
            style={{ width: 22, height: 22, resizeMode: "contain", marginLeft: -10, marginBottom: 8 }}
            source={require("../assets/face.png")}
          />
        </TouchableOpacity>
        <TextInput
          style={[styles.textInput, { height: textInputHeight }]}
          multiline={true}
          placeholder="Message"
          placeholderTextColor={'gray'}
          onChangeText={(text) => setMessage(text)}
          value={message}
          onContentSizeChange={handleContentSizeChange}
        />
        {message.length === 0 && (
          <View style={{ flexDirection: 'row', flex: 0.8, justifyContent: 'space-between', marginBottom: 5, width: 80, marginRight: -15 }}>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'flex-start' }} >
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
  footer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderTopWidth: 0.3,
    borderTopColor: '#CCCCCC',
    minHeight: 40,
  },
  textInput: {
    width: 180,
    borderRadius: 5,
    fontSize: 20,
    marginLeft: 10,
    color: "#808080",
    justifyContent: "center",
    minHeight: 20,
    marginBottom: 5
  },
});
export default ChatGroupScreen;