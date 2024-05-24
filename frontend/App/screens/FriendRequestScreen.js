import React, { useContext, useEffect, useState } from 'react';
import { View, Modal, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Text, StatusBar, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
import { getTimeDifference } from '../utils/CalTime';
import { findConversationByUserID } from '../utils/DisplayLastChat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_INFOR_USER, API_PROFILE_BY_USERID, host } from '../api/Api';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalContext';
import uuid from 'react-native-uuid'
const FriendRequestScreen = () => {
    const { myUserInfo, setMyUserInfo, chatID, setChatID, myProfile } = useContext(GlobalContext)
    // console.log('DATA FRIENDREQUESTS', myUserInfo.friendRequests);
    const navigation = useNavigation();
    const [isSender, setIsSender] = useState(true);
    const [views, setViews] = useState("received");
    const [modalChatVisible, setModalChatVisible] = useState(false);
    const [selectedFriendRequest, setSelectedFriendRequest] = useState(null);
    const [profileFriendRequest, setProfileFriendRequest] = useState({});
    const [dataFriendRequest, setDataFriendRequest] = useState(myUserInfo.friendRequests)
    // Sử dụng useEffect để lắng nghe sự thay đổi của myUserInfo và cập nhật dataFriendRequest
    useEffect(() => {
        setDataFriendRequest(myUserInfo.friendRequests)
    }, [myUserInfo,profileFriendRequest]);
    const fetchProfileInfo = async (userID) => {
        console.log("ID:__________",userID);
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.get(`${API_PROFILE_BY_USERID}${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfileFriendRequest(response.data)
            console.log("PROFILE FRIEND REQUEST:\n", profileFriendRequest);
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

    const countFalseSenders = (dataArray) => {
        let count = 0;
        dataArray.forEach(item => {
            if (item.isSender === false) {
                count++;
            }
        });
        return count;
    };

    const countTrueSenders = (dataArray) => {
        let count = 0;
        dataArray.forEach(item => {
            if (item.isSender === true) {
                count++;
            }
        });
        return count;
    };
    const openModal = async (friendRequest) => {
        fetchProfileInfo(friendRequest.userID)
        // console.log("FRIEND REQUEST USERID:  ", friendRequest.userID);
        setSelectedFriendRequest(friendRequest);
        setModalChatVisible(true);
    }
    const acceptFriend = async (item) => {
        const message = {
            id: uuid.v4(),
            tum: "TUM03",

            senderID: item.userID,
            senderName: item.userName,
            senderAvatar: item.avatar,

            receiverID: myProfile.userID,
            receiverName: myProfile.userName,
            receiverAvatar: myProfile.avatar,

        };
        
        if (item) {
            const newSocket = new WebSocket(
                `ws://${host}:8082/ws/user/${item.userID}`,
            );
            // console.log("Socket STATUS: ", newSocket);
            newSocket.onopen = () => {
                console.log(
                    "WebSocket for UserID: ", item.userID, " OPENED",
                );
                // Gửi tin nhắn khi kết nối thành công
                newSocket.send(JSON.stringify(message));
                console.log("Message sent:", message);
            };
            // newSocket.onmessage = (event) => {
            //     console.log("Message received:", event.data);
            //     navigation.navigate("AddFriendScreen")
            // };
            newSocket.onmessage = (event) => {
                const data = event.data;
                console.log("Received data:", data);
                // Check if the data starts with an opening curly brace, indicating it's a JSON object
                if (data.trim().startsWith('{')) {
                  try {
                    const jsonData = JSON.parse(data);
                    if (jsonData.tum === "TUM00" && jsonData.typeNotify === "SUCCESS") {
                        
                        fetchProfileInfo(item.userID)
                        // console.log("FRIEND REQUEST USERID:  ", friendRequest.userID);
                        // console.log("DATAFR:  ", profileFriendRequest);
                        setSelectedFriendRequest(item);
                        // console.log("ITEM: ", item);
                    }
                    
                  } catch (error) {
                    console.error("Error parsing JSON data:", error);
                  }
                } else {
                  console.log("Received data is not a JSON object, ignoring...");
                }
            };
            newSocket.onclose = () => {
                console.log(
                    "WebSocket for UserID: ", item.userID, " CLOSED",
                );
            };
            fetchUserInfo()
        }
    };
    const recallFriendRequest = async (item) => {
        const message = {
            id: uuid.v4(),
            tum: "TUM02",
            senderID: item.userID,
            receiverID: myProfile.userID,
        };
        if (item) {
            const newSocket = new WebSocket(
                `ws://${host}:8082/ws/user/${item.userID}`,
            );
            // console.log("Socket STATUS: ", newSocket);
            newSocket.onopen = () => {
                console.log(
                    "WebSocket for UserID: ", item.userID, " OPENED",
                );
                // Gửi tin nhắn khi kết nối thành công
                newSocket.send(JSON.stringify(message));
                console.log("Message sent:", message);
            };
            newSocket.onmessage = (event) => {
                const data = event.data;
                console.log("Received data:", data);
                // Check if the data starts with an opening curly brace, indicating it's a JSON object
                if (data.trim().startsWith('{')) {
                  try {
                    const jsonData = JSON.parse(data);
                    if (jsonData.tum === "TUM00" && jsonData.typeNotify === "SUCCESS") {
                        fetchProfileInfo(item.userID)
                        // console.log("FRIEND REQUEST USERID:  ", friendRequest.userID);
                        // console.log("DATAFR:  ", profileFriendRequest);
                        setSelectedFriendRequest(item);
                        // console.log("ITEM: ", item);
                    }
                    
                  } catch (error) {
                    console.error("Error parsing JSON data:", error);
                  }
                } else {
                  console.log("Received data is not a JSON object, ignoring...");
                }
            };

            newSocket.onclose = () => {
                console.log(
                    "WebSocket for UserID: ", item.userID, " CLOSED",
                );
            };
            fetchUserInfo()
        }
    };
    const chatStranger = async (item) => {
        const ID_UserOrGroup = item.userID;
        const conversationOpponent = findConversationByUserID(myUserInfo, ID_UserOrGroup)
        if(conversationOpponent){
            navigation.navigate("ChatScreen", { conversationOpponent: conversationOpponent });
        }else
        {
            const id = uuid.v4();
            const message = {
                id: id,
                tum: "TUM05",

                senderID: item.userID,
                senderName: item.userName,
                senderAvatar: item.avatar,

                receiverID: myProfile.userID,
                receiverName: myProfile.userName,
                receiverAvatar: myProfile.avatar,

            };

            const token = await AsyncStorage.getItem('token');
            fetchProfileInfo(item.userID, token)
            setSelectedFriendRequest(item);
            // console.log("ITEM: ", item);
                if (item) {
                    const newSocket = new WebSocket(
                        `ws://${host}:8082/ws/user/${item.userID}`,
                    );
                    // console.log("Socket STATUS: ", newSocket);
                    newSocket.onopen = () => {
                        console.log(
                            "WebSocket for UserID: ", item.userID, " OPENED",
                        );
                        // Gửi tin nhắn khi kết nối thành công
                        newSocket.send(JSON.stringify(message));
                        console.log("Message sent:", message);
                    };
                    // newSocket.onmessage = (event) => {
                    //     console.log("Message received:", event.data);
                    //     navigation.navigate("AddFriendScreen")
                    // };

                    newSocket.onclose = () => {
                        console.log(
                            "WebSocket for UserID: ", item.userID, " CLOSED",
                        );
                    };
                    fetchUserInfo()
                }
            }
    };

    const fetchUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_INFOR_USER}${myProfile.userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const dataUserInfor = await response.data;

            // console.log("User Infor:", dataUserInfor);
            setMyUserInfo(dataUserInfor);
            return dataUserInfor;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin User:', error);
            return null;
        }
    };
    const toProfileFriend = async (item) => {
        try {
            const data = await fetchProfileInfo(item.userID);
            // console.log("DATA-----------", data);
            navigation.navigate('ProfileFriendScreen', { profile: data });
        } catch (error) {
            console.error("Lỗi khi lấy thông tin profile:", error);
        }
    }
    const ReceivedFriendRequestElement = ({ item }) => {
        if (item.isSender !== true) {
            return (
                <View>
                    <TouchableOpacity
                        style={{
                            height: 120, flexDirection: 'row', margin: 10
                        }}
                        onPress={() => { openModal(item) }}
                    >
                        <Image source={{ uri: item.userAvatar }}
                            style={{ height: 50, width: 50, borderRadius: 50, marginLeft: 10, marginRight: 20 }} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black', marginTop: 5 }}>
                                {item.userName}</Text>
                            <Text style={{ fontSize: 13, color: '#B5B5B5', fontWeight: '400', margin: 4 }}>
                                {getTimeDifference(item.sendAt)}       Wants to be friends
                            </Text>
                            <View style={{
                                borderWidth: 0.5, borderColor: '#B5B5B5', height: 50, width: 250,
                                marginRight: '10', alignItems: 'center', justifyContent: 'center', borderRadius: 5
                            }}>
                                <Text style={{ fontSize: 14 }}>
                                    {item.description}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between' }}>
                                <TouchableOpacity style={{
                                    height: 30, width: 120, backgroundColor: '#B5B5B5', marginLeft: 5,
                                    borderRadius: 10, alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 14, fontWeight: '500' }}>DECLINE</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    height: 30, width: 120, backgroundColor: '#87CEFF', marginLeft: 5,
                                    borderRadius: 10, alignItems: 'center', justifyContent: 'center'
                                }}
                                    onPress={() => acceptFriend(item)}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#1E90FF' }}>ACCEPT</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: 10 }}></View>
                    <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 0.5, width: '100%' }} />
                </View>
            )
        }
    }
    const SentFriendRequestElement = ({ item }) => {
        if (item.isSender === true) {
            console.log("FRIENDREQUEST: \n", item);
            return (
                <View>
                    <TouchableOpacity
                        style={{
                            height: 60, flexDirection: 'row', margin: 10
                        }}
                        onPress={() => {
                            toProfileFriend(item)
                        }}
                    >
                        <Image source={{ uri: item.userAvatar }}
                            style={{ height: 50, width: 50, borderRadius: 50, marginLeft: 10, marginRight: 20 }} />
                        <View style={{ flexDirection: 'column', width: '45%' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black', marginTop: 5 }}>
                                {item.userName}</Text>
                            <Text style={{ fontSize: 13, color: '#B5B5B5', fontWeight: '400', margin: 4 }}>
                                Wants to be friends
                            </Text>
                        </View>
                        <TouchableOpacity style={{
                            height: 30, width: 100, backgroundColor: '#B5B5B5', marginLeft: 5,
                            borderRadius: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'
                        }}
                            onPress={() => recallFriendRequest(item)}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '500' }}>RECALL</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <View style={{ height: 5 }}></View>
                    <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 0.5, width: '100%' }} />
                </View>
            )
        }
    }



    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Điều chỉnh offset nếu cần thiết
        >
            <StatusBar />
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 48 }}>
                    <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 14 }}
                        onPress={() => { navigation.navigate('TabNavigator', { screen: 'ContactsScreen' }) }}
                    >
                        <Icon name='arrowleft' size={22} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 7, borderRadius: 5, backgroundColor: "transparent", height: 40, width: 300, justifyContent: "center", alignItems: "flex-start" }}
                        onPress={() => navigation.navigate("SearchScreen")}
                    >
                        <Text style={{ marginLeft: 20, fontSize: 15.5, color: "#CCCCCC" }}>Search</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", marginRight: 12 }}
                    onPress={() => { navigation.navigate("AddFriendScreen", { typeScreen: 'FriendRequestScreen' }) }}
                    >
                        <Icon name='adduser' size={23} color={'white'} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "space-between", paddingVertical: 12, backgroundColor: "#fff", height: 45 }}>
                    <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}
                        onPress={() => {
                            setIsSender(true)
                            setViews("received")
                        }}
                    >
                        <Text style={{ fontSize: 16, color: views === "received" ? "black" : "gray", fontWeight: views === "received" ? "700" : "300" }}> Received {countFalseSenders(dataFriendRequest)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}
                        onPress={() => {
                            setIsSender(false)
                            setViews("sent")
                        }}
                    >
                        <Text style={{ fontSize: 16, color: views === "sent" ? "black" : "gray", fontWeight: views === "sent" ? "700" : "300" }}> Sent {countTrueSenders(dataFriendRequest)}</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 1, width: '100%' }} />
                {views === 'received' && (
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <FlatList
                            style={{ flex: 1 }}
                            data={dataFriendRequest}
                            renderItem={({ item }) => <ReceivedFriendRequestElement item={item} />}
                            keyExtractor={(item) => item.userID}
                            ListFooterComponent={(
                                <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 8, width: '100%' }} />
                            )}
                        />
                    </View>
                )}
                {views === 'sent' && (
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <FlatList
                            style={{ flex: 1 }}
                            data={dataFriendRequest}
                            renderItem={({ item }) => <SentFriendRequestElement item={item} />}
                            keyExtractor={(item) => item.userID}
                            ListFooterComponent={(
                                <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 8, width: '100%' }} />
                            )}
                        />
                    </View>
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalChatVisible}
                    onRequestClose={() => {
                        setModalChatVisible(false);
                    }}>
                    <TouchableWithoutFeedback onPress={() => setModalChatVisible(false)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: 'white', height: 420, width: 300, borderRadius: 8, elevation: 5 }}>
                                <Image source={{ uri: profileFriendRequest.background }}
                                    style={{ height: 160, width: '100%', alignSelf: 'center' }}
                                />
                                <Image
                                    source={selectedFriendRequest && selectedFriendRequest.userAvatar ? { uri: selectedFriendRequest.userAvatar } : null}
                                    style={{ height: 120, width: 120, borderRadius: 60, marginTop: -90, alignSelf: 'center' }}
                                >
                                </Image>
                                <Text style={{ fontSize: 19, fontWeight: '700', marginTop: 12, marginLeft: 10, textAlign: 'center' }}>
                                    {selectedFriendRequest && selectedFriendRequest.userName ? selectedFriendRequest.userName : null}</Text>
                                <Text style={{ fontSize: 15, marginTop: 7, marginLeft: 10, textAlign: 'center', color: '#8B8989', fontWeight: '500' }}>
                                    {getTimeDifference(selectedFriendRequest && selectedFriendRequest.sendAt ? selectedFriendRequest.sendAt : null)}  Wants to be friends</Text>
                                <Text style={{ fontSize: 15, marginTop: 7, marginLeft: 10, textAlign: 'center' }}>
                                    {selectedFriendRequest && selectedFriendRequest.description ? selectedFriendRequest.description : null}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-around', marginTop: 80 }}>
                                    <TouchableOpacity
                                        style={{
                                            height: 30, width: 105, backgroundColor: '#87CEFF', marginLeft: 5,
                                            borderRadius: 15, alignItems: 'center', justifyContent: 'center'
                                        }}
                                        onPress={() => {
                                            chatStranger(selectedFriendRequest)
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: 'blue' }}>MESSAGE</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        height: 30, width: 105, backgroundColor: '#1C86EE', marginLeft: 5,
                                        borderRadius: 15, alignItems: 'center', justifyContent: 'center'
                                    }}
                                        onPress={() => {
                                            acceptFriend(selectedFriendRequest)
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>ACCEPT</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default FriendRequestScreen;
