import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import React, { memo, useState, useRef, useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native'
// import chat from '../data/chat.js';
const ChatScreen = () => {
  let navigation = useNavigation();
  let route = useRoute();
  const chatData = route.params?.chatData;
  console.log("Chat Screen Data: ", chatData);

  const chat = [{
    _id: "uuid1",
    chatActivity: [
      // Thêm các tin nhắn cũ hơn ở đây
      {
        messageID: "mmid4",
        userID: "1",
        timetamp: "2024-01-19T18:45:00Z",
        parentID: "",
        content: [{
          key: "text",
          value: "Xin chào! Bạn đã ăn tối chưa?"
        }],
        status: {
          isSent: true,
          delivery: ["1"],
          read: []
        }
      }, {
        messageID: "mmid5",
        userID: "2",
        timetamp: "2024-01-19T19:00:00Z",
        parentID: "",
        content: [{
          key: "text",
          value: "Chưa, bạn muốn đi ăn cùng không?"
        }],
        status: {
          isSent: true,
          delivery: ["1"],
          read: []
        }
      }, {
        messageID: "mmid6",
        userID: "1",
        timetamp: "2024-01-19T19:05:00Z",
        parentID: "",
        content: [{
          key: "text",
          value: "Được chứ, hẹn bạn ở đâu?"
        }],
        status: {
          isSent: true,
          delivery: ["1"],
          read: []
        }
      }, {
        messageID: "mmid7",
        userID: "2",
        timetamp: "2024-01-19T19:10:00Z",
        parentID: "",
        content: [{
          key: "text",
          value: "Hôm nay mình ăn ở nhà hàng gần công viên."
        }],
        status: {
          isSent: true,
          delivery: ["1"],
          read: []
        }
      },
      {
        messageID: "mmid1",
        userID: "1",
        timetamp: "2024-01-20T12:30:00Z",
        parentID: "",
        content: [{
          key: "text",
          value: "Chào bạn! Hôm nay bạn đã làm gì mới?"
        }],
        status: {
          isSent: true,
          delivery: ["1"],
          read: [2]
        }
      },
      {
        messageID: "mmid2",
        userID: "2",
        timetamp: "2024-01-20T12:30:00Z",
        parentID: "",
        content: [{
          key: "text",
          value: "Tôi đã đi chơi với bạn bè. 11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
        }],
        status: {
          isSent: true,
          delivery: ["1"],
          read: []
        }
      },
      {
        messageID: "mmid3",
        userID: "2",
        timetamp: "2024-01-20T11:55:00Z",
        parentID: "",
        content: [{
          key: "text",
          value: "Oke kkkk"
        }],
        status: {
          isSent: true,
          delivery: ["1"],
          read: []
        }
      },

    ]
  }]
  const data = chat[0].chatActivity;

  const [modalChatVisible, setModalChatVisible] = useState(false);

  const handlePress = () => {
    // Kiểm tra nếu modal đã hiển thị, thì đóng modal
    if (modalVisible) {
      setModalChatVisible(false);
    } else {
      // Nếu modal chưa hiển thị, thực hiện navigate qua TabNavigator
      navigation.navigate("ChatScreen");
    }
  };

  const handleLongPress = () => {
    // Hiển thị modal khi người dùng nhấn giữ lâu hơn 0.5 giây
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

    const alignmentStyle = item.userID === "1" ? { alignSelf: 'flex-start' } : { alignSelf: 'flex-end' };

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
            paddingHorizontal: 10,
            maxWidth: 280,
            marginLeft: 50
          }}
        >
          <Text
            onLayout={handleTextLayout}
            style={{ textAlign: 'center', flexWrap: 'wrap' }}
          >
            {item.content[0].value}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 8 }} />
      </View>
    );
  });




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
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>{chatData.chatName}</Text>
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
          data={data}
          renderItem={({ item }) => <ChatItem item={item} />}
          keyExtractor={(item) => item.messageID} // Sử dụng trường messageID làm key
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
    backgroundColor: '#abcdff',
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

