import React, { useState, useEffect, useContext } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView, Text, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native'
import { GlobalContext } from '../context/GlobalContext';
import { TextInput } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid'
import { API_INFOR_USER, host } from '../api/Api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddListChatID } from '../utils/AddListChatID';
const AddFriendRequestDetail = () => {
    const navigation = useNavigation();
    let route = useRoute();
    const profile = route.params?.profile;
    const { myProfile, setMyUserInfo, setListChatID } = useContext(GlobalContext)
    const [request, setRequest] = useState(` Hi I'm ${myProfile.userName}. Let's be friends!`)
    const [isOn, setIsOn] = useState(false);
    const [socket, setSocket] = useState(null);
    const handleToggle = () => {
        setIsOn(!isOn);
    };
    const sendMessage = () => {
        // console.log("HEHEE");
        const message = {
            id: uuid.v4(),
            tum: "TUM01",
            senderID: myProfile.userID,
            senderName: myProfile.userName,
            senderAvatar: myProfile.avatar,
            receiverID: profile.userID,
            receiverName: profile.userName,
            receiverAvatar: profile.avatar,
            description: request,
        };

        if (profile) {
            const newSocket = new WebSocket(
                `ws://${host}:8082/ws/user/${profile.userID}`,
            );

            newSocket.onopen = () => {
                // console.log(
                //     "WebSocket 'ws://localhost:8082/ws/user/' for UserID: ",
                //     profile.userID,
                //     " OPENED",
                // );
                // Gửi tin nhắn khi kết nối thành công
                newSocket.send(JSON.stringify(message));
                // console.log("Message sent:", message);
            };
            // newSocket.onmessage = (event) => {
            //     console.log("Message received:", event.data);
            //     navigation.navigate("AddFriendScreen")
            // };

            newSocket.onclose = () => {
                // console.log(
                //     "WebSocket 'ws://localhost:8082/ws/user/' for UserID: ",
                //     profile.userID,
                //     " CLOSED",
                // );
            };
            fetchUserInfo()
            navigation.navigate("TabNavigator")
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
            const listID = AddListChatID(dataUserInfor.conversations)
            setListChatID(listID)
            return dataUserInfor;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin User:', error);
            return null;
        }
    };
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Điều chỉnh offset nếu cần thiết
        >
            <StatusBar />
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", alignItems: "center", height: 48 }}>
                    <TouchableOpacity style={{ justifyContent: "center", marginLeft: 14 }}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name='arrowleft' size={22} color={'white'} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 20, fontWeight: '600', color: "white", fontSize: 16, justifyContent: "flex-start" }}>Add friend</Text>
                </View>
                <View style={{ height: 180, width: '100%', backgroundColor: 'white' }}>
                    <View style={{ height: 80, width: '100%', flexDirection: 'row', alignContent: 'center' }}>
                        <TouchableOpacity style={{ alignSelf: 'center' }}>
                            <Image source={{ uri: profile.avatar }} style={{ height: 55, width: 55, borderRadius: 55, marginLeft: 20 }}></Image>
                        </TouchableOpacity>
                        <Text style={{ color: 'black', fontWeight: 'bold', alignSelf: 'center', marginLeft: 20, fontSize: 15 }}>{profile.userName}</Text>
                        <TouchableOpacity style={{
                            alignSelf: 'center', borderRadius: 27, height: 27, width: 27, backgroundColor: '#CCCCCC', marginLeft: 10,
                            justifyContent: 'center'
                        }}>
                            <Icon name='edit' color={'gray'} size={18} style={{ alignSelf: 'center' }}></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 0.7, marginLeft: 20, width: '100%' }} />
                    <View style={{ height: 85, width: '100%', marginTop: 15, flexDirection: 'row' }}>
                        <TextInput style={{ fontSize: 15, color: 'black', marginLeft: 20, width: "80%", alignSelf: 'flex-start' }}>
                            {request}
                        </TextInput>
                        <TouchableOpacity style={{ width: '20%' }}
                            onPress={() => setRequest('')}
                        >
                            <Icon name='closecircle' color={'gray'} size={20} style={{ alignSelf: 'center', marginRight: 10 }}></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 7, width: '100%' }} />
                    <View style={{ height: 60, width: '100%', backgroundColor: 'white', flexDirection: 'row' }}>
                        <TextInput style={{ fontSize: 15, color: 'black', width: "70%", marginLeft: '6%' }}>
                            Deny this person to view my timeline
                        </TextInput>
                        <TouchableOpacity onPress={handleToggle} style={[styles.toggleButton, isOn ? styles.toggleButtonOn : styles.toggleButtonOff]}>
                            <View style={[styles.toggleCircle, isOn ? styles.toggleCircleOn : styles.toggleCircleOff]} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ height: 40, alignSelf: 'center', justifyContent: 'center', width: '90%', backgroundColor: '#1E90FF', borderRadius: 25, marginTop: 30 }}
                        onPress={() => sendMessage()}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 14, color: 'white', fontWeight: '700' }}> SEND REQUEST</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toggleButton: {
        width: '10%',
        height: 18,
        borderRadius: 15,
        backgroundColor: '#CCCCCC',
        justifyContent: 'center',
        padding: 2,
        alignSelf: 'center',
        marginLeft: '4%'
    },
    toggleButtonOn: {
        backgroundColor: '#1E90FF',
    },
    toggleButtonOff: {
        backgroundColor: '#CCCCCC',
    },
    toggleCircle: {
        width: 22,
        height: 22,
        borderRadius: 22,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
    },
    toggleCircleOn: {
        marginLeft: 18,

    },
    toggleCircleOff: {
        marginLeft: -5,
    },
});

export default AddFriendRequestDetail;