import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { ChatItem } from '../component/ChatVIewElement';
import { CHAT_SOCKET, host } from '../api/API';
import { GlobalContext } from '../context/GlobalContext';
import { findConversationByID } from '../utils/FindConservation';
import uuid from 'react-native-uuid';
export const MessageModal = ({ modalVisible, setModalVisible, item, conversationOpponent, friend }) => {
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
    const handleRecallMessage = () => {
        if (socket) {
        messageSocket = {
            id: uuid.v4(),
            tcm: "TCM05",
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
                        if (jsonData.tcm === "TCM04" || jsonData.tcm === "TCM05") {
                            const newTopChatActivity = {
                                messageID: uuid.v4(),
                                userID: jsonData.userID,
                                timestamp: jsonData.timestamp,
                                parentID: " ",
                                contents: " ",
                                hiden: [],
                                recall: true,
                            }
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

                <View style={{
                    flex: 1, justifyContent: 'flex-end', alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)', elevation: 1
                }}>
                    <ChatItem
                        item={item}
                        conversationOpponent={conversationOpponent}
                        myUserInfo={myUserInfo}
                        friend={friend} />
                    <View style={{
                        backgroundColor: 'white', height: 200, width: '90%', borderRadius: 10,
                        elevation: 5, flexDirection: 'column', justifyContent: 'center',
                        marginBottom: 80
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity style={styles.buttonInModal}>
                                <Image style={styles.imageInTouch} source={require('../assets/reply.png')}></Image>
                                <Text style={styles.textInModal}>Reply</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonInModal}>
                                <Image style={styles.imageInTouch} source={require('../assets/forward.png')}></Image>
                                <Text style={styles.textInModal}>Forward</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonInModal}
                            onPress={handleRecallMessage}
                            >
                                <Image style={styles.imageInTouch} source={require('../assets/rotate-left.png')}></Image>
                                <Text style={styles.textInModal}>Recall</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity style={styles.buttonInModal}>
                                <Image style={styles.imageInTouch} source={require('../assets/select.png')}></Image>
                                <Text style={styles.textInModal}>Multiselect</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonInModal}>
                                <Image style={styles.imageInTouch} source={require('../assets/push-pin_orange.png')}></Image>
                                <Text style={styles.textInModal}>Pin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonInModal}
                            onPress={handleDeleteMessage}
                            >
                                <Image style={styles.imageInTouch} source={require('../assets/trash-bin.png')}></Image>
                                <Text style={styles.textInModal}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonInModal: {
        flexDirection: 'column',
        margin: 12,
        alignItems: 'center',
        height: 40,
        width: 90,
        // marginLeft: 10
    },
    textInModal: {
        // marginLeft: 12,
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
    imageInTouch: {
        height: 25, width: 25
    },
});