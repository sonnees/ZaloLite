export { ChatOfReCall }
import React, { memo, useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/';
import { Video } from 'expo-av';
import { getTime } from '../utils/CalTime';
import { API_PROFILE_BY_USERID } from '../api/API';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageModalRecall } from '../modal/messageModalRecall';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
const ChatOfReCall = ({ item, conversationOpponent, friend }) => {
    const { myUserInfo, setMyUserInfo, chatID, myProfile, setMyProfile,setComponentChatID } = useContext(GlobalContext)
    const myMessage = '#B0E2FF';
    const [textHeight, setTextHeight] = useState(40);
    const touchableRef = useRef(null);
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
            // console.log("USER ID IN HE____________________________", item.userID);
            // console.log("ToKen____________________________", token);
            const data = fetchProfileInfo(item.userID, token)
            // setProfile(data);
            // console.log("DATAPROFILE:  ", data);
        }
        fetchData()
    }, [item]);
    const handleTextLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        setTextHeight(height);
    };
    const [modalVisible, setModalVisible] = useState(false);


    const [imageSize, setImageSize] = useState({ width: null, height: null });
    const alignmentStyle = item.userID === myUserInfo.id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
    if (item.userID === myUserInfo.id) {
        return (
            <View style={{ alignItems: 'center' }}>
                <MessageModalRecall
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    item={item}
                    conversationOpponent={conversationOpponent}
                    friend={friend}
                />
                {item.contents.length > 1 ? (
                    <React.Fragment>
                        {item.contents.map((contentIndex) => (
                            <TouchableOpacity
                                key={contentIndex}
                                style={{
                                    flexDirection: 'row',
                                    borderRadius: 12,
                                    backgroundColor: myMessage,
                                    marginHorizontal: 10,
                                    ...alignmentStyle,
                                    paddingHorizontal: 10,
                                    width: imageSize.width,
                                    maxHeight: 300,
                                    maxWidth: '60%',
                                    flexDirection: 'column'
                                }}
                                onLongPress={() => { { setModalVisible(true); console.log(modalVisible); } }}
                            >
                                <Text
                                    onLayout={handleTextLayout}
                                    style={{ flexWrap: 'wrap', fontSize: 15, marginTop: 5, color: '#999999' }}
                                >
                                    Message recalled
                                </Text>
                                <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>
                                    {getTime(item.timestamp)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </React.Fragment>
                ) : (
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            borderRadius: 12,
                            backgroundColor: myMessage,
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            width: imageSize.width,
                            maxHeight: 300,
                            maxWidth: '60%',
                            flexDirection: 'column'
                        }}
                        onLongPress={() => { { setModalVisible(true); console.log(modalVisible); } }}
                    >
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 15, marginTop: 5, color: '#999999' }}
                        >
                            Message recalled
                        </Text>
                        <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>
                            {getTime(item.timestamp)}
                        </Text>
                    </TouchableOpacity>
                )}
                <View style={{ height: 8 }} />
            </View>
        );
    } else {
        return (
            <View>
                <MessageModalRecall
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    item={item}
                    conversationOpponent={conversationOpponent}
                    friend={friend}
                />
                <React.Fragment>
                    {item.contents.map((content, contentIndex) => {
                        const isMultiple = item.contents.length > 1;
                        const containerStyle = {
                            alignItems: 'center',
                            flexDirection: 'row'
                        };
                        const messageStyle = {
                            flexDirection: 'row',
                            borderRadius: 12,
                            backgroundColor: 'white',
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            width: imageSize.width,
                            maxWidth: '60%',
                            flexDirection: 'column'
                        };
                        if (!isMultiple) {
                            messageStyle.maxHeight = 300;
                        }
                        return (
                            <View key={contentIndex} style={{}}>
                                <View style={containerStyle}>
                                    <ChatAatar
                                        profile={profile}
                                    />
                                    <TouchableOpacity style={messageStyle}
                                        onLongPress={() => { { setModalVisible(true); console.log(modalVisible); } }}
                                    >
                                        <ChatName profile={profile} />
                                        <Text onLayout={handleTextLayout} style={{ flexWrap: 'wrap', fontSize: 15, marginTop: 5, color: '#999999' }}>
                                            Message recalled
                                        </Text>
                                        <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ height: 8 }} />
                            </View>
                        );
                    })}
                </React.Fragment>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonInModal: {
        flexDirection: 'column',
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