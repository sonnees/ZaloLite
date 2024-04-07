import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_INFOR_USER } from '../api/Api';

import AccessDiniedPNG from '../assets/access-denied.png'

export default function ProfileFriendScreen() {
    const navigation = useNavigation();
    let route = useRoute();
    const userInfo = route.params?.userInfo;
    const [lastConversation, setLastConversation] = useState([]);
    const [conversation, setConversation] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const token = await getToken();
            console.log(token);
            const userID = await getUserID();
            console.log(userID);
            fetchConversation(token, userID);
            console.log(lastConversation);
        };
        fetchData();
    }, []);

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            return token;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
            return null;
        }
    };

    const getUserID = async () => {
        try {
            const userID = await AsyncStorage.getItem('userID');
            return userID;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
            return null;
        }
    };

    const fetchConversation = async (token, userID) => {
        try {
            const response = await axios.get(`${API_INFOR_USER}${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userInfo = await response.data;
            console.log('HEHE \n', userInfo.friendRequests);
            return userInfo.friendRequests;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin User:', error);
            return null;
        }
    };

    function checkDuplicateUser(data, userId) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].userID === userId) {
                return data[i];
            }
        }
        return null;

    }
    function checkType(data) {
        if (!data) {
            return 'NOTSEND'
        }
        else if (data.isSender) {
            return 'SENT'
        }
        else if (data.isSender == false)
            return 'REQUEST'
    }






    return (
        <ImageBackground
            blurRadius={0}
            style={{ flex: 1 }}
            source={require("../assets/cover_Image.jpg")}
        >
            <View style={{ flex: 1, flexDirection: "row" }}>
                <Image style={{ width: "7%", height: "30%", resizeMode: "contain", marginLeft: "5%", marginTop: "1%" }} source={require("../assets/back1.png")}
                    onStartShouldSetResponder={() => navigation.navigate('TabNavigator', { screen: 'Me' })}
                ></Image>
                <View style={{ flex: 1.5 }}></View>
                <Image style={{ width: "7%", height: "30%", resizeMode: "contain", marginTop: "1%", marginRight: "5%" }} source={require("../assets/more.png")}
                    onStartShouldSetResponder={() => navigation.navigate("InformationScreen")}
                ></Image>
            </View>
            <View style={{ flex: 2, backgroundColor: "white" }}>
                <View style={{ flex: 0.15 }}></View>
                <Text style={{ textAlign: "center", fontFamily: "Roboto", fontSize: 20, fontWeight: "bold" }}>{userInfo.userName}</Text>
                <View style={{ flex: 0.05 }}></View>
                <View style={{ flexDirection: "row" }}>
                    <Image
                        style={{ width: "17%", height: "80%", resizeMode: "contain", marginLeft: "15%", marginRight: "-4%" }}
                        source={require("../assets/pencil.png")}
                    ></Image>
                    <Text style={{ fontSize: 15, fontFamily: "Roboto", color: "blue", }}>Cập nhật giới thiệu bản thân</Text>
                </View>
                <View style={{ flex: 0.04 }}></View>
                <View style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}>
                    <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={require("../assets/state.jpg")}></Image>
                </View>
            </View>
            <View
                style={{
                    position: "absolute",
                    top: "27%",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Image
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                    source={{ uri: userInfo.avatar }}
                ></Image>
            </View>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({});
