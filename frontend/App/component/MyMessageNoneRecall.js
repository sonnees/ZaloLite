export { MyMessageNoneRecall }
import React, { memo, useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Video } from 'expo-av';
import { getTime } from '../function/CalTime';
const MyMessageNoneRecall = memo(({ item, conversationOpponent, myUserInfo }) => {
    const [textHeight, setTextHeight] = useState(40);
    const touchableRef = useRef(null);
    const [videoKey, setVideoKey] = useState(0);
    const myMessage = '#B0E2FF';
    const [modalVisible, setModalVisible] = useState(false);
    const handleTextLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        setTextHeight(height);
    };
    const renderContent = () => {
        const key = item.contents[0].key;
        const value = item.contents[0].value;

        switch (key) {
            case 'text':
            case 'emoji':
                return renderTextContent(value, item, myUserInfo);
            case 'image':
                return renderImageContent(value, item, myUserInfo);
            case 'link':
                return renderLinkContent(value, item, myUserInfo);
            case 'mp4':
                return renderVideoContent(value, item, myUserInfo);
            default:
                if (containsDoublePipe(key)) {
                    return renderFileContent(key, value, item, myUserInfo);
                }
                return null;
        }
    };
    const renderTextContent = (text, item, myUserInfo) => (
        <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    borderRadius: 12,
                    backgroundColor: myMessage,
                    marginHorizontal: 10,
                    ...alignmentStyle,
                    paddingHorizontal: 10,
                    width: imageSize.width,
                    // height: 40,
                    height: textHeight + 20,
                    maxHeight: 300,
                    maxWidth: '60%',
                    flexDirection: 'column'
                }}
                onLongPress={() => { { setModalVisible(true); console.log(modalVisible); } }}
            >
                <Text
                    onLayout={handleTextLayout}
                    style={{ flexWrap: 'wrap', fontSize: 15, marginTop: 5 }}
                >
                    {item.contents[0].value}
                </Text>
                <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
            </TouchableOpacity>
            <View style={{ height: 8 }} />
        </View>
    );

    const renderImageContent = (imageUrl, item, myUserInfo) => (
        <View style={{}}>
            <TouchableOpacity
                style={{
                    flexDirection: 'column',
                    borderRadius: 12,
                    backgroundColor: myMessage,
                    marginHorizontal: 10,
                    marginBottom: 8,
                    ...alignmentStyle,
                    paddingHorizontal: 10,
                    maxWidth: '60%',
                    width: '60%', // Sử dụng kích thước từ state
                    height: 300,
                    maxHeight: 300// Sử dụng kích thước từ state
                }}
            >

                <Image
                    source={{ uri: item.contents[0].value }}
                    style={{ width: '100%', height: '100%', maxHeight: 500, }}
                    resizeMode="contain"
                    onLoad={e => {
                        const { width, height } = e.nativeEvent.source;
                        // Update the size of TouchableOpacity based on the image size
                        // You can add additional logic here if needed
                        // setTouchableOpacitySize({ width, height });
                    }}
                />
                <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888', marginTop: -15 }}>{getTime(item.timestamp)}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderLinkContent = (linkUrl, item, myUserInfo) => {
        const [linkPreview, setLinkPreview] = useState(null);
        useEffect(() => {
            fetch(`https://api.linkpreview.net/?key=94bc443dd1d2ec0588af9aff4e012f6d&q=${encodeURIComponent(linkUrl)}`)
                .then(response => response.json())
                .then(data => {
                    const { title, description, image } = data;
                    setLinkPreview({ title, description, image });
                })
                .catch(error => {
                    console.error('Error fetching link preview:', error);
                });
        }, [linkUrl]);

        return (
            <View style={{}}>
                <View style={{}}>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        {linkPreview ? (
                            <TouchableOpacity
                                onPress={() => Linking.openURL(linkUrl)} // Mở liên kết khi người dùng chạm vào
                                style={{
                                    flexDirection: 'row',
                                    borderRadius: 12,
                                    backgroundColor: myMessage,
                                    marginHorizontal: 10,
                                    alignItems: 'center',
                                    ...alignmentStyle,
                                    paddingHorizontal: 10,
                                    maxWidth: 280,
                                    marginLeft: 50
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15, marginTop: 10, marginHorizontal: 10 }}>{linkPreview.title}</Text>
                                    <View style={{ margin: 10, backgroundColor: 'white' }}>
                                        {linkPreview.image && <Image source={{ uri: linkPreview.image }} style={{ width: '100%', height: 100, resizeMode: 'contain' }} />}
                                    </View>
                                    <Text style={{ fontSize: 15, marginHorizontal: 10, marginVertical: '10', marginBottom: 10 }}>{linkPreview.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    borderRadius: 12,
                                    backgroundColor: myMessage,
                                    marginHorizontal: 10,
                                    alignItems: 'center',
                                    ...alignmentStyle,
                                    paddingHorizontal: 10,
                                    maxWidth: 280,
                                    marginLeft: 50
                                }}
                            >
                                <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15 }}>{linkUrl}</Text>
                            </TouchableOpacity>
                        )}
                        <View style={{ height: 8 }} />
                    </View>
                    <View style={{ height: 8 }} />
                </View>
            </View>
        );
    };

    const renderVideoContent = (videoUrl, item, myUserInfo) => (
        <View>
            <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity
                    onPress={() => {
                    }}
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 10,
                        ...alignmentStyle,
                        maxHeight: 300,
                        maxWidth: '60%',
                        backgroundColor: myMessage
                    }}
                >
                    <Video
                        key={videoKey} // Sử dụng videoKey ở đây để kích hoạt việc rerender
                        source={{ uri: item.contents[0].value }}
                        shouldPlay
                        style={{ width: '100%', height: 300 }}
                    />
                </TouchableOpacity>
                <View style={{ height: 8 }} />
            </View>
        </View>
    );

    const renderFileContent = (key, value, item, myUserInfo) => {
        const typeFile = useMemo(() => {
            const file = {};
            if (key.startsWith('docx|') || key.startsWith('doc|'))
                file.icon = require('../assets/doc.png');
            else if (key.startsWith('xlsx|') || key.startsWith('xls|'))
                file.icon = require('../assets/xlsx.png');
            else if (key.startsWith('pdf|'))
                file.icon = require('../assets/pdf.png');
            else if (key.startsWith('zip|'))
                file.icon = require('../assets/zip-folder.png');
            else if (key.startsWith('rar|'))
                file.icon = require('../assets/rar.png');
            else
                file.icon = require('../assets/attachfile.png');
            return file;
        }, [key]);
        const parts = key.split('|');
        const fileName = parts[1];
        const fileSize = parts[2];
        const fileUrl = value;
        return (
            <View>
                <View style={{ flexDirection: 'column' }}>
                    <TouchableOpacity
                        onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
                        style={{
                            flexDirection: 'column',
                            borderRadius: 12,
                            backgroundColor: myMessage,
                            marginHorizontal: 10,
                            alignItems: 'center',
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            maxWidth: 280,
                            maxHeight: 80, height: 100
                        }}
                    >
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <Image source={typeFile.icon} style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }} />
                            <View style={{ flexDirection: 'column', }}>
                                <Text
                                    onLayout={handleTextLayout}
                                    style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400', maxWidth: 150 }}
                                >{fileName}</Text>
                                <Text
                                    onLayout={handleTextLayout}
                                    style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
                                >{fileSize}</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
                    </TouchableOpacity>
                    <View style={{ height: 8 }} />
                </View>
            </View>
        );
    };

    const [imageSize, setImageSize] = useState({ width: null, height: null });

    const alignmentStyle = item.userID === myUserInfo.id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
    return renderContent()
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonInModal: {
        flexDirection: 'row',
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
