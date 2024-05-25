export { OpponentMessageNoneRecall }
import React, { memo, useState, useRef, useEffect, useMemo, useContext, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { getTime } from '../utils/CalTime';
import { API_PROFILE_BY_USERID } from '../api/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MessageModal } from '../modal/messageModal';
import { GlobalContext } from '../context/GlobalContext';
const OpponentMessageNoneRecall = memo(({ item, conversationOpponent, friend }) => {
  const { myUserInfo, setMyUserInfo, chatID, myProfile, setMyProfile,setComponentChatID } = useContext(GlobalContext)

    const [textHeight, setTextHeight] = useState(40);
    const touchableRef = useRef(null);
    const [videoKey, setVideoKey] = useState(0);
    const myMessage = '#B0E2FF';
    const [modalVisible, setModalVisible] = useState(false);
    const screenWidth = Dimensions.get('window').width;
  const maxImageWidth = screenWidth * 0.6;
  const handleImageLoad = (event) => {
    const { width, height } = event.nativeEvent.source;
    const aspectRatio = width / height;

    let finalWidth = width;
    let finalHeight = height;

    if (width > maxImageWidth) {
      finalWidth = maxImageWidth;
      finalHeight = maxImageWidth / aspectRatio;
    }

    setImageSize({ width: finalWidth, height: finalHeight });
  };
    const [profile, setProfile] = useState({});
    const fetchProfileInfo = async (userID, token) => {
        
        try {
            const response = await axios.get(`${API_PROFILE_BY_USERID}${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("PROFILE FRIEND REQUEST IN HERE:\n", response.data);
            setProfile(response.data)
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
        const fetchData = async () => {
            const token = await AsyncStorage.getItem('token');
            const data = fetchProfileInfo(item.userID, token)
        }
        fetchData()
    }, [item]);
    const handleTextLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        setTextHeight(height);
    };
    
    const renderContent = () => {
        const key = item.contents[0].key;
        const value = item.contents[0].value;
    
        switch (true) {
            case key === 'text' || key === 'emoji':
                return renderTextContent(value);
            case key === 'image':
                return renderImageContent(value);
            case key === 'link':
                return renderLinkContent(value);
            case key.startsWith('MP4|'):
                return renderVideoContent(value);
            default:
                if (containsDoublePipe(key)) {
                    return renderFileContent(key, value);
                }
                return null;
        }
    };
    const renderTextContent = (text) => (
        <TouchableWithoutFeedback
            onPress={() => setModalVisible(true)}>
            <React.Fragment>
                <MessageModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    item={item}
                    conversationOpponent={conversationOpponent}
                    friend={friend}
                />
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <ChatAatar
                                            profile={profile}
                                        />
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            borderRadius: 12,
                            backgroundColor: 'white',
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            width: textHeight.width,
                            maxHeight: 300,
                            maxWidth: '60%',
                            flexDirection: 'column'
                        }}
                        onLongPress={() => setModalVisible(true)}
                    >
                        {!friend && (
                            <ChatName
                                profile={profile}
                            />
                        )}

                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 15, marginTop: 5 }}
                        >
                            {text}
                        </Text>
                        <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 8 }} />
            </React.Fragment>
        </TouchableWithoutFeedback>
    );
    const renderImageContent = (imageUrl) => (
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <React.Fragment>
                <MessageModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    item={item}
                    conversationOpponent={conversationOpponent}
                    friend={friend}
                />
                <View style={{}}>
                    <View style={{ flexDirection: 'row' }}>
                    <ChatAatar
                                            profile={profile}
                                        />
                        <TouchableOpacity
                            style={{
                                flexDirection: 'column',
                                borderRadius: 12,
                                backgroundColor: 'white',
                                marginHorizontal: 10,
                                marginBottom: 8,
                                ...alignmentStyle,
                                paddingHorizontal: 10,
                                maxWidth: '60%',
                                width: imageSize.width,
                                height: imageSize.height+25,
                                maxHeight: 300
                            }}
                        >
                            {!friend && (
                                <ChatName
                                    profile={profile}
                                />
                            )}
                            <Image
                                source={{ uri: imageUrl }}
                                style={{ width: '100%', height: '100%', maxHeight: 500,marginBottom:30 }}
                                resizeMode="contain"
                                onLoad={handleImageLoad}
                            />
                            <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888', marginTop: -45 }}>{getTime(item.timestamp)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </React.Fragment>
        </TouchableWithoutFeedback>
    );

    const renderLinkContent = useCallback((linkUrl) => {
        const [linkPreview, setLinkPreview] = useState(null);
    
        useEffect(() => {
          fetch(`https://api.linkpreview.net/?key=94bc443dd1d2ec0588af9aff4e012f6d&q=${encodeURIComponent(linkUrl)}`)
            .then(response => response.json())
            .then(data => {
              const { title, description, image } = data;
              setLinkPreview({ title, description, image });
            })
            .catch(error => {
              console.error('Error fetching link preview:', error);
            });
        }, [linkUrl]);
    
        return (
          <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <>
              <MessageModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                item={item}
                conversationOpponent={conversationOpponent}
                friend={friend}
              />
              <View style={{}}>
                <View style={{}}>
                  <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <ChatAatar
                                            profile={profile}
                                        />
                    {linkPreview ? (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(linkUrl)}
                        style={{
                          flexDirection: 'row',
                          borderRadius: 12,
                          backgroundColor: 'white',
                          marginHorizontal: 10,
                          alignItems: 'center',
                          ...alignmentStyle,
                          paddingHorizontal: 10,
                          maxWidth: 280,
                          marginLeft: 50,
                        }}
                      >
                        {!friend && <ChatName profile={profile} />}
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15, marginTop: 10, marginHorizontal: 10 }}>
                            {linkPreview.title}
                          </Text>
                          <View style={{ margin: 10, backgroundColor: 'white' }}>
                            {linkPreview.image && (
                              <Image source={{ uri: linkPreview.image }} style={{ width: '100%', height: 100, resizeMode: 'contain' }} />
                            )}
                          </View>
                          <Text style={{ fontSize: 15, marginHorizontal: 10, marginVertical: '10', marginBottom: 10 }}>
                            {linkPreview.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          borderRadius: 12,
                          backgroundColor: 'white',
                          marginHorizontal: 10,
                          alignItems: 'center',
                          ...alignmentStyle,
                          paddingHorizontal: 10,
                          maxWidth: 280,
                          marginLeft: 50,
                        }}
                      >
                        {!friend && <ChatName profile={profile} />}
                        <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15 }}>{linkUrl}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ height: 8 }} />
                </View>
              </View>
            </>
          </TouchableWithoutFeedback>
        );
      }, [modalVisible, item, conversationOpponent, friend, profile]);
    const renderVideoContent = (videoUrl) => (
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <React.Fragment>
                <MessageModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    item={item}
                    conversationOpponent={conversationOpponent}
                    friend={friend}
                />
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <ChatAatar
                                            profile={profile}
                                        />
                        <TouchableOpacity
                            onPress={() => {
                            }}
                            style={{
                                flexDirection: 'column',
                                marginHorizontal: 10,
                                ...alignmentStyle,
                                maxHeight: 400,
                                maxWidth: '60%',
                                backgroundColor: 'white',
                                marginLeft:20
                            }}
                        >
                            {!friend && (
                                <ChatName
                                    profile={profile}
                                />
                            )}
                            <Video
                                key={videoKey}
                                source={{ uri: videoUrl }}
                                shouldPlay
                                isLooping
                                isMuted={true}
                                resizeMode="cover"
                                style={{ width: 200, height: 300 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 8 }} />
                </View>
            </React.Fragment>
        </TouchableWithoutFeedback>
    );
    const renderFileContent = (key, value) => {
        const typeFile = useMemo(() => {
            const file = {};
            if (key.startsWith('docx|') || key.startsWith('doc|'))
                file.icon = require('../assets/doc.png');
            else if (key.startsWith('xlsx|') || key.startsWith('xls|'))
                file.icon = require('../assets/xlsx.png');
            else if (key.startsWith('pdf|'))
                file.icon = require('../assets/pdf.png');
            else if (key.startsWith('zip|'))
                file.icon = require('../assets/zip-folder.png');
            else if (key.startsWith('rar|'))
                file.icon = require('../assets/rar.png');
            else
                file.icon = require('../assets/attachfile.png');
            return file;
        }, [key]);
    
        const parts = key.split('|');
        const fileName = parts[1];
        const fileSize = parts[2];
        const fileUrl = value;
    
        const maxHeight = friend ? 80 : 100;
    
        return (
            <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
                <React.Fragment>
                    <MessageModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        item={item}
                        conversationOpponent={conversationOpponent}
                        friend={friend}
                    />
                    <View>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                            <ChatAatar
                                            profile={profile}
                                        />
                                
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(fileUrl)}
                                    style={{
                                        flexDirection: 'column',
                                        borderRadius: 12,
                                        backgroundColor: 'white',
                                        marginHorizontal: 10,
                                        ...alignmentStyle,
                                        paddingHorizontal: 10,
                                        marginLeft: 10,
                                        maxWidth: '60%',
                                        maxHeight: maxHeight,
                                        height: 200
                                    }}
                                >
                                    {!friend && (
                                        <ChatName
                                            profile={profile}
                                        />
                                    )}
                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                        <Image source={typeFile.icon} style={{ width: 50, height: 50, marginRight: 10, marginTop: 10 }} />
                                        <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                            <Text
                                                onLayout={handleTextLayout}
                                                style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400', maxWidth: 150 }}
                                            >{fileName}</Text>
                                            <Text
                                                onLayout={handleTextLayout}
                                                style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
                                            >{fileSize}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 8 }} />
                        </View>
                    </View>
                </React.Fragment>
            </TouchableWithoutFeedback>
        );
    };
    


    const [imageSize, setImageSize] = useState({ width: null, height: null });

    const alignmentStyle = item.userID === myUserInfo.id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
    //Hiển thị bên đối phương
    if (item.userID !== myUserInfo.id) {
        return renderContent()
    }
});
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

function containsDoublePipe(key) {
    return key.indexOf('|') !== key.lastIndexOf('|');
}


const ChatName = ({ profile }) => {
    return (
        <Text
            style={{ flexWrap: 'wrap', fontSize: 12, marginTop: 5, color: '#CD853F' }}
        >
            {profile.userName}
        </Text>
    )
}

const ChatAatar = ({ profile }) => {
    return (
        <Image
            source={profile.avatar ? { uri: profile.avatar } : null}
            style={{ height: 30, width: 30, borderRadius: 50, marginRight: 8, marginLeft: 8 }}
        />
    )
}
function findTopChatActivity(messageID, topChatActivity) {
    for (let i = 0; i < topChatActivity.length; i++) {
        if (topChatActivity[i].messageID === messageID) {
            return topChatActivity[i];
        }
    }
    return null;
}