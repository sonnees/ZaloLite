export { OpponentMessageNoneRecall }
import React, { memo, useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Video } from 'expo-av';
import { getTime } from '../utils/CalTime';
import { API_PROFILE_BY_USERID } from '../api/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MessageModal } from '../modal/messageModal';
const OpponentMessageNoneRecall = memo(({ item, conversationOpponent, myUserInfo, friend }) => {
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
            // console.log("DATAPROFILE:  ", data);
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

        switch (key) {
            case 'text':
            case 'emoji':
                return renderTextContent(value);
            case 'image':
                return renderImageContent(value);
            case 'link':
                return renderLinkContent(value);
            case 'mp4':
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
                    myUserInfo={myUserInfo}
                    friend={friend}
                />
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    {!friend && (
                        <ChatAatar
                            profile={profile}
                        />
                    )}
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            borderRadius: 12,
                            backgroundColor: 'white',
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            width: imageSize.width,
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

    //Origin
    // const renderImageContent = (imageUrl) => (
    //     <View style={{}}>
    //         <View style={{ flexDirection: 'row' }}>
    //             <ChatAatar
    //                 profile={profile}
    //             />
    //             <TouchableOpacity
    //                 style={{
    //                     flexDirection: 'column',
    //                     borderRadius: 12,
    //                     backgroundColor: 'white',
    //                     marginHorizontal: 10,
    //                     marginBottom: 8,
    //                     ...alignmentStyle,
    //                     paddingHorizontal: 10,
    //                     maxWidth: '60%',
    //                     width: '60%',
    //                     height: 300,
    //                     maxHeight: 300
    //                 }}
    //             >
    //                 <ChatName
    //                     profile={profile}
    //                 />
    //                 <Image
    //                     source={{ uri: imageUrl }}
    //                     style={{ width: '100%', height: '100%', maxHeight: 500, }}
    //                     resizeMode="contain"
    //                     onLoad={e => {
    //                         const { width, height } = e.nativeEvent.source;

    //                     }}
    //                 />
    //                 <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888', marginTop: -15 }}>{getTime(item.timestamp)}</Text>
    //             </TouchableOpacity>
    //         </View>
    //     </View>
    // );
    //Origin
    // const renderLinkContent = (linkUrl) => {
    //     const [linkPreview, setLinkPreview] = useState(null);
    //     useEffect(() => {
    //         fetch(`https://api.linkpreview.net/?key=94bc443dd1d2ec0588af9aff4e012f6d&q=${encodeURIComponent(linkUrl)}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 const { title, description, image } = data;
    //                 setLinkPreview({ title, description, image });
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching link preview:', error);
    //             });
    //     }, [linkUrl]);

    //     return (
    //         <View style={{}}>
    //             <View style={{}}>
    //                 <View style={{ alignItems: 'center', flexDirection: 'row' }}>
    //                     <ChatAatar
    //                         profile={profile}
    //                     />
    //                     {linkPreview ? (
    //                         <TouchableOpacity
    //                             onPress={() => Linking.openURL(linkUrl)}
    //                             style={{
    //                                 flexDirection: 'row',
    //                                 borderRadius: 12,
    //                                 backgroundColor: 'white',
    //                                 marginHorizontal: 10,
    //                                 alignItems: 'center',
    //                                 ...alignmentStyle,
    //                                 paddingHorizontal: 10,
    //                                 maxWidth: 280,
    //                                 marginLeft: 50
    //                             }}
    //                         >
    //                             <ChatName
    //                                 profile={profile}
    //                             />
    //                             <View style={{ flex: 1 }}>
    //                                 <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15, marginTop: 10, marginHorizontal: 10 }}>{linkPreview.title}</Text>
    //                                 <View style={{ margin: 10, backgroundColor: 'white' }}>
    //                                     {linkPreview.image && <Image source={{ uri: linkPreview.image }} style={{ width: '100%', height: 100, resizeMode: 'contain' }} />}
    //                                 </View>
    //                                 <Text style={{ fontSize: 15, marginHorizontal: 10, marginVertical: '10', marginBottom: 10 }}>{linkPreview.description}</Text>
    //                             </View>
    //                         </TouchableOpacity>
    //                     ) : (
    //                         <TouchableOpacity
    //                             style={{
    //                                 flexDirection: 'row',
    //                                 borderRadius: 12,
    //                                 backgroundColor: 'white',
    //                                 marginHorizontal: 10,
    //                                 alignItems: 'center',
    //                                 ...alignmentStyle,
    //                                 paddingHorizontal: 10,
    //                                 maxWidth: 280,
    //                                 marginLeft: 50
    //                             }}
    //                         >
    //                             <ChatName
    //                                 profile={profile}
    //                             />
    //                             <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15 }}>{linkUrl}</Text>
    //                         </TouchableOpacity>
    //                     )}
    //                 </View>
    //                 <View style={{ height: 8 }} />
    //             </View>
    //         </View>
    //     );
    // };
    //Origin
    // const renderVideoContent = (videoUrl) => (
    //     <View style={{ flexDirection: 'column' }}>
    //         <View style={{ alignItems: 'center', flexDirection: 'row' }}>
    //             <ChatAatar
    //                 profile={profile}
    //             />
    //             <TouchableOpacity
    //                 onPress={() => {
    //                 }}
    //                 style={{
    //                     flexDirection: 'column',
    //                     marginHorizontal: 10,
    //                     ...alignmentStyle,
    //                     maxHeight: 400,
    //                     maxWidth: '60%',
    //                     backgroundColor: 'white'
    //                 }}
    //             >
    //                 <ChatName
    //                     profile={profile}
    //                 />
    //                 <Video
    //                     key={videoKey}
    //                     source={{ uri: videoUrl }}
    //                     shouldPlay
    //                     style={{ width: 200, height: 300 }}
    //                 />
    //             </TouchableOpacity>
    //         </View>
    //         <View style={{ height: 8 }} />
    //     </View>
    // );
    //Origin
    // const renderFileContent = (key, value) => {
    //     const typeFile = useMemo(() => {
    //         const file = {};
    //         if (key.startsWith('docx|') || key.startsWith('doc|'))
    //             file.icon = require('../assets/doc.png');
    //         else if (key.startsWith('xlsx|') || key.startsWith('xls|'))
    //             file.icon = require('../assets/xlsx.png');
    //         else if (key.startsWith('pdf|'))
    //             file.icon = require('../assets/pdf.png');
    //         else if (key.startsWith('zip|'))
    //             file.icon = require('../assets/zip-folder.png');
    //         else if (key.startsWith('rar|'))
    //             file.icon = require('../assets/rar.png');
    //         else
    //             file.icon = require('../assets/attachfile.png');
    //         return file;
    //     }, [key]);

    //     const parts = key.split('|');
    //     const fileName = parts[1];
    //     const fileSize = parts[2];
    //     const fileUrl = value;

    //     return (
    //         <View>
    //             <View style={{ flexDirection: 'column' }}>
    //                 <View style={{ alignItems: 'center', flexDirection: 'row' }}>

    //                     <ChatAatar
    //                         profile={profile}
    //                     />
    //                     <TouchableOpacity
    //                         onPress={() => Linking.openURL(fileUrl)}
    //                         style={{
    //                             flexDirection: 'column',
    //                             borderRadius: 12,
    //                             backgroundColor: 'white',
    //                             marginHorizontal: 10,
    //                             ...alignmentStyle,
    //                             paddingHorizontal: 10,
    //                             maxWidth: 280,
    //                             maxHeight: 90,
    //                             height: 90
    //                         }}
    //                     >
    //                         <ChatName
    //                             profile={profile}
    //                         />
    //                         <View style={{ flexDirection: 'row', marginBottom: 5 }}>
    //                             <Image source={typeFile.icon} style={{ width: 50, height: 50, marginRight: 10 }} />
    //                             <View style={{ flexDirection: 'column' }}>
    //                                 <Text
    //                                     onLayout={handleTextLayout}
    //                                     style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400', maxWidth: 150 }}
    //                                 >{fileName}</Text>
    //                                 <Text
    //                                     onLayout={handleTextLayout}
    //                                     style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
    //                                 >{fileSize}</Text>
    //                             </View>
    //                         </View>
    //                         <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
    //                     </TouchableOpacity>
    //                 </View>
    //                 <View style={{ height: 8 }} />
    //             </View>
    //         </View>
    //     );
    // };
    const renderImageContent = (imageUrl) => (
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <React.Fragment>
                <MessageModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    item={item}
                    conversationOpponent={conversationOpponent}
                    myUserInfo={myUserInfo}
                    friend={friend}
                />
                <View style={{}}>
                    <View style={{ flexDirection: 'row' }}>
                        {!friend && (
                            <ChatAatar
                                profile={profile}
                            />
                        )}
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
                                width: '60%',
                                height: 300,
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
                                style={{ width: '100%', height: '100%', maxHeight: 500 }}
                                resizeMode="contain"
                                onLoad={e => {
                                    const { width, height } = e.nativeEvent.source;
                                }}
                            />
                            <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888', marginTop: -15 }}>{getTime(item.timestamp)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </React.Fragment>
        </TouchableWithoutFeedback>
    );

    const renderLinkContent = (linkUrl) => {
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
                <React.Fragment>
                    <MessageModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        item={item}
                        conversationOpponent={conversationOpponent}
                        myUserInfo={myUserInfo}
                        friend={friend}
                    />
                    <View style={{}}>
                        <View style={{}}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                {!friend && (
                                    <ChatAatar
                                        profile={profile}
                                    />
                                )}
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
                    </View>
                </React.Fragment>
            </TouchableWithoutFeedback>
        );
    };
    const renderVideoContent = (videoUrl) => (
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <React.Fragment>
                <MessageModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    item={item}
                    conversationOpponent={conversationOpponent}
                    myUserInfo={myUserInfo}
                    friend={friend}
                />
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        {!friend && (
                            <ChatAatar
                                profile={profile}
                            />
                        )}
                        <TouchableOpacity
                            onPress={() => {
                            }}
                            style={{
                                flexDirection: 'column',
                                marginHorizontal: 10,
                                ...alignmentStyle,
                                maxHeight: 400,
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
                                key={videoKey}
                                source={{ uri: videoUrl }}
                                shouldPlay
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

        return (
            <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
                <React.Fragment>
                    <MessageModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        item={item}
                        conversationOpponent={conversationOpponent}
                        myUserInfo={myUserInfo}
                        friend={friend}
                    />
                    <View>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                {!friend && (
                                    <ChatAatar
                                        profile={profile}
                                    />
                                )}
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(fileUrl)}
                                    style={{
                                        flexDirection: 'column',
                                        borderRadius: 12,
                                        backgroundColor: 'white',
                                        marginHorizontal: 10,
                                        ...alignmentStyle,
                                        paddingHorizontal: 10,
                                        maxWidth: 280,
                                        maxHeight: 90,
                                        height: 90
                                    }}
                                >
                                    {!friend && (
                                        <ChatName
                                            profile={profile}
                                        />
                                    )}
                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                        <Image source={typeFile.icon} style={{ width: 50, height: 50, marginRight: 10 }} />
                                        <View style={{ flexDirection: 'column' }}>
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