export { ChatItem }
import { View, Text, Image, TouchableOpacity, Linking, } from 'react-native';
import React, { memo, useState, useRef, useEffect } from 'react';

import { Video } from 'expo-av';

const ChatItem = memo(({ item, myID, conversationOpponent }) => {
    const [textHeight, setTextHeight] = useState(0);
    const touchableRef = useRef(null);
    const [videoKey, setVideoKey] = useState(0);
    const handleTextLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        setTextHeight(height);
        if (touchableRef.current) {
            touchableRef.current.setNativeProps({
                style: { height: height + 20 } // 20 là padding dự phòng
            });
        }
    };
    const [imageSize, setImageSize] = useState({ width: null, height: null });

    const handleImageLoad = (event) => {
        const { width, height } = event.nativeEvent.source;
        setImageSize({ width, height });
    };
    const alignmentStyle = item.userID === myID ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };

    if (item.contents[0].key === 'text' || item.contents[0].key === 'emoji') {
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Image
                        source={conversationOpponent.chatAvatar ? { uri: conversationOpponent.chatAvatar } : null}
                        style={{ height: 30, width: 30, borderRadius: 50, marginRight: 8, marginLeft: 8 }}
                    />

                    <TouchableOpacity
                        ref={touchableRef}
                        style={{
                            flexDirection: 'row',
                            borderRadius: 12,
                            backgroundColor: 'white',
                            marginHorizontal: 10,
                            alignItems: 'center',
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            maxWidth: 280,
                        }}
                    >
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 15 }}

                        >
                            {item.contents[0].value}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 8 }} />
            </View>
        );
    }
    if (item.contents[0].key === 'image') {
        if (item.contents.length > 1) {
            return (
                <View style={{ alignItems: 'center' }}>
                    {item.contents.map((content, index) => (
                        <View style={{
                            ...alignmentStyle,
                        }}>
                            <TouchableOpacity
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    marginHorizontal: 10,
                                    ...alignmentStyle,
                                    width: imageSize.width,
                                    height: imageSize.height,
                                    maxHeight: 300,
                                    maxWidth: '60%',
                                    marginLeft: 50
                                }}
                            >
                                <Image
                                    source={{ uri: content.value }}
                                    style={{ height: '100%', width: '100%' }}
                                    resizeMode="cover"
                                    onLoad={handleImageLoad}
                                />
                            </TouchableOpacity>
                            <View style={{ height: 8 }} />
                        </View>
                    ))}
                    <View style={{ height: 8 }} />
                </View>
            );
        } else {
            return (
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            borderRadius: 12,
                            backgroundColor: 'white',
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            width: imageSize.width,
                            height: imageSize.height,
                            maxHeight: 300,
                            maxWidth: '60%',
                            marginLeft: 50
                        }}
                    >
                        <Image
                            source={{ uri: item.contents[0].value }}
                            style={{ height: '100%', width: '100%' }}
                        // resizeMode="contain"
                        // onLoad={handleImageLoad}
                        />
                    </TouchableOpacity>
                    <View style={{ height: 8 }} />
                </View>
            );
        }
    } else if (item.contents[0].key.startsWith('zip')) {
        // Hiển thị nội dung cho tệp ZIP
        const parts = item.contents[0].key.split('|');
        const fileName = parts[1];
        const fileSize = parts[2];
        const fileUrl = item.contents[0].value;

        return (
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
                    style={{
                        flexDirection: 'row',
                        borderRadius: 12,
                        backgroundColor: 'white',
                        marginHorizontal: 10,
                        alignItems: 'center',
                        ...alignmentStyle,
                        paddingHorizontal: 10,
                        maxWidth: 280,
                        marginLeft: 50,
                        maxHeight: 70, height: 100
                    }}
                >
                    <Image source={require('../assets/zip-folder.png')} style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400' }}
                        >{fileName}</Text>
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
                        >{fileSize}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    else if (item.contents[0].key.startsWith('pdf')) {
        // Hiển thị nội dung cho tệp ZIP
        const parts = item.contents[0].key.split('|');
        const fileName = parts[1];
        const fileSize = parts[2];
        const fileUrl = item.contents[0].value;

        return (
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
                    style={{
                        flexDirection: 'row',
                        borderRadius: 12,
                        backgroundColor: 'white',
                        marginHorizontal: 10,
                        alignItems: 'center',
                        ...alignmentStyle,
                        paddingHorizontal: 10,
                        maxWidth: 280,
                        marginLeft: 50,
                        maxHeight: 70, height: 100
                    }}
                >
                    <Image source={require('../assets/pdf.png')} style={{ width: 50, height: 50, marginRight: 5, marginLeft: 5 }} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400', width: 120 }}
                        >{fileName}</Text>
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
                        >{fileSize}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    } else if (item.contents[0].key.startsWith('doc' || 'docx')) {
        // Hiển thị nội dung cho tệp ZIP
        const parts = item.contents[0].key.split('|');
        const fileName = parts[1];
        const fileSize = parts[2];
        const fileUrl = item.contents[0].value;

        return (
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
                    style={{
                        flexDirection: 'row',
                        borderRadius: 12,
                        backgroundColor: 'white',
                        marginHorizontal: 10,
                        alignItems: 'center',
                        ...alignmentStyle,
                        paddingHorizontal: 10,
                        maxWidth: 280,
                        marginLeft: 50,
                        maxHeight: 70, height: 100
                    }}
                >
                    <Image source={require('../assets/doc.png')} style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400' }}
                        >{fileName}</Text>
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
                        >{fileSize}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    } else if (item.contents[0].key.startsWith('xlsx' || 'xls')) {
        // Hiển thị nội dung cho tệp ZIP
        const parts = item.contents[0].key.split('|');
        const fileName = parts[1];
        const fileSize = parts[2];
        const fileUrl = item.contents[0].value;

        return (
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
                    style={{
                        flexDirection: 'row',
                        borderRadius: 12,
                        backgroundColor: 'white',
                        marginHorizontal: 10,
                        alignItems: 'center',
                        ...alignmentStyle,
                        paddingHorizontal: 10,
                        maxWidth: 280,
                        marginLeft: 50,
                        maxHeight: 70, height: 100
                    }}
                >
                    <Image source={require('../assets/xlsx.png')} style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 15, fontWeight: '400' }}
                        >{fileName}</Text>
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 11, fontWeight: '400' }}
                        >{fileSize}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    else if (item.contents[0].key === 'link') {
        const linkUrl = item.contents[0].value;
        console.log("LINK URL: ", linkUrl);

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
            <View style={{ alignItems: 'center' }}>
                {linkPreview ? (
                    <TouchableOpacity
                        onPress={() => Linking.openURL(linkUrl)} // Mở liên kết khi người dùng chạm vào
                        style={{
                            flexDirection: 'row',
                            borderRadius: 12,
                            backgroundColor: '#B0E2FF',
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
                            backgroundColor: 'white',
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
        );
    }

    else if (item.contents[0].key === 'mp4') {
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Image
                        source={conversationOpponent.chatAvatar ? { uri: conversationOpponent.chatAvatar } : null}
                        style={{ height: 30, width: 30, borderRadius: 50, marginRight: 8 }}
                    />
                    <TouchableOpacity
                        onPress={() => {

                        }}
                        style={{
                            flexDirection: 'row',
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            maxHeight: 300,
                            maxWidth: '60%',
                            backgroundColor: 'white'
                        }}
                    >
                        <Video
                            key={videoKey} // Sử dụng videoKey ở đây để kích hoạt việc rerender
                            source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                            shouldPlay
                            style={{ width: '100%', height: 300 }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 8 }} />
            </View>
        );
    }
});

{/* <ChatElement
    id={conversation.chatID}
    key={conversation.chatID}
    chatName={conversation.chatName}
    chatAvatar={conversation.chatAvatar}
    {...conversation}
/> */}