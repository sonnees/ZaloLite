const ChatOfOpponentHasAContent = ({ conversationOpponent, item }) => {
    const [textHeight, setTextHeight] = useState(40);
    const touchableRef = useRef(null);
    const [videoKey, setVideoKey] = useState(0);
    const myMessage = '#B0E2FF';
    const handleTextLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        setTextHeight(height);
    };

    const [imageSize, setImageSize] = useState({ width: null, height: null });

    const handleImageLoad = (event) => {
        const { width, height } = event.nativeEvent.source;
        setImageSize({ width, height });
    };
    const alignmentStyle = item.userID === myUserInfo.id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
    if (item.contents[0].key === 'text' || item.contents[0].key === 'emoji') {
        return (
            <View style={{}}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <ChatAatar
                        conversationOpponent={conversationOpponent}
                    />
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            borderRadius: 12,
                            backgroundColor: 'white',
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            width: imageSize.width,
                            // height: textHeight + 20,
                            maxHeight: 300,
                            maxWidth: '60%',
                            flexDirection: 'column'
                        }}
                    >
                        <ChatName
                            conversationOpponent={conversationOpponent}
                        />
                        <Text
                            onLayout={handleTextLayout}
                            style={{ flexWrap: 'wrap', fontSize: 15, marginTop: 5 }}
                        >
                            {item.contents[0].value}
                        </Text>
                        <Text style={{ fontSize: 8, alignSelf: 'flex-start', color: '#888888' }}>{getTime(item.timestamp)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 8 }} />
            </View>
        );
    } else if (item.contents[0].key === 'image') {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Image
                    source={conversationOpponent.chatAvatar ? { uri: conversationOpponent.chatAvatar } : null}
                    style={{ height: 30, width: 30, borderRadius: 50, marginRight: 8, marginLeft: 8 }}
                />
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        borderRadius: 12,
                        backgroundColor: 'white',
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
                    <ChatName
                        conversationOpponent={conversationOpponent}
                    />
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
    } else if (containsDoublePipe(item.contents[0].key)) {
        const typeFile = useMemo(() => {
            const file = {};
            if (item.contents[0].key.startsWith('docx|') || item.contents[0].key.startsWith('doc|'))
                file.icon = require('../assets/doc.png');
            else if (item.contents[0].key.startsWith('xlsx|') || item.contents[0].key.startsWith('xls|'))
                file.icon = require('../assets/xlsx.png');
            else if (item.contents[0].key.startsWith('pdf|'))
                file.icon = require('../assets/pdf.png');
            else if (item.contents[0].key.startsWith('zip|'))
                file.icon = require('../assets/zip-folder.png');
            else if (item.contents[0].key.startsWith('rar|'))
                file.icon = require('../assets/rar.png');
            else
                file.icon = require('../assets/attachfile.png');
            return file;
        }, [item.contents[0].key]);

        const parts = item.contents[0].key.split('|');
        const fileName = parts[1];
        const fileSize = parts[2];
        const fileUrl = item.contents[0].value;
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <ChatAatar
                        conversationOpponent={conversationOpponent}
                    />
                    <TouchableOpacity
                        onPress={() => Linking.openURL(fileUrl)} // Mở liên kết khi người dùng chạm vào
                        style={{
                            flexDirection: 'column',
                            borderRadius: 12,
                            backgroundColor: 'white',
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            paddingHorizontal: 10,
                            maxWidth: 280,
                            maxHeight: 90, height: 90
                        }}
                    >
                        <ChatName
                            conversationOpponent={conversationOpponent}
                        />
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Image source={typeFile.icon} style={{ width: 50, height: 50, marginRight: 10 }} />
                            <View style={{ flexDirection: 'column' }}>
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
                </View>
                <View style={{ height: 8 }} />
            </View>
        );

    } else if (item.contents[0].key === 'link') {
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
            <View style={{}}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <ChatAatar
                        conversationOpponent={conversationOpponent}
                    />
                    {linkPreview ? (
                        <TouchableOpacity
                            onPress={() => Linking.openURL(linkUrl)} // Mở liên kết khi người dùng chạm vào
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
                            <ChatName
                                conversationOpponent={conversationOpponent}
                            />
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
                            <ChatName
                                conversationOpponent={conversationOpponent}
                            />
                            <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 15 }}>{linkUrl}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{ height: 8 }} />
            </View>
        );
    } else if (item.contents[0].key === 'mp4') {
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <ChatAatar
                        conversationOpponent={conversationOpponent}
                    />
                    <TouchableOpacity
                        onPress={() => {
                        }}
                        style={{
                            flexDirection: 'column',
                            marginHorizontal: 10,
                            ...alignmentStyle,
                            maxHeight: 400,
                            maxWidth: '60%',
                            backgroundColor: 'white'
                        }}
                    >
                        <ChatName
                            conversationOpponent={conversationOpponent}
                        />
                        <Video
                            key={videoKey} // Sử dụng videoKey ở đây để kích hoạt việc rerender
                            source={{ uri: item.contents[0].value }}
                            shouldPlay
                            style={{ width: 200, height: 300 }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 8 }} />
            </View>
        );
    }
}