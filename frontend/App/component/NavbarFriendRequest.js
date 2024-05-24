import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../context/GlobalContext';
import {  API_INFOR_USER, API_PROFILE_BY_USERID, host } from '../api/Api';
import { findUserIDByConversation } from '../utils/DisplayLastChat';

const NavbarFriendRequest = ({ conversationOpponent }) => {
    const navigation = useNavigation();
    const { myUserInfo, setMyUserInfo, chatID, setChatID, myProfile } = useContext(GlobalContext)
    const componentID= findUserIDByConversation(myUserInfo,conversationOpponent.chatID)
    // console.log('conversationOpponent',conversationOpponent);
    // console.log('componentID',componentID);
    const [profileFriendRequest, setProfileFriendRequest] = useState({});
    const { type } = conversationOpponent;
    useEffect(() => {
        fetchProfileInfo(componentID);
        console.log("profileFriendRequest: ",profileFriendRequest);
    }, [componentID]);

    const acceptFriend = async (profileFriendRequest) => {
        const message = {
            id: uuid.v4(),
            tum: "TUM03",
            senderID: profileFriendRequest.userID,
            senderName: profileFriendRequest.userName,
            senderAvatar: profileFriendRequest.avatar,
            receiverID: myProfile.userID,
            receiverName: myProfile.userName,
            receiverAvatar: myProfile.avatar,
        };
        
        if (profileFriendRequest) {
            const newSocket = new WebSocket(
                `ws://${host}:8082/ws/user/${profileFriendRequest.userID}`,
            );
            newSocket.onopen = () => {
                // console.log("WebSocket for UserID: ", profileFriendRequest.userID, " OPENED");
                newSocket.send(JSON.stringify(message));
                // console.log("Message sent:", message);
            };
            
            newSocket.onmessage = (event) => {
                const data = event.data;
                console.log("Received data:", data);
                // Check if the data starts with an opening curly brace, indicating it's a JSON object
                if (data.trim().startsWith('{')) {
                  try {
                    const jsonData = JSON.parse(data);
                    if (jsonData.tum === "TUM00" && jsonData.typeNotify === "SUCCESS") {
                        fetchUserInfo()
                    }
                    
                  } catch (error) {
                    console.error("Error parsing JSON data:", error);
                  }
                } else {
                  console.log("Received data is not a JSON object, ignoring...");
                }
            };

                newSocket.onclose = () => {
                console.log("WebSocket for UserID: ", profileFriendRequest.userID, " CLOSED");
            };
        }
    };
    const recallFriend = async (profileFriendRequest) => {
        const message = {
            id: uuid.v4(),
            tum: "TUM02",
            senderID: item.userID,
            receiverID: myProfile.userID,
        };
        
        if (profileFriendRequest) {
            const newSocket = new WebSocket(
                `ws://${host}:8082/ws/user/${profileFriendRequest.userID}`,
            );
            newSocket.onopen = () => {
                // console.log("WebSocket for UserID: ", profileFriendRequest.userID, " OPENED");
                newSocket.send(JSON.stringify(message));
                // console.log("Message sent:", message);
            };
            
            newSocket.onmessage = (event) => {
                const data = event.data;
                console.log("Received data:", data);
                // Check if the data starts with an opening curly brace, indicating it's a JSON object
                if (data.trim().startsWith('{')) {
                  try {
                    const jsonData = JSON.parse(data);
                    if (jsonData.tum === "TUM00" && jsonData.typeNotify === "SUCCESS") {
                        fetchUserInfo()
                    }
                    
                  } catch (error) {
                    console.error("Error parsing JSON data:", error);
                  }
                } else {
                  console.log("Received data is not a JSON object, ignoring...");
                }
            };

                newSocket.onclose = () => {
                console.log("WebSocket for UserID: ", profileFriendRequest.userID, " CLOSED");
            };
        }
    };
    const fetchProfileInfo = async (userID) => {
        const token = await AsyncStorage.getItem('token');
        // console.log('TOKEN ', token);
        // console.log("ID ",userID);
        try {
            const response = await axios.get(`${API_PROFILE_BY_USERID}${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched Profile Data:", response.data);
            setProfileFriendRequest(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching profile:", error);
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
    const addFriend=()=>{
        navigation.navigate("AddFriendRequestDetail", { profile: profileFriendRequest });
    }
    return (
        <>
            {type === 'REQUESTED' && (
                <View
                    style={{
                        backgroundColor: 'white',
                        height: 40,
                        width: '100%',
                        position: 'absolute',
                        top: '50',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 1,
                    }}
                >
                    <Text style={{ marginLeft: 20 }}>Sent you a friend request</Text>
                    <TouchableOpacity
                        style={{
                            height: 30,
                            width: 80,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 20,
                            backgroundColor: '#1E90FF',
                            marginRight: 10,
                        }}
                        onPress={() => acceptFriend(profileFriendRequest)}
                    >
                        <Text style={{ color: 'white', fontSize: 12 }}>ACCEPT</Text>
                    </TouchableOpacity>
                </View>
            )}
            {type === 'REQUESTS' && (
                <View
                    style={{
                        backgroundColor: 'white',
                        height: 40,
                        width: '100%',
                        position: 'absolute',
                        top: '50',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                    }}
                >
                    <Icon name="adduser" size={20} color={'gray'}></Icon>
                    <Text style={{ marginLeft: 10 }}>Friend request has been sent</Text>
                </View>
            )}
            {type === 'STRANGER' && (
                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        height: 40,
                        width: '100%',
                        position: 'absolute',
                        top: '50',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                    }}
                    onPress={addFriend}
                >
                    <Icon name="adduser" size={20} color={'gray'}></Icon>
                    <Text style={{ marginLeft: 10 }}>Add friend</Text>
                </TouchableOpacity>
            )}
        </>
    );
};

export default NavbarFriendRequest;
