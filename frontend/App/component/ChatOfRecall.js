export { ChatOfReCall }
import React, { memo, useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/';
import { Video } from 'expo-av';
import { getTime } from '../utils/CalTime';
const ChatOfReCall = ({ item, myUserInfo, conversationOpponent }) => {
    const myMessage = '#B0E2FF';
    const [textHeight, setTextHeight] = useState(40);
    const touchableRef = useRef(null);

    const handleTextLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        setTextHeight(height);
    };
    const [modalVisible, setModalVisible] = useState(false);


    const [imageSize, setImageSize] = useState({ width: null, height: null });
    const alignmentStyle = item.userID === myUserInfo.id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
    if (item.userID === myUserInfo.id) {
        return (
            <View style={{ alignItems: 'center' }}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}>
                    <TouchableWithoutFeedback
                        onPress={() => setModalVisible(false)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', margin: 6, elevation: 5 }}>
                            <View style={{ backgroundColor: 'white', height: 100, width: 200, borderRadius: 10, elevation: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={styles.buttonInModal}
                                >
                                    <Image style={{ height: 25, width: 25 }} source={require('../assets/trash-bin.png')}></Image>
                                    <Text style={styles.textInModal}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonInModal}
                                    onPress={() => setModalVisible(false)}>
                                    <Image style={{ height: 25, width: 25 }} source={require('../assets/select.png')}></Image>
                                    <Text style={styles.textInModal}>Multiselect</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {item.contents.length > 1 ? (
                    <React.Fragment>
                        {item.contents.map((contentIndex) => (
                            <TouchableOpacity
                                key={contentIndex}
                                style={{
                                    flexDirection: 'row',
                                    borderRadius: 12,
                                    backgroundColor: myMessage,
                                    marginHorizontal: 10,
                                    ...alignmentStyle,
                                    paddingHorizontal: 10,
                                    width: imageSize.width,
                                    maxHeight: 300,
                                    maxWidth: '60%',
                                    flexDirection: 'column'
                                }}
                                onLongPress={() => { { setModalVisible(true); console.log(modalVisible); } }}
                            >
                                <Text
                                    onLayout={handleTextLayout}
                                    style={{ flexWrap: 'wrap', fontSize: 15, marginTop: 5, color: '#999999' }}
                                >
                                    Message recalled
                                </Text>
                                <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>
                                    {getTime(item.timestamp)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </React.Fragment>
                ) : (
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            borderRadius: 12,
                            backgroundColor: myMessage,
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            width: imageSize.width,
                            maxHeight: 300,
                            maxWidth: '60%',
                            flexDirection: 'column'
                        }}
                        onLongPress={() => { { setModalVisible(true); console.log(modalVisible); } }}
                    >
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 15, marginTop: 5, color: '#999999' }}
                        >
                            Message recalled
                        </Text>
                        <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>
                            {getTime(item.timestamp)}
                        </Text>
                    </TouchableOpacity>
                )}
                <View style={{ height: 8 }} />
            </View>
        );
    } else {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}>
                    <TouchableWithoutFeedback
                        onPress={() => setModalVisible(false)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', margin: 6, elevation: 5 }}>
                            <View style={{ backgroundColor: 'white', height: 100, width: 200, borderRadius: 10, elevation: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={styles.buttonInModal}
                                >
                                    <Image style={{ height: 25, width: 25 }} source={require('../assets/trash-bin.png')}></Image>
                                    <Text style={styles.textInModal}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonInModal}
                                    onPress={() => setModalVisible(false)}>
                                    <Image style={{ height: 25, width: 25 }} source={require('../assets/select.png')}></Image>
                                    <Text style={styles.textInModal}>Multiselect</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <React.Fragment>
                    {item.contents.map((content, contentIndex) => {
                        const isMultiple = item.contents.length > 1;
                        const containerStyle = {
                            alignItems: 'center',
                            flexDirection: 'row'
                        };
                        const messageStyle = {
                            flexDirection: 'row',
                            borderRadius: 12,
                            backgroundColor: 'white',
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            width: imageSize.width,
                            maxWidth: '60%',
                            flexDirection: 'column'
                        };
                        if (!isMultiple) {
                            messageStyle.maxHeight = 300;
                        }
                        return (
                            <View key={contentIndex} style={{}}>
                                <View style={containerStyle}>
                                    <Image
                                        source={conversationOpponent.chatAvatar ? { uri: conversationOpponent.chatAvatar } : null}
                                        style={{ height: 30, width: 30, borderRadius: 50, marginRight: 8, marginLeft: 8 }}
                                    />
                                    <TouchableOpacity style={messageStyle}
                                        onLongPress={() => { { setModalVisible(true); console.log(modalVisible); } }}
                                    >
                                        <ChatName conversationOpponent={conversationOpponent} />
                                        <Text onLayout={handleTextLayout} style={{ flexWrap: 'wrap', fontSize: 15, marginTop: 5, color: '#999999' }}>
                                            Message recalled
                                        </Text>
                                        <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ height: 8 }} />
                            </View>
                        );
                    })}
                </React.Fragment>
            </View>
        );
    }

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

function containsDoublePipe(key) {
    return key.indexOf('|') !== key.lastIndexOf('|');
}


const ChatName = ({ conversationOpponent }) => {
    return (
        <Text
            style={{ flexWrap: 'wrap', fontSize: 12, marginTop: 5, color: '#CD853F' }}
        >
            {conversationOpponent.chatName}
        </Text>
    )
}

const ChatAatar = ({ conversationOpponent }) => {
    return (
        <Image
            source={conversationOpponent.chatAvatar ? { uri: conversationOpponent.chatAvatar } : null}
            style={{ height: 30, width: 30, borderRadius: 50, marginRight: 8, marginLeft: 8 }}
        />
    )
}
function findTopChatActivity(messageID, topChatActivity) {
    for (let i = 0; i < topChatActivity.length; i++) {
        if (topChatActivity[i].messageID === messageID) {
            return topChatActivity[i];
        }
    }
    return null;
}