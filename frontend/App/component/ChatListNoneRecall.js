export { ChatListNoneRecall }
import React, { memo, useState, useRef, useEffect, useMemo, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Video } from 'expo-av';
import { getTime } from '../utils/CalTime';
import { API_PROFILE_BY_USERID } from '../api/API';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageModal } from '../modal/messageModal';
import { GlobalContext } from '../context/GlobalContext';
const ChatListNoneRecall = memo(({ item, conversationOpponent, friend }) => {
    const { myUserInfo, setMyUserInfo, chatID, myProfile, setMyProfile,setComponentChatID } = useContext(GlobalContext)
    const [textHeight, setTextHeight] = useState(40);
    const touchableRef = useRef(null);
    const [videoKey, setVideoKey] = useState(0);
    const myMessage = '#B0E2FF';
    const [modalVisible, setModalVisible] = useState(false);
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
            console.log("DATAPROFILE:  ", data);
        }
        fetchData()
    }, [item]);
    const handleTextLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        setTextHeight(height);
    };

    const [imageSize, setImageSize] = useState({ width: null, height: null });

    const alignmentStyle = item.userID === myUserInfo.id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
    const findParent = findTopChatActivity(item.parenID, conversationOpponent.topChatActivity)
    //Hiển thị bên đối phương
    if (item.userID !== myUserInfo.id) {
        return (
            <View>
                <React.Fragment>
                    {item.contents.map((content, contentIndex) => {
                        if (content.key === 'text' || content.key === 'emoji') {
                            return (
                                <View style={{}}>
                                    <MessageModal
                                        modalVisible={modalVisible}
                                        setModalVisible={setModalVisible}
                                        item={item}
                                        conversationOpponent={conversationOpponent}
                                        friend={friend}
                                    />
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        {!friend && (
                                            <ChatAatar
                                                profile={profile}
                                            />
                                        )}
                                        <TouchableOpacity
                                            key={contentIndex}
                                            style={{
                                                flexDirection: 'row',
                                                borderRadius: 12,
                                                backgroundColor: 'white',
                                                marginHorizontal: 10,
                                                ...alignmentStyle,
                                                paddingHorizontal: 10,
                                                width: imageSize.width,
                                                maxWidth: '60%',
                                                flexDirection: 'column'
                                            }}
                                            onLongPress={() => { { setModalVisible(true); console.log(modalVisible); } }}
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
                                                {content.value}
                                            </Text>
                                            <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: 8 }} />
                                </View>
                            );
                        } else if (content.key === 'image') {
                            return (
                                <View style={{ flexDirection: 'column' }}>
                                    <MessageModal
                                        modalVisible={modalVisible}
                                        setModalVisible={setModalVisible}
                                        item={item}
                                        conversationOpponent={conversationOpponent}
                                        friend={friend}
                                    />
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        {!friend && (
                                            <ChatAatar
                                                profile={profile}
                                            />
                                        )}
                                        <TouchableOpacity
                                            key={contentIndex}
                                            style={{
                                                flexDirection: 'column',
                                                borderRadius: 12,
                                                backgroundColor: 'white',
                                                marginHorizontal: 10,
                                                ...alignmentStyle,
                                                paddingHorizontal: 10,
                                                width: 200,
                                                height: 300, // Sử dụng kích thước thực của hình ảnh
                                                maxHeight: 300,
                                                maxWidth: '60%',
                                            }}

                                            onLayout={(event) => {
                                                const { width, height } = event.nativeEvent.layout;
                                                // Cập nhật kích thước của TouchableOpacity dựa trên kích thước thực của hình ảnh
                                                setImageSize({ width, height });
                                            }}
                                        >
                                            {!friend && (
                                                <ChatName
                                                    profile={profile}
                                                />
                                            )}
                                            <Image
                                                source={{ uri: content.value }}
                                                style={{ height: '100%', width: '100%' }}
                                                resizeMode="contain"
                                            // onLoad={handleImageLoad}
                                            />
                                            {/* <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888',flex }}>{getTime(item.timestamp)}</Text> */}
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: 8 }} />
                                </View>
                            );
                        } else if (containsDoublePipe(content.key)) {
                            const typeFile = useMemo(() => {
                                const file = {};
                                if (content.key.startsWith('docx|') || content.key.startsWith('doc|'))
                                    file.icon = require('../assets/doc.png');
                                else if (content.key.startsWith('xlsx|') || content.key.startsWith('xls|'))
                                    file.icon = require('../assets/xlsx.png');
                                else if (content.key.startsWith('pdf|'))
                                    file.icon = require('../assets/pdf.png');
                                else if (content.key.startsWith('zip|'))
                                    file.icon = require('../assets/zip-folder.png');
                                else if (content.key.startsWith('rar|'))
                                    file.icon = require('../assets/rar.png');
                                else
                                    file.icon = require('../assets/attachfile.png');
                                return file;
                            }, [content.key]);

                            const parts = content.key.split('|');
                            const fileName = parts[1];
                            const fileSize = parts[2];
                            const fileUrl = content.value;
                            return (
                                <View style={{ flexDirection: 'column' }}>
                                    <MessageModal
                                        modalVisible={modalVisible}
                                        setModalVisible={setModalVisible}
                                        item={item}
                                        conversationOpponent={conversationOpponent}
                                        friend={friend}
                                    />
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        {!friend && (
                                            <ChatAatar
                                                profile={profile}
                                            />
                                        )}
                                        <TouchableOpacity
                                            key={contentIndex}
                                            onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
                                            style={{
                                                flexDirection: 'column',
                                                borderRadius: 12,
                                                backgroundColor: 'white',
                                                marginHorizontal: 10,
                                                alignItems: 'center',
                                                ...alignmentStyle,
                                                paddingHorizontal: 10,
                                                maxWidth: 280,
                                                maxHeight: 80, height: 100
                                            }}
                                        >
                                            {!friend && (
                                                <ChatName
                                                    profile={profile}
                                                />
                                            )}
                                            <Image source={typeFile.icon} style={{ width: 50, height: 50, marginRight: 10 }} />
                                            <View style={{ flexDirection: 'row', height: 100 }}>
                                                <Image source={typeFile.icon} style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }} />
                                                <View style={{ flexDirection: 'column', }}>
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
                            );

                        } else if (content.key === 'link') {
                            const linkUrl = content.value;
                            console.log("LINK URL: ", linkUrl);

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
                                <View style={{}}>
                                    <MessageModal
                                        modalVisible={modalVisible}
                                        setModalVisible={setModalVisible}
                                        item={item}
                                        conversationOpponent={conversationOpponent}
                                        friend={friend}
                                    />
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        {!friend && (
                                            <ChatAatar
                                                profile={profile}
                                            />
                                        )}
                                        {linkPreview ? (
                                            <TouchableOpacity
                                                key={contentIndex}
                                                onPress={() => Linking.openURL(linkUrl)} // Mở liên kết khi người dùng chạm vào
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
                                                {!friend && (
                                                    <ChatName
                                                        profile={profile}
                                                    />
                                                )}
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15, marginTop: 10, marginHorizontal: 10 }}>{linkPreview.title}</Text>
                                                    <View style={{ margin: 10, backgroundColor: 'white' }}>
                                                        {linkPreview.image && <Image source={{ uri: linkPreview.image }} style={{ width: '100%', height: 100, resizeMode: 'contain' }} />}
                                                    </View>
                                                    <Text style={{ fontSize: 15, marginHorizontal: 10, marginVertical: '10', marginBottom: 10 }}>{linkPreview.description}</Text>
                                                </View>
                                            </TouchableOpacity>

                                        ) : (
                                            <TouchableOpacity
                                                key={contentIndex}
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
                                                {!friend && (
                                                    <ChatName
                                                        profile={profile}
                                                    />
                                                )}
                                                <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15 }}>{linkUrl}</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={{ height: 8 }} />
                                </View>
                            );
                        } else if (content.key === 'mp4') {
                            return (
                                <View style={{ flexDirection: 'column' }}>
                                    <MessageModal
                                        modalVisible={modalVisible}
                                        setModalVisible={setModalVisible}
                                        item={item}
                                        conversationOpponent={conversationOpponent}
                                        friend={friend}
                                    />
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        {!friend && (
                                            <ChatAatar
                                                profile={profile}
                                            />
                                        )}
                                        <TouchableOpacity
                                            key={contentIndex}
                                            onPress={() => {
                                            }}
                                            style={{
                                                flexDirection: 'column',
                                                marginHorizontal: 10,
                                                ...alignmentStyle,
                                                maxHeight: 300,
                                                maxWidth: '60%',
                                                backgroundColor: 'white'
                                            }}
                                        >
                                            {!friend && (
                                                <ChatName
                                                    profile={profile}
                                                />
                                            )}
                                            <Video
                                                key={videoKey} // Sử dụng videoKey ở đây để kích hoạt việc rerender
                                                source={{ uri: content.value }}
                                                shouldPlay
                                                style={{ width: 200, height: 300 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: 8 }} />
                                </View>
                            );
                        }
                    })}
                </React.Fragment>
            </View>
        );
    }
    /// Hiển thị bên mình
    else {
        return (
            <React.Fragment>
                {item.contents.map((content, contentIndex) => {
                    if (content.key === 'text' || content.key === 'emoji') {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <MessageModal
                                    modalVisible={modalVisible}
                                    setModalVisible={setModalVisible}
                                    item={item}
                                    conversationOpponent={conversationOpponent}
                                    friend={friend}
                                />
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
                                        // height: 40,
                                        height: textHeight + 20,
                                        maxHeight: 300,
                                        maxWidth: '60%',
                                        // flexDirection: 'column'
                                    }}
                                >
                                    <Text
                                        onLayout={handleTextLayout}
                                        style={{ flexWrap: 'wrap', fontSize: 15, marginTop: 5 }}
                                    >
                                        {content.value}
                                    </Text>
                                    <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
                                </TouchableOpacity>
                                <View style={{ height: 8 }} />
                            </View>
                        );
                    } else if (content.key === 'image') {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <MessageModal
                                    modalVisible={modalVisible}
                                    setModalVisible={setModalVisible}
                                    item={item}
                                    conversationOpponent={conversationOpponent}
                                    friend={friend}
                                />
                                <TouchableOpacity
                                    key={contentIndex}
                                    style={{
                                        flexDirection: 'column',
                                        borderRadius: 12,
                                        backgroundColor: 'white',
                                        marginHorizontal: 10,
                                        ...alignmentStyle,
                                        paddingHorizontal: 10,
                                        width: 200,
                                        height: 300, // Sử dụng kích thước thực của hình ảnh
                                        maxHeight: 300,
                                        maxWidth: '60%',
                                    }}
                                    onLayout={(event) => {
                                        const { width, height } = event.nativeEvent.layout;
                                        // Cập nhật kích thước của TouchableOpacity dựa trên kích thước thực của hình ảnh
                                        setImageSize({ width, height });
                                    }}
                                >
                                    <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
                                    <Image
                                        source={{ uri: content.value }}
                                        style={{ height: '100%', width: '100%' }}
                                        resizeMode="contain"
                                    // onLoad={handleImageLoad}
                                    />
                                </TouchableOpacity>
                                <View style={{ height: 8 }} />
                            </View>
                        );
                    } else if (containsDoublePipe(content.key)) {
                        const typeFile = useMemo(() => {
                            const file = {};
                            if (content.key.startsWith('docx|') || content.key.startsWith('doc|'))
                                file.icon = require('../assets/doc.png');
                            else if (content.key.startsWith('xlsx|') || content.key.startsWith('xls|'))
                                file.icon = require('../assets/xlsx.png');
                            else if (content.key.startsWith('pdf|'))
                                file.icon = require('../assets/pdf.png');
                            else if (content.key.startsWith('zip|'))
                                file.icon = require('../assets/zip-folder.png');
                            else if (content.key.startsWith('rar|'))
                                file.icon = require('../assets/rar.png');
                            else
                                file.icon = require('../assets/attachfile.png');
                            return file;
                        }, [content.key]);

                        const parts = content.key.split('|');
                        const fileName = parts[1];
                        const fileSize = parts[2];
                        const fileUrl = content.value;
                        return (
                            <View style={{ flexDirection: 'column' }}>
                                <MessageModal
                                    modalVisible={modalVisible}
                                    setModalVisible={setModalVisible}
                                    item={item}
                                    conversationOpponent={conversationOpponent}
                                    friend={friend}
                                />
                                <TouchableOpacity
                                    key={contentIndex}
                                    onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
                                    style={{
                                        flexDirection: 'row',
                                        borderRadius: 12,
                                        backgroundColor: myMessage,
                                        marginHorizontal: 10,
                                        alignItems: 'center',
                                        ...alignmentStyle,
                                        paddingHorizontal: 10,
                                        maxWidth: 280,
                                        maxHeight: 80, height: 100
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                        <Image source={typeFile.icon} style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }} />
                                        <View style={{ flexDirection: 'column', }}>
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
                                <View style={{ height: 8 }} />
                            </View>
                        );

                    } else if (content.key === 'link') {
                        const linkUrl = content.value;
                        console.log("LINK URL: ", linkUrl);

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
                            <View style={{ alignItems: 'center' }}>
                                <MessageModal
                                    modalVisible={modalVisible}
                                    setModalVisible={setModalVisible}
                                    item={item}
                                    conversationOpponent={conversationOpponent}
                                    friend={friend}
                                />
                                {linkPreview ? (
                                    <TouchableOpacity
                                        key={contentIndex}
                                        onPress={() => Linking.openURL(linkUrl)} // Mở liên kết khi người dùng chạm vào
                                        style={{
                                            flexDirection: 'row',
                                            borderRadius: 12,
                                            backgroundColor: myMessage,
                                            marginHorizontal: 10,
                                            alignItems: 'center',
                                            ...alignmentStyle,
                                            paddingHorizontal: 10,
                                            maxWidth: 280,
                                            marginLeft: 50
                                        }}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15, marginTop: 10, marginHorizontal: 10 }}>{linkPreview.title}</Text>
                                            <View style={{ margin: 10, backgroundColor: 'white' }}>
                                                {linkPreview.image && <Image source={{ uri: linkPreview.image }} style={{ width: '100%', height: 100, resizeMode: 'contain' }} />}
                                            </View>
                                            <Text style={{ fontSize: 15, marginHorizontal: 10, marginVertical: '10', marginBottom: 10 }}>{linkPreview.description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        key={contentIndex}
                                        style={{
                                            flexDirection: 'row',
                                            borderRadius: 12,
                                            backgroundColor: myMessage,
                                            marginHorizontal: 10,
                                            alignItems: 'center',
                                            ...alignmentStyle,
                                            paddingHorizontal: 10,
                                            maxWidth: 280,
                                            marginLeft: 50
                                        }}
                                    >
                                        <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15 }}>{linkUrl}</Text>
                                    </TouchableOpacity>
                                )}
                                <View style={{ height: 8 }} />
                            </View>
                        );
                    } else if (content.key === 'mp4') {
                        return (
                            <View style={{ flexDirection: 'column' }}>
                                <MessageModal
                                    modalVisible={modalVisible}
                                    setModalVisible={setModalVisible}
                                    item={item}
                                    conversationOpponent={conversationOpponent}
                                    friend={friend}
                                />
                                <TouchableOpacity
                                    key={contentIndex}
                                    onPress={() => {
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        marginHorizontal: 10,
                                        ...alignmentStyle,
                                        maxHeight: 300,
                                        maxWidth: '60%',
                                        backgroundColor: myMessage
                                    }}
                                >
                                    <Video
                                        key={videoKey} // Sử dụng videoKey ở đây để kích hoạt việc rerender
                                        source={{ uri: content.value }}
                                        shouldPlay
                                        style={{ width: '100%', height: 300 }}
                                    />
                                </TouchableOpacity>
                                <View style={{ height: 8 }} />
                            </View>
                        );
                    }
                })}
            </React.Fragment>
        );

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