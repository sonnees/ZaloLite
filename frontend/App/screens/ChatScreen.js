import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlobalContext } from '../context/GlobalContext';
import { ChatItem } from '../component/ChatVIewElement';

const ChatScreen = () => {
  let navigation = useNavigation();
  const route = useRoute();
  const conversationOpponent = route.params?.conversationOpponent;
  console.log("conversationOpponent data from MESSAGESCREEN \n", conversationOpponent);
  const [videoKey, setVideoKey] = useState(0);
  const { myUserInfo, setMyUserInfo } = useContext(GlobalContext)
  console.log("MY USER ID\n", myUserInfo.id);

  const [message, setMessage] = useState('');
  useEffect(() => {
    navigation.navigate("ChatScreen", { conversationOpponent: conversationOpponent });
  }, [myUserInfo]);

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
        {conversationOpponent.type !== "GROUP" && (
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
        {conversationOpponent.type === "GROUP" && (
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
            renderItem={({ item, index }) => <ChatItem messageID={item.messageID} index={index} item={item} conversationOpponent={conversationOpponent} myUserInfo={myUserInfo} />}
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
        <Image
          style={{ width: 22, height: 22, resizeMode: "contain", marginLeft: 8 }}
          source={require("../assets/face.png")}
        />
        <TextInput style={{
          flex: 1,
          borderRadius: 5, fontSize: 20,
          marginLeft: 10, color: "#808080", justifyContent: "center",
        }}
          placeholder="Message" placeholderTextColor={'gray'} onChangeText={(text) => setMessage(text)}>
        </TextInput>
        {message.length === 0 && (
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
        )}
        {message.length > 0 && (
          <View style={{ flexDirection: 'row', flex: 0.8, justifyContent: 'flex-end', marginBottom: 5, marginRight: -5 }}>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
              <Image
                style={{ width: 30, height: 30, resizeMode: "contain", marginRight: 5 }}
                source={require("../assets/send.png")}
              />
            </TouchableOpacity>
          </View>
        )}
      </View >
    </SafeAreaView >
  );
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
    justifyContent: 'center',
  },
});

export default ChatScreen;
