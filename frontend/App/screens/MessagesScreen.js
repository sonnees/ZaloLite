import React, { memo, useState, useEffect, useContext } from 'react';
import { View, Modal, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Text, StatusBar, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { getTimeDifference } from '../function/CalTime';
import { getDataFromConversations } from '../function/DisplayLastChat';
import { API_INFOR_USER } from '../api/Api';
import { UserInfoContext } from '../App';
const MessagesScreen = () => {
  let navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [colorTextInView, setColorTextInView] = useState("gray");
  const [modalChatVisible, setModalChatVisible] = useState(false);
  const [lastConversation, setLastConversation] = useState([]);
  const [conversation, setConversation] = useState([]);
  const { userInfo, setUserInfo, chatID, setChatID } = useContext(UserInfoContext)
  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      console.log(token);
      const userID = await getUserID();
      console.log(userID);
      fetchConversation(token, userID);
      console.log(lastConversation);
    };
    fetchData();
  }, []);
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
      return null;
    }
  };

  const getUserID = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      return userID;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
      return null;
    }
  };

  const fetchConversation = async (token, userID) => {
    try {
      const response = await axios.get(`${API_INFOR_USER}${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = await response.data;
      setUserInfo(user)
      const c = user.conversations
      setConversation(c);
      const updatedConversation = getDataFromConversations(c);
      setLastConversation(updatedConversation);
      console.log("User Infor:", lastConversation);
      return lastConversation;

    } catch (error) {
      console.error('Lỗi khi lấy thông tin User:', error);
      return null;
    }
  };
  const handlePress = (chatID) => {
    if (modalVisible) {
      setModalChatVisible(false);
    } else {
      setChatID(chatID)
      navigation.navigate("ChatScreen");
    }
  };

  const handleLongPress = () => {
    setTimeout(() => {
      setModalChatVisible(true);
    }, 500);
  };

  const ChatElement = memo(({ item }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => handlePress(item.chatID)}
          onLongPress={handleLongPress}
          style={{ height: 75, flexDirection: 'row', width: '100%' }}
        >
          <Image style={{ width: 55, height: 55, resizeMode: "contain", borderRadius: 50, margin: 12, marginLeft: 20, marginRight: 20 }}
            source={{ uri: item.chatAvatar ? item.chatAvatar : null }} />

          <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: '400', marginBottom: 10 }}>{item.chatName ? item.chatName : null}</Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: 'gray', marginBottom: 10 }}>{item.lastTopChatActivity.contents[0].value}</Text>
          </View>

          <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, flexDirection: 'row', marginBottom: 30, marginRight: -20 }}>
            <Icon name='pushpin' size={13} color={'#d9d9d9'} style={{ marginRight: 5 }}></Icon>
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: 'black' }}>{getTimeDifference(item.lastTopChatActivity.timestamp)}</Text>
          </View>

          <View style={{ height: 17, width: 20, borderRadius: 45, backgroundColor: '#BBBBBB', marginTop: 45, marginRight: 15, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '500', color: 'white', textAlign: 'center' }}>2+</Text>
          </View>

        </TouchableOpacity>
        <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 0.45, width: '100%', marginLeft: 100 }} />
      </View>
    );
  }, (prevProps, nextProps) => {
    return prevProps.item.id === nextProps.item.id;
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
              <Text style={{ fontSize: 15.5, color: colorTextInView, fontWeight: '500' }}>Focused</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonNav}>
              <Text style={{ fontSize: 15.5, color: colorTextInView, fontWeight: '500' }}> Other</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", marginRight: 15 }}>
            <Icon name='filter' size={24} color={'gray'}></Icon>
          </TouchableOpacity>
        </View>
        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.2, width: '100%' }} />
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <FlatList
            data={lastConversation}
            renderItem={({ item }) => <ChatElement item={item} />}
            keyExtractor={(item) => item.chatID}
          />
        </View>
      </View>
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
