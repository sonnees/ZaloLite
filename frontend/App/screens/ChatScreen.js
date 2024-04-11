import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, StatusBar, Linking, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import React, { memo, useState, useRef, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import VideoPlayer from 'expo-video-player';
// import Video from 'react-native-video';
import { Video } from 'expo-av';
import { ResizeMode } from 'expo-av'
import { GlobalContext } from '../context/GlobalContext';
import { ChatItem } from '../function/ChatVIewElement';

const ChatScreen = () => {
  let navigation = useNavigation();
  const route = useRoute();
  const conversationOpponent = route.params?.conversationOpponent;
  console.log("conversationOpponent data from MESSAGESCREEN \n", conversationOpponent);
  // const [videoKey, setVideoKey] = useState(0);
  const { myUserInfo, setMyUserInfo } = useContext(GlobalContext)
  console.log("MY USER ID\n", myUserInfo.id);

  const [message, setMessage] = useState('');
  useEffect(() => {
    navigation.navigate("ChatScreen", { conversationOpponent: conversationOpponent });
  }, [myUserInfo]);

  // const ChatItem = memo(({ item }) => {
  //   const [textHeight, setTextHeight] = useState(0);
  //   const touchableRef = useRef(null);
  //   const handleTextLayout = (e) => {
  //     const { height } = e.nativeEvent.layout;
  //     setTextHeight(height);
  //     if (touchableRef.current) {
  //       touchableRef.current.setNativeProps({
  //         style: { height: height + 20 } // 20 là padding dự phòng
  //       });
  //     }
  //   };
  //   const [imageSize, setImageSize] = useState({ width: null, height: null });

  //   const handleImageLoad = (event) => {
  //     const { width, height } = event.nativeEvent.source;
  //     setImageSize({ width, height });
  //   };
  //   const alignmentStyle = item.userID === myUserInfo.id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
  //   if (item.contents[0].key === 'text' || item.contents[0].key === 'emoji') {
  //     return (
  //       <View style={{ flexDirection: 'column' }}>
  //         <View style={{ alignItems: 'center', flexDirection: 'row' }}>
  //           <Image
  //             source={conversationOpponent.chatAvatar ? { uri: conversationOpponent.chatAvatar } : null}
  //             style={{ height: 30, width: 30, borderRadius: 50, marginRight: 8, marginLeft: 8 }}
  //           />

  //           <TouchableOpacity
  //             ref={touchableRef}
  //             style={{
  //               flexDirection: 'row',
  //               borderRadius: 12,
  //               backgroundColor: 'white',
  //               marginHorizontal: 10,
  //               alignItems: 'center',
  //               ...alignmentStyle,
  //               paddingHorizontal: 10,
  //               maxWidth: 280,
  //             }}
  //           >
  //             <Text
  //               onLayout={handleTextLayout}
  //               style={{ flexWrap: 'wrap', fontSize: 15 }}

  //             >
  //               {item.contents[0].value}
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //         <View style={{ height: 8 }} />
  //       </View>
  //     );
  //   }
  //   if (item.contents[0].key === 'image') {
  //     if (item.contents.length > 1) {
  //       return (
  //         <View style={{ alignItems: 'center' }}>
  //           {item.contents.map((content, index) => (
  //             <View style={{
  //               ...alignmentStyle,
  //             }}>
  //               <TouchableOpacity
  //                 key={index}
  //                 style={{
  //                   flexDirection: 'row',
  //                   marginHorizontal: 10,
  //                   ...alignmentStyle,
  //                   width: imageSize.width,
  //                   height: imageSize.height,
  //                   maxHeight: 300,
  //                   maxWidth: '60%',
  //                   marginLeft: 50
  //                 }}
  //               >
  //                 <Image
  //                   source={{ uri: content.value }}
  //                   style={{ height: '100%', width: '100%' }}
  //                   resizeMode="cover"
  //                   onLoad={handleImageLoad}
  //                 />
  //               </TouchableOpacity>
  //               <View style={{ height: 8 }} />
  //             </View>
  //           ))}
  //           <View style={{ height: 8 }} />
  //         </View>
  //       );
  //     } else {
  //       return (
  //         <View style={{ alignItems: 'center' }}>
  //           <TouchableOpacity
  //             style={{
  //               flexDirection: 'row',
  //               borderRadius: 12,
  //               backgroundColor: 'white',
  //               marginHorizontal: 10,
  //               ...alignmentStyle,
  //               paddingHorizontal: 10,
  //               width: imageSize.width,
  //               height: imageSize.height,
  //               maxHeight: 300,
  //               maxWidth: '60%',
  //               marginLeft: 50
  //             }}
  //           >
  //             <Image
  //               source={{ uri: item.contents[0].value }}
  //               style={{ height: '100%', width: '100%' }}
  //             // resizeMode="contain"
  //             // onLoad={handleImageLoad}
  //             />
  //           </TouchableOpacity>
  //           <View style={{ height: 8 }} />
  //         </View>
  //       );
  //     }
  //   } else if (item.contents[0].key.startsWith('zip')) {
  //     // Hiển thị nội dung cho tệp ZIP
  //     const parts = item.contents[0].key.split('|');
  //     const fileName = parts[1];
  //     const fileSize = parts[2];
  //     const fileUrl = item.contents[0].value;

  //     return (
  //       <View style={{ alignItems: 'center' }}>
  //         <TouchableOpacity
  //           onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
  //           style={{
  //             flexDirection: 'row',
  //             borderRadius: 12,
  //             backgroundColor: 'white',
  //             marginHorizontal: 10,
  //             alignItems: 'center',
  //             ...alignmentStyle,
  //             paddingHorizontal: 10,
  //             maxWidth: 280,
  //             marginLeft: 50,
  //             maxHeight: 70, height: 100
  //           }}
  //         >
  //           <Image source={require('../assets/zip-folder.png')} style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }} />
  //           <View style={{ flexDirection: 'column' }}>
  //             <Text
  //               onLayout={handleTextLayout}
  //               style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400' }}
  //             >{fileName}</Text>
  //             <Text
  //               onLayout={handleTextLayout}
  //               style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
  //             >{fileSize}</Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }
  //   else if (item.contents[0].key.startsWith('pdf')) {
  //     // Hiển thị nội dung cho tệp ZIP
  //     const parts = item.contents[0].key.split('|');
  //     const fileName = parts[1];
  //     const fileSize = parts[2];
  //     const fileUrl = item.contents[0].value;

  //     return (
  //       <View style={{ alignItems: 'center' }}>
  //         <TouchableOpacity
  //           onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
  //           style={{
  //             flexDirection: 'row',
  //             borderRadius: 12,
  //             backgroundColor: 'white',
  //             marginHorizontal: 10,
  //             alignItems: 'center',
  //             ...alignmentStyle,
  //             paddingHorizontal: 10,
  //             maxWidth: 280,
  //             marginLeft: 50,
  //             maxHeight: 70, height: 100
  //           }}
  //         >
  //           <Image source={require('../assets/pdf.png')} style={{ width: 50, height: 50, marginRight: 5, marginLeft: 5 }} />
  //           <View style={{ flexDirection: 'column' }}>
  //             <Text
  //               onLayout={handleTextLayout}
  //               style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400', width: 120 }}
  //             >{fileName}</Text>
  //             <Text
  //               onLayout={handleTextLayout}
  //               style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
  //             >{fileSize}</Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   } else if (item.contents[0].key.startsWith('doc' || 'docx')) {
  //     // Hiển thị nội dung cho tệp ZIP
  //     const parts = item.contents[0].key.split('|');
  //     const fileName = parts[1];
  //     const fileSize = parts[2];
  //     const fileUrl = item.contents[0].value;

  //     return (
  //       <View style={{ alignItems: 'center' }}>
  //         <TouchableOpacity
  //           onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
  //           style={{
  //             flexDirection: 'row',
  //             borderRadius: 12,
  //             backgroundColor: 'white',
  //             marginHorizontal: 10,
  //             alignItems: 'center',
  //             ...alignmentStyle,
  //             paddingHorizontal: 10,
  //             maxWidth: 280,
  //             marginLeft: 50,
  //             maxHeight: 70, height: 100
  //           }}
  //         >
  //           <Image source={require('../assets/doc.png')} style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }} />
  //           <View style={{ flexDirection: 'column' }}>
  //             <Text
  //               onLayout={handleTextLayout}
  //               style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400' }}
  //             >{fileName}</Text>
  //             <Text
  //               onLayout={handleTextLayout}
  //               style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
  //             >{fileSize}</Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   } else if (item.contents[0].key.startsWith('xlsx' || 'xls')) {
  //     // Hiển thị nội dung cho tệp ZIP
  //     const parts = item.contents[0].key.split('|');
  //     const fileName = parts[1];
  //     const fileSize = parts[2];
  //     const fileUrl = item.contents[0].value;

  //     return (
  //       <View style={{ alignItems: 'center' }}>
  //         <TouchableOpacity
  //           onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
  //           style={{
  //             flexDirection: 'row',
  //             borderRadius: 12,
  //             backgroundColor: 'white',
  //             marginHorizontal: 10,
  //             alignItems: 'center',
  //             ...alignmentStyle,
  //             paddingHorizontal: 10,
  //             maxWidth: 280,
  //             marginLeft: 50,
  //             maxHeight: 70, height: 100
  //           }}
  //         >
  //           <Image source={require('../assets/xlsx.png')} style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }} />
  //           <View style={{ flexDirection: 'column' }}>
  //             <Text
  //               onLayout={handleTextLayout}
  //               style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400' }}
  //             >{fileName}</Text>
  //             <Text
  //               onLayout={handleTextLayout}
  //               style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
  //             >{fileSize}</Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }
  //   else if (item.contents[0].key === 'link') {
  //     const linkUrl = item.contents[0].value;
  //     console.log("LINK URL: ", linkUrl);

  //     const [linkPreview, setLinkPreview] = useState(null);

  //     useEffect(() => {
  //       fetch(`https://api.linkpreview.net/?key=94bc443dd1d2ec0588af9aff4e012f6d&q=${encodeURIComponent(linkUrl)}`)
  //         .then(response => response.json())
  //         .then(data => {
  //           const { title, description, image } = data;
  //           setLinkPreview({ title, description, image });
  //         })
  //         .catch(error => {
  //           console.error('Error fetching link preview:', error);
  //         });
  //     }, [linkUrl]);

  //     return (
  //       <View style={{ alignItems: 'center' }}>
  //         {linkPreview ? (
  //           <TouchableOpacity
  //             onPress={() => Linking.openURL(linkUrl)} // Mở liên kết khi người dùng chạm vào
  //             style={{
  //               flexDirection: 'row',
  //               borderRadius: 12,
  //               backgroundColor: '#B0E2FF',
  //               marginHorizontal: 10,
  //               alignItems: 'center',
  //               ...alignmentStyle,
  //               paddingHorizontal: 10,
  //               maxWidth: 280,
  //               marginLeft: 50
  //             }}
  //           >
  //             <View style={{ flex: 1 }}>
  //               <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15, marginTop: 10, marginHorizontal: 10 }}>{linkPreview.title}</Text>
  //               <View style={{ margin: 10, backgroundColor: 'white' }}>
  //                 {linkPreview.image && <Image source={{ uri: linkPreview.image }} style={{ width: '100%', height: 100, resizeMode: 'contain' }} />}
  //               </View>
  //               <Text style={{ fontSize: 15, marginHorizontal: 10, marginVertical: '10', marginBottom: 10 }}>{linkPreview.description}</Text>
  //             </View>
  //           </TouchableOpacity>
  //         ) : (
  //           <TouchableOpacity
  //             style={{
  //               flexDirection: 'row',
  //               borderRadius: 12,
  //               backgroundColor: 'white',
  //               marginHorizontal: 10,
  //               alignItems: 'center',
  //               ...alignmentStyle,
  //               paddingHorizontal: 10,
  //               maxWidth: 280,
  //               marginLeft: 50
  //             }}
  //           >
  //             <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15 }}>{linkUrl}</Text>
  //           </TouchableOpacity>
  //         )}
  //         <View style={{ height: 8 }} />
  //       </View>
  //     );
  //   }

  //   else if (item.contents[0].key === 'mp4') {
  //     return (
  //       <View style={{ flexDirection: 'column' }}>
  //         <View style={{ alignItems: 'center', flexDirection: 'row' }}>
  //           <Image
  //             source={conversationOpponent.chatAvatar ? { uri: conversationOpponent.chatAvatar } : null}
  //             style={{ height: 30, width: 30, borderRadius: 50, marginRight: 8 }}
  //           />
  //           <TouchableOpacity
  //             onPress={() => {

  //             }}
  //             style={{
  //               flexDirection: 'row',
  //               marginHorizontal: 10,
  //               ...alignmentStyle,
  //               maxHeight: 300,
  //               maxWidth: '60%',
  //               backgroundColor: 'white'
  //             }}
  //           >
  //             <Video
  //               key={videoKey} // Sử dụng videoKey ở đây để kích hoạt việc rerender
  //               source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
  //               shouldPlay
  //               style={{ width: '100%', height: 300 }}
  //             />
  //           </TouchableOpacity>
  //         </View>
  //         <View style={{ height: 8 }} />
  //       </View>
  //     );
  //   }
  // });

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
            renderItem={({ item }) => <ChatItem item={item} myID={myUserInfo.id} conversationOpponent={conversationOpponent} />}
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
