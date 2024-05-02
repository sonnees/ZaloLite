import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { ChatItem } from '../component/ChatVIewElement';
export const MessageModalRecall = ({ modalVisible, setModalVisible, item, conversationOpponent, myUserInfo, friend }) => {
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
}
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