import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_INFOR_USER } from '../api/Api';
import { UserInfoContext } from '../App';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function ProfileFriendScreen() {
    const navigation = useNavigation();
    let route = useRoute();
    const profile = route.params?.profile;
    const { userInfo, setUserInfo, chatID, setChatID } = useContext(UserInfoContext)
    console.log("USER INFOR:\n", userInfo);
    console.log("Du lieu tu ADDFRIEND: \n", profile);
    const [allfriendRequests, setAllFriendRequest] = useState(userInfo.friendRequests);
    const [friendRequests, setFriendRequests] = useState({});
    const [status, setStatus] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            setStatus(handleFriendRequest(allfriendRequests, profile.userID))
            console.log(status);
        };
        fetchData();
    }, [profile, userInfo]);

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
    const handleFriendRequest = (data, userId) => {
        setFriendRequests(checkDuplicateUser(data, userId));
        const type = checkType(checkDuplicateUser(data, userId))
        return type;
    }

    return (
        <View style={{ backgroundColor: '#BBBBBB', flexDirection: 'column', height: '100%', width: '100%' }}>
            <ImageBackground
                blurRadius={0}
                style={{ flex: 1 }}
                source={{ uri: profile.background }}
            >
                <View style={{ height: 48, flexDirection: "row", marginTop: 10 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: "contain", marginLeft: "5%", marginTop: "1%" }} source={require("../assets/back1.png")}
                        onStartShouldSetResponder={() => navigation.navigate('TabNavigator', { screen: 'Me' })}
                    ></Image>
                    <View style={{ flex: 1.5 }}></View>
                    <Image style={{ width: 20, height: 20, resizeMode: "contain", marginTop: "1%", marginRight: "5%" }} source={require("../assets/more.png")}
                    // onStartShouldSetResponder={() => navigation.navigate("InformationScreen")}
                    ></Image>
                </View>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: '25%',
                        flex: 1
                    }}
                >
                </View>
                <Image
                    style={{
                        top: 140,
                        left: 120,
                        width: 120, height: 120, borderRadius: 60,
                        position: 'absolute', zIndex: 3
                    }}
                    source={{ uri: profile.avatar }}
                ></Image>
                <View style={{ flex: 9, backgroundColor: '#EEEEEE' }}>
                    <View style={{ marginTop: 60 }}>
                        <Text style={{ textAlign: "center", fontFamily: "Roboto", fontSize: 20, fontWeight: "bold" }}>{profile.userName}</Text>
                    </View>
                    {status === "REQUEST" && (
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 3, justifyContent: 'center' }}>
                                <View style={{
                                    width: '90%', backgroundColor: 'white', height: '80%',
                                    marginBottom: 20, alignSelf: 'center',
                                    borderRadius: 8, elevation: 3
                                }}>
                                    <View style={{ height: 50, justifyContent: 'center', marginLeft: 10 }}>
                                        <Text style={{ fontSize: 15, fontWeight: '600' }}> Sent friend request</Text>
                                    </View>
                                    <View style={{ borderBottomColor: '#CCCCCC', borderBottomWidth: 0.45, width: '100%' }} />
                                    <View style={{ height: 50, flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                                        <View style={{ width: 30 }}></View>
                                        <Text style={{ fontSize: 15 }}>Zalo name: {profile.userName}</Text>
                                    </View>
                                    <View style={{
                                        borderRadius: 5, width: '90%',
                                        height: 50,
                                        alignSelf: 'center',
                                        borderColor: '#888888', alignItems: 'center',
                                        borderWidth: 0.5,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start'
                                    }}>
                                        <Text style={{ marginLeft: 15 }}>{friendRequests.description ? friendRequests.description : null}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                        <TouchableOpacity style={{
                                            height: 35, width: 120, backgroundColor: '#B5B5B5', marginLeft: 5,
                                            borderRadius: 20, alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Text style={{ fontSize: 14, fontWeight: '500' }}>Decline</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            height: 35, width: 120, backgroundColor: '#0000EE', marginLeft: 5,
                                            borderRadius: 20, alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>Accept</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, width: '80%', marginBottom: 20, textAlign: 'center', color: '#888888' }}>Make friend with {profile.userName} and have cool and unforgettable conversations together! </Text>
                            </View>
                        </View>
                    )}
                    {status === "SENT" && (
                        <View style={{ flex: 3, marginTop: 10 }}>
                            <Text style={{ marginHorizontal: 15, textAlign: 'center', color: '#444444' }}>You can't view {profile.userName}' timeline post since you're not friends</Text>
                            <View style={{ flexDirection: 'row', marginVertical: 20, marginHorizontal: 10 }}>
                                <TouchableOpacity style={{
                                    height: 40, width: 140, backgroundColor: '#A4D3EE', marginLeft: 15,
                                    borderRadius: 20, alignItems: 'center',
                                    justifyContent: 'center', flexDirection: 'row'
                                }}>
                                    <Ionicons
                                        name='chatbubble-ellipses-outline'
                                        color={'#1E90FF'}
                                        size={22} />
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#1E90FF', marginLeft: 15 }}>Chat</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    height: 40, width: 160, backgroundColor: 'white', marginLeft: 20,
                                    borderRadius: 20, alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Recall request</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderBottomColor: '#CCCCCC', borderBottomWidth: 0.5, width: '100%' }} />
                        </View>
                    )}
                    {status === "NOTSEND" && (
                        <View style={{ flex: 3, marginTop: 10 }}>
                            <Text style={{ marginHorizontal: 15, textAlign: 'center', color: '#444444' }}>You can't view {profile.userName}' timeline post since you're not friends</Text>
                            <View style={{ flexDirection: 'row', marginVertical: 20, marginHorizontal: 10 }}>
                                <TouchableOpacity style={{
                                    height: 40, width: 220, backgroundColor: '#87CEFF', marginLeft: 5,
                                    borderRadius: 20, alignItems: 'center',
                                    justifyContent: 'center', flexDirection: 'row'
                                }}>
                                    <Ionicons
                                        name='chatbubble-ellipses-outline'
                                        color={'#1E90FF'}
                                        size={22} />
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#1E90FF', marginLeft: 15 }}>Chat</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    height: 40, width: 70, backgroundColor: 'white', marginLeft: 30,
                                    borderRadius: 20, alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Icon name='adduser' size={22}></Icon>
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderBottomColor: '#CCCCCC', borderBottomWidth: 0.5, width: '100%' }} />
                        </View>
                    )}

                </View>

            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({});