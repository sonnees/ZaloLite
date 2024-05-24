import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { ChatItem } from '../component/ChatVIewElement';
import { GlobalContext } from '../context/GlobalContext';
import { findConversationByID } from '../utils/FindConservation';
import uuid from 'react-native-uuid';
import { CHAT_SOCKET, host } from '../api/API';

export const MessageModalRecall = ({ modalVisible, setModalVisible, item, conversationOpponent, friend }) => {
    const [socket, setSocket] = useState(null);
    const { setMyUserInfo, chatID, myProfile, setMyProfile, setComponentChatID, componentChatID,myUserInfo } = useContext(GlobalContext);
    let messageSocket = {};
    const firstMessageFlag = useRef(true);

    const handleDeleteMessage = () => {
        if (socket) {
        messageSocket = {
            id: uuid.v4(),
            tcm: "TCM04",
            userID: myProfile.userID,
            messageID: item.messageID
        }
        socket.send(JSON.stringify(messageSocket));
    }
    };
    useEffect(() => {
        const newSocket = new WebSocket(`${CHAT_SOCKET}/${componentChatID}`);
        newSocket.onopen = () => {
          console.log("WebSocket connected >>>>>>>>");
        };
        setSocket(newSocket);
      }, [componentChatID]);

    useEffect(() => {
        if (socket) {
            console.log("WEBSOCKET WAS TURN ON");

            socket.onmessage = (event) => {
                // console.log("SOCKET STATUS",socket);
                const data = event.data;
                console.log("Received data:", data);

                if (firstMessageFlag.current) {
                    firstMessageFlag.current = false;
                    console.log("First message ignored");
                    return;
                }

                if (data.trim().startsWith('{')) {
                    try {
                        const jsonData = JSON.parse(data);
                        if (jsonData.tcm === "TCM04") {
                            const newTopChatActivity = {
                                messageID: uuid.v4(),
                                userID: jsonData.userID,
                                timestamp: jsonData.timestamp,
                                parentID: " ",
                                contents: " ",
                                hiden: [],
                                recall: true,
                            }
                            // console.log("NEW MESSAGE", newTopChatActivity);
                            // if (conversationOpponent.topChatActivity && Array.isArray(conversationOpponent.topChatActivity)) {
                            //     conversationOpponent.topChatActivity.push(newTopChatActivity);
                            //     console.log("ADD SUCCESS");
                            // }

                            const updateConversationOpponentInUserInfo = () => {
                                const updatedConversations = myUserInfo.conversations.map(conversation => {
                                    if (conversation.chatID === conversationOpponent.chatID) {
                                        return conversationOpponent;
                                    } else {
                                        return conversation;
                                    }
                                });
                                setMyUserInfo({ ...myUserInfo, conversations: updatedConversations });
                            };

                            updateConversationOpponentInUserInfo();
                        }
                    } catch (error) {
                        console.error("Error parsing JSON data:", error);
                    }
                } else {
                    console.log("Received data is not a JSON object, ignoring...");
                }
            };

            return () => {
                socket.onmessage = null;
            };
        } else {
            console.log("WEBSOCKET NOT ON");
        }
    }, [myUserInfo, socket]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <TouchableWithoutFeedback
                onPress={() => setModalVisible(false)}>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', elevation: 1 }}>
                    <ChatItem
                        item={item}
                        conversationOpponent={conversationOpponent}
                        myUserInfo={myUserInfo}
                        friend={friend} />
                    <View style={{ backgroundColor: 'white', height: 100, width: 200, borderRadius: 10, elevation: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.buttonInModal}
                            onPress={handleDeleteMessage}
                        >
                            <Image style={{ height: 25, width: 25 }} source={require('../assets/trash-bin.png')}></Image>
                            <Text style={styles.textInModal}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonInModal}
                        >
                            <Image style={{ height: 25, width: 25 }} source={require('../assets/select.png')}></Image>
                            <Text style={styles.textInModal}>Multiselect</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
};

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
