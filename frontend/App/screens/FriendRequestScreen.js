import React, { useContext, useEffect, useState } from 'react';
import { View, Modal, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Text, StatusBar, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native'
import { UserInfoContext } from '../App';
import { getTimeDifference } from '../function/CalTime';
import { findChatIDByUserID } from '../function/DisplayLastChat';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendRequestScreen = () => {
    const { userInfo, setUserInfo, chatID, setChatID } = useContext(UserInfoContext)
    console.log('DATA USERINFO', userInfo);
    const navigation = useNavigation();
    const [receivedViews, setReceivedViews] = useState(true)
    const [sentViews, setSentViews] = useState(false)
    const [dataFriendRequest, setDataFriendRequest] = useState(userInfo.friendRequests);
    console.log('DATA FRIENDREQUEST: \n', dataFriendRequest);
    const [modalChatVisible, setModalChatVisible] = useState(false);
    const [selectedFriendRequest, setSelectedFriendRequest] = useState(null);
    const [isSender, setIsSender] = useState(true);
    // Sử dụng useEffect để lắng nghe sự thay đổi của userInfo và cập nhật dataFriendRequest
    useEffect(() => {
        // Kiểm tra userInfo đã được cung cấp chưa và có thuộc tính friendRequests không
        if (userInfo && userInfo.friendRequests) {
            setDataFriendRequest(userInfo.friendRequests);
        }
    }, [userInfo]);

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
    const openModal = (friendRequest) => {
        setSelectedFriendRequest(friendRequest);
        setModalChatVisible(true);
    }
    const handleOpenChat = async (userID) => {
        // Kiểm tra xem selectedFriendRequest có giá trị không
        if (selectedFriendRequest) {
            console.log("selectedFriendRequest:", selectedFriendRequest);
            const myUserID = await AsyncStorage.getItem('userID');
            // Kiểm tra xem myUserID và userID có giá trị không
            if (myUserID && userID) {
                // Gọi hàm findChatIDByUserID với các tham số cần thiết
                const data = findChatIDByUserID(userInfo, myUserID, userID);
                console.log("DATA IN FRIENDREQUESTSCREEN", data);
                setChatID(data)
                // Kiểm tra xem chatID có giá trị không
                if (chatID) {
                    // Chuyển hướng đến màn hình ChatScreen với chatID
                    // setChatID(data)
                    console.log("Chat ID In FRIENDREQUESTSCREEN: ", chatID);
                    navigation.navigate("ChatScreen");
                } else {
                    console.log("Không thể tìm thấy chatID");
                }
            } else {
                console.log("userID hoặc myUserID không hợp lệ");
            }
        } else {
            console.log("selectedFriendRequest không tồn tại hoặc không hợp lệ");
        }
    }

    const FriendRequestElement = ({ item }) => {
        if (item.isSender !== isSender) {
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
                                }}>
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
                    >
                        <Icon name='adduser' size={23} color={'white'} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "space-between", paddingVertical: 12, backgroundColor: "#fff", height: 45 }}>
                    <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}
                        onPress={() => {
                            setReceivedViews(true)
                            setSentViews(false)
                            setIsSender(true)
                        }}
                    >
                        <Text style={{ fontSize: 16 }}> Received {countFalseSenders(dataFriendRequest)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}
                        onPress={() => {
                            setReceivedViews(false)
                            setSentViews(true)
                            setIsSender(false)
                        }}
                    >
                        <Text style={{ fontSize: 16 }}> Sent {countTrueSenders(dataFriendRequest)}</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 1, width: '100%' }} />
                {receivedViews && (
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <FlatList
                            style={{ flex: 1 }}
                            data={dataFriendRequest}
                            renderItem={({ item }) => <FriendRequestElement item={item} />}
                            keyExtractor={(item) => item.userID}
                            ListFooterComponent={(
                                <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 8, width: '100%' }} />
                            )}
                        />
                    </View>
                )}
                {sentViews && (
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <FlatList
                            style={{ flex: 1 }}
                            data={dataFriendRequest}
                            renderItem={({ item }) => <FriendRequestElement item={item} />}
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
                                <Image source={{ uri: 'https://i.pinimg.com/736x/c2/e9/02/c2e902e031e1d9d932411dd0b8ab5eef.jpg' }}
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
                                            const userId = selectedFriendRequest && selectedFriendRequest.userID;
                                            console.log("USERID NE \n", userId);
                                            if (userId) {
                                                handleOpenChat(userId);
                                            } else {
                                                console.error("Invalid userID:", userId);
                                            }
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: 'blue' }}>MESSAGE</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        height: 30, width: 105, backgroundColor: '#1C86EE', marginLeft: 5,
                                        borderRadius: 15, alignItems: 'center', justifyContent: 'center'
                                    }}>
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
