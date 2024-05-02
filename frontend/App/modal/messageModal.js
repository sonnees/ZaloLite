import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { ChatItem } from '../component/ChatVIewElement';
export const MessageModal = ({ modalVisible, setModalVisible, item, conversationOpponent, myUserInfo, friend }) => {
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
                            <TouchableOpacity style={styles.buttonInModal}>
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
                            <TouchableOpacity style={styles.buttonInModal}>
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