import React, { memo, useState, useEffect, useContext, useRef, useMemo } from 'react';
import { View, Modal, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Text, StatusBar, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getTimeDifference } from '../utils/CalTime';
import { getDataFromConversationsAndChatData } from '../utils/DisplayLastChat';
import { API_GET_LIST_CHATACTIVITY, CHAT_SOCKET } from '../api/API';
import { GlobalContext } from '../context/GlobalContext';
import { PlusModal } from '../modal/plusModal';
import { ChatModal } from '../modal/chatModal';
import { SocketContext } from '../context/SocketContext';
import { findReadUser } from '../utils/FindConservation';
const MessagesScreen = () => {
  let navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChatVisible, setModalChatVisible] = useState(false);
  const { myUserInfo, myProfile } = useContext(GlobalContext)
  const [allConversation, setAllConversation] = useState([]);
  const [data, setData] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(); // Call your function to fetch data
    setRefreshing(false);
  };
  useEffect(() => {
    loadData()
  }, [myUserInfo]);

  const loadData = () => {
    setAllConversation(myUserInfo.conversations)
  }
  const handlePress = (data) => {
    if (modalChatVisible) {
      setModalChatVisible(false);
    } else {
      if (data.type !== "GROUP") {
        // setSocket
        navigation.navigate("ChatScreen", { conversationOpponent: data });
      } else {
        navigation.navigate("ChatGroupScreen", { conversationOpponent: data });
      }

    }
  };

  const handleLongPress = (data) => {
    setData(data);
    setModalChatVisible(true);
  };
  const fetchAllChatbychatID = async (chatID, token) => {
    try {
      const response = await axios.get(`${API_GET_LIST_CHATACTIVITY}${chatID}&x=0&y=1000`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allChatActivity = response.data;
      // console.log("ALL CHATACTIVITY: ", allChatActivity);
      if (allChatActivity) {
        return allChatActivity;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin tất cả đoạn chat:', error);
      return null;
    }
  }
  const fetchConversationOpponent = async (conversationOpponent) => {
    // console.log("CONVERSATION", conversationOpponent);
    const chatID = conversationOpponent.chatID;
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token không tồn tại');
      return null;
    }
    const chatData = await fetchAllChatbychatID(chatID, token);
    const newChatData = chatData ? getDataFromConversationsAndChatData(conversationOpponent, chatData) : null;
    if (newChatData) {
      // console.log("CONVERSATION WITH ALL CHATACTIVITY:\n", newChatData);
      return newChatData;
    } else {
      console.log("ERROR WHEN GET CONVERSATION WITH ALL CHATACTIVITY\n");
      return null;
    }
  }
  const ChatElement = memo(({ item, onLongPress }) => {
    const [data, setData] = useState(null);
    const { socket, setSocket } = useContext(SocketContext);
    const itemRef = useRef(item);
    const [timeDifference, setTimeDifference] = useState('');
    const readUserData = useMemo(() => {
      if (data) {
        return findReadUser(data, myProfile.userID);
      }
    }, [data, myProfile.userID]);

    useEffect(() => {
      itemRef.current = item;
    }, [item]);

    useEffect(() => {
      if (itemRef.current.chatID) {
        const newSocket = new WebSocket(`${CHAT_SOCKET}/${itemRef.current.chatID}`);
        newSocket.onopen = () => {
          // console.log("WebSocket for chatID: ", itemRef.current.chatID, " OPENED");
        };
        newSocket.onmessage = (event) => {
          const data = event.data;
          function isJSON(data) {
            try {
              JSON.parse(data);
              return true;
            } catch (error) {
              return false;
            }
          }
          if (isJSON(data)) {
            const jsonData = JSON.parse(data);
    
            console.log("Message received in CHAT ELEMENT:", jsonData);
            if (jsonData.tcm === "TCM00" || jsonData.tcm === "TCM01") {
              fetchData();
            }
          }
        };
        setSocket(newSocket);
    
        return () => {
          newSocket.close();
        };
      }
    }, []);
    

    useEffect(() => {
      fetchData();
    }, []);

    useEffect(() => {
      if (data && data.topChatActivity && data.topChatActivity.length > 0) {
        const intervalId = setInterval(() => {
          const newTimeDifference = getTimeDifference(data.topChatActivity[data.topChatActivity.length - 1].timestamp);
          setTimeDifference(newTimeDifference);
        }, 1000); // Cập nhật mỗi 60 giây

        return () => {
          clearInterval(intervalId);
        };
      }
    }, [data]);

    const fetchData = async () => {
      const newData = await fetchConversationOpponent(itemRef.current);
      setData(newData);
    };
    if (!data) {
      return null;
    }

    let textColor = "gray";
    if (
      data.topChatActivity &&
      data.topChatActivity.length > 0 &&
      data.topChatActivity[data.topChatActivity.length - 1].userID &&
      data.topChatActivity[data.topChatActivity.length - 1].userID === myProfile.userID
    ) {
      textColor = "gray";
    } else if (
      data.deliveries &&
      data.deliveries.length > 0 &&
      data.reads &&
      (readUserData === null ||
        (readUserData &&
          readUserData.messageID !== data.topChatActivity[data.topChatActivity.length - 1].messageID))
    ) {
      textColor = "black";
    } else {
      textColor = "gray";
    }

    let textFontWeight = "400";
    if (
      data.topChatActivity &&
      data.topChatActivity.length > 0 &&
      data.topChatActivity[data.topChatActivity.length - 1].userID &&
      data.topChatActivity[data.topChatActivity.length - 1].userID === myProfile.userID
    ) {
      textFontWeight = "400";
    } else if (
      data.deliveries &&
      data.deliveries.length > 0 &&
      data.reads &&
      (readUserData === null ||
        (readUserData &&
          readUserData.messageID !== data.topChatActivity[data.topChatActivity.length - 1].messageID))
    ) {
      // console.log((readUserData &&
      //   readUserData.messageID !== data.topChatActivity[data.topChatActivity.length - 1].messageID));
      if (readUserData)
        // console.log("Value of findReadUser:", readUserData.messageID);
      // console.log("Value of topChatActivity:", data.topChatActivity[data.topChatActivity.length - 1].messageID);
      textFontWeight = "bold";
    } else {
      textFontWeight = "400";
    }



    let contentMessage = '';
    if (data.topChatActivity && data.topChatActivity.length > 0) {
      const lastContent = data.topChatActivity[data.topChatActivity.length - 1].contents[data.topChatActivity[data.topChatActivity.length - 1].contents.length - 1];
      const recallMess = data.topChatActivity[data.topChatActivity.length - 1].recall;
      const hidenMess = data.topChatActivity[data.topChatActivity.length - 1].hidden.includes(myProfile.userID);
      const key = lastContent.key;
      // console.log("Hidden",hidenMess);
      if (recallMess) {
        contentMessage = "Message recalled";
      }
      else if (lastContent && key.includes('|') && key.split('|').length >= 2 && !hidenMess) {
        contentMessage = '[File]';
      } else if (lastContent && (key === "text" || key === "emoji") && !hidenMess) {
        contentMessage = lastContent.value;
      } else if (lastContent && key === "image" && !hidenMess) {
        contentMessage = "[Hình Ảnh]";
      } else if (lastContent && key === "mp4" && !hidenMess) {
        contentMessage = "[Video]";
      } else if (lastContent && key === "link" && !hidenMess) {
        contentMessage = "[Link]";
      }
    } else {
      contentMessage = 'No message';
    }

    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => handlePress(data)}
          onLongPress={() => onLongPress(data)}
          style={{ height: 75, flexDirection: 'row', width: '100%' }}
        >
          <Image style={{ width: 55, height: 55, resizeMode: "cover", borderRadius: 50, margin: 12, marginLeft: 20, marginRight: 20 }}
            source={{ uri: item.chatAvatar ? data.chatAvatar : null }} />

          <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: '400', marginBottom: 10 }}>{data.chatName ? data.chatName : null}</Text>
            {/* <Text style={{ fontSize: 14, fontWeight: textFontWeight, color: textColor, marginBottom: 10}}> */}
            <Text style={{ fontSize: 14, color: "gray", marginBottom: 10}}>
            
              {contentMessage}
            </Text>

          </View>

          <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, flexDirection: 'row', marginBottom: 30,width:60,marginRight:10 }}>
            {/* <Icon name='pushpin' size={13} color={'#d9d9d9'} style={{ marginRight: 5 }}></Icon> */}
            <Text style={{ fontSize: 12.5, color: 'black'}}>
                {timeDifference}

            </Text>
          </View>

          {/* <View style={{ height: 17, width: 20, borderRadius: 45, backgroundColor: '#BBBBBB', marginTop: 45, marginRight: 15, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '500', color: 'white', textAlign: 'center' }}>2+</Text>
          </View> */}

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
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <StatusBar />
      <View style={{ flex: 1 }}>
        {/* Header and navigation */}
        <View
          style={{
            backgroundColor: "#1E90FF",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 48,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 14,
            }}
          >
            <Icon name="search1" size={22} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 7,
              borderRadius: 5,
              backgroundColor: "transparent",
              height: 40,
              width: 300,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Text style={{ marginLeft: 20, fontSize: 15.5, color: "#CCCCCC" }}>
              Tìm kiếm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 18,
            }}
            onPress={() =>
              navigation.navigate("MeNavigator", { screen: "QRScreen" })
            }
          >
            <Image
              style={{ width: 22, height: 22, resizeMode: "contain" }}
              source={require("../assets/qr-code.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Icon name="plus" size={28} color={"white"} />
          </TouchableOpacity>
        </View>
        {/* End of Header and navigation */}

        {/* Navigation Tabs */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "space-between",
            backgroundColor: "#fff",
            height: 43,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "space-between",
            }}
          >
            <TouchableOpacity style={styles.buttonNav}>
              <Text style={{ fontSize: 15.5, color: "gray", fontWeight: '500' }}>Ưu tiên</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonNav}>
              <Text style={{ fontSize: 15.5, color: "gray", fontWeight: '500' }}> Khác</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
              marginRight: 15,
            }}
          >
            <Icon name="filter" size={24} color={"gray"}></Icon>
          </TouchableOpacity>
        </View>
        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.2, width: '100%' }} />

        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <FlatList
            data={allConversation}
            renderItem={({ item }) => <ChatElement item={item} onLongPress={handleLongPress} />} // Truyền handleLongPress vào ChatElement
            keyExtractor={(item) => item.chatID}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ListFooterComponent={(
              <View style={{height:50}}>
                <TouchableOpacity style={{flex:1,borderRadius:20,backgroundColor:'#1E90FF',margin:5,marginHorizontal:70,justifyContent:'center'}}
                onPress={() => {
                  navigation.navigate("AddFriendScreen", {
                      typeScreen: "MessagesScreen",
                  });
              }}
                >
                  <Text style={{textAlign:'center',fontSize:16,fontWeight:'500',color:'white'}}>Thêm bạn để trò chuyện</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

      </View>
      {/* MODAL PLUS */}
      <PlusModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      {/* MODAL CHAT */}
      <ChatModal modalChatVisible={modalChatVisible} setModalChatVisible={setModalChatVisible} data={data} />

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonInModal: {
    flexDirection: "row",
    margin: 11.5,
    alignItems: "center",
    marginTop: 13,
    marginLeft: 20,
  },
  textInModal: {
    marginLeft: 10,
    fontSize: 16,
  },
  buttonNav: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonInChatModal: {
    flexDirection: "row",
    margin: 11.5,
    alignItems: "center",
    marginTop: 15,
    marginLeft: 20,
  },
});

export default MessagesScreen;