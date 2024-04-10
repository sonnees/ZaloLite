import React, { memo, useState, useEffect, useContext } from 'react';
import { View, Modal, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Text, StatusBar, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getTimeDifference } from '../function/CalTime';
import { getDataFromConversationsAndChatData } from '../function/DisplayLastChat';
import { API_GET_LIST_CHATACTIVITY } from '../api/Api';
import { GlobalContext } from '../context/GlobalContext';
const MessagesScreen = () => {
  let navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChatVisible, setModalChatVisible] = useState(false);
  const { myUserInfo, setMyUserInfo } = useContext(GlobalContext)
  useEffect(() => {
    navigation.navigate("TabNavigator", { screen: 'Messages' });
  }, [myUserInfo]);
  const handlePress = (data) => {
    if (modalVisible) {
      setModalChatVisible(false);
    } else {
      navigation.navigate("ChatScreen", { conversationOpponent: data });
    }
  };

  const handleLongPress = () => {
    setTimeout(() => {
      setModalChatVisible(true);
    }, 500);
  };
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
  const fetchConversationOpponent = async (conversationOpponent) => {
    console.log("CONVERSATION", conversationOpponent);
    const chatID = conversationOpponent.chatID;
    const token = await AsyncStorage.getItem('token')
    const chatData = await fetchAllChatbychatID(chatID, token);
    const newChatData = getDataFromConversationsAndChatData(conversationOpponent, chatData);
    if (newChatData) {
      console.log("CONVERSATION WITH ALL CHATACTIVITY:\n", newChatData);
      return newChatData;
    }
    else {
      console.log("ERROR WHEN GET CONVERSATION WITH ALL CHATACTIVITY\n");
    }
  }
  const ChatElement = memo(({ item }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const newData = await fetchConversationOpponent(item);
        setData(newData);
      };

      fetchData();
    }, [item]);

    if (!data) {
      return null; // hoặc hiển thị một phần tử tải dữ liệu
    }
    console.log("DATA IN CHATELEMENT:\n", data);
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => handlePress(data)}
          onLongPress={handleLongPress}
          style={{ height: 75, flexDirection: 'row', width: '100%' }}
        >
          <Image style={{ width: 55, height: 55, resizeMode: "contain", borderRadius: 50, margin: 12, marginLeft: 20, marginRight: 20 }}
            source={{ uri: item.chatAvatar ? data.chatAvatar : null }} />

          <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: '400', marginBottom: 10 }}>{data.chatName ? data.chatName : null}</Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: 'gray', marginBottom: 10 }}>
              {data.topChatActivity && data.topChatActivity.length > 0 ? data.topChatActivity[data.topChatActivity.length - 1].contents[0].value : 'Chưa có cuộc trò chuyện nào'}
            </Text>

          </View>

          <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, flexDirection: 'row', marginBottom: 30, marginRight: -20 }}>
            <Icon name='pushpin' size={13} color={'#d9d9d9'} style={{ marginRight: 5 }}></Icon>
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: 'black' }}>
              <Text style={{ fontSize: 12.5, fontWeight: '600', color: 'black' }}>
                {/* hello */}
                {data.topChatActivity && data.topChatActivity.length > 0 ? getTimeDifference(data.topChatActivity[data.topChatActivity.length - 1].timestamp) : ''}
              </Text>

            </Text>
          </View>

          <View style={{ height: 17, width: 20, borderRadius: 45, backgroundColor: '#BBBBBB', marginTop: 45, marginRight: 15, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '500', color: 'white', textAlign: 'center' }}>2+</Text>
          </View>

        </TouchableOpacity>
        <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 0.45, width: '100%', marginLeft: 100 }} />
      </View>
    );
  }, (prevProps, nextProps) => {
    return prevProps.item.chatID === nextProps.item.chatID;
  });


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <StatusBar />
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 48 }}>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 14 }}>
            <Icon name='search1' size={22} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 7, borderRadius: 5, backgroundColor: "transparent", height: 40, width: 300, justifyContent: "center", alignItems: "flex-start" }}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Text style={{ marginLeft: 20, fontSize: 15.5, color: "#CCCCCC" }}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginRight: 18 }}
            onPress={() => navigation.navigate('MeNavigator', { screen: 'QRScreen' })}
          >
            <Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={require("../assets/qr-code.png")} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginRight: 10 }}
            onPress={() => { setModalVisible(true) }}
          >
            <Icon name='plus' size={28} color={'white'} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "space-between", backgroundColor: "#fff", height: 43 }}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignContent: "space-between" }}>
            <TouchableOpacity style={styles.buttonNav}>
              <Text style={{ fontSize: 15.5, color: "gray", fontWeight: '500' }}>Focused</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonNav}>
              <Text style={{ fontSize: 15.5, color: "gray", fontWeight: '500' }}> Other</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", marginRight: 15 }}>
            <Icon name='filter' size={24} color={'gray'}></Icon>
          </TouchableOpacity>
        </View>
        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.2, width: '100%' }} />

        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <FlatList
            data={myUserInfo.conversations}
            renderItem={({ item }) => <ChatElement item={item} />}
            keyExtractor={(item) => item.chatID}
          />
        </View>

      </View>

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', backgroundColor: 'transparent', margin: 6 }}>
            <View style={{ backgroundColor: 'white', height: 285, width: 200, borderRadius: 2, elevation: 5 }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', backgroundColor: 'transparent', margin: 6 }}>
                <View style={{ backgroundColor: 'white', height: 285, width: 200, borderRadius: 2, elevation: 5 }}>
                  <TouchableOpacity
                    style={styles.buttonInModal}
                    onPress={() => {
                      navigation.navigate('AddFriendScreen', { typeScreen: "MessagesScreen" });
                      setModalVisible(false)
                    }}>
                    <Icon name='adduser' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>Add friend</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonInModal}
                    onPress={() => setModalVisible(false)}>
                    <Icon name='addusergroup' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>Create group</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonInModal}
                    onPress={() => setModalVisible(false)}>
                    <Icon name='cloudo' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>My Cloud</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonInModal}
                    onPress={() => setModalVisible(false)}>
                    <Icon name='calendar' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>Zalo Calendar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonInModal}
                    onPress={() => setModalVisible(false)}>
                    <Icon name='videocamera' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>Create group call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonInModal}
                    onPress={() => setModalVisible(false)}>
                    <Icon name='iconfontdesktop' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>Logged-in devices</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* MODAL CHAT */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalChatVisible}
        onRequestClose={() => {
          setModalChatVisible(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setModalChatVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', height: 420, width: 300, borderRadius: 2, elevation: 5 }}>
              <View style={{ flexDirection: 'row', height: 70, alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20 }}>Thiện Đạt</Text>
                <TouchableOpacity style={{ borderWidth: 0.2, borderRadius: 50, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', margin: 10, marginRight: 20 }}>
                  <Image style={{ width: 13, height: 13, resizeMode: "contain" }} source={require("../assets/draw.png")} />
                </TouchableOpacity>
              </View>
              <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.2, width: '100%' }} />
              <TouchableOpacity style={styles.buttonInChatModal}>
                <Text style={styles.textInModal}>Move to Other</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonInChatModal}>
                <Text style={styles.textInModal}>Hide conversation</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonInChatModal}>
                <Text style={styles.textInModal}>Manage blocking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonInChatModal}>
                <Text style={styles.textInModal}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonInChatModal}>
                <Text style={styles.textInModal}>Mark as read</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonInChatModal}>
                <Text style={styles.textInModal}>Enable Bubble Chat mode</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonInChatModal}>
                <Text style={styles.textInModal}>Mute</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonInModal: {
    flexDirection: 'row',
    margin: 11.5,
    alignItems: 'center',
    marginTop: 13,
    marginLeft: 20
  },
  textInModal: {
    marginLeft: 10,
    fontSize: 16
  },
  buttonNav: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonInChatModal: {
    flexDirection: 'row',
    margin: 11.5,
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 20
  },
});

export default MessagesScreen;
