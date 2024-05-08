import React from 'react';
import { View, Text, Image } from 'react-native';

const BackgroundInChat = ({ conversationOpponent }) => {
    return (
        <View
            style={{ height: 205, width: '85%', alignSelf: 'center', margin: 30, marginTop: 10, backgroundColor: 'white', borderRadius: 10 }}
        >
            <Image
                source={{ uri: 'https://i.pinimg.com/736x/c2/e9/02/c2e902e031e1d9d932411dd0b8ab5eef.jpg' }}
                style={{ height: 120, width: '100%', alignSelf: 'center' }}
            />
            <View style={{ flexDirection: 'row' }}>
                <Image
                    source={conversationOpponent.chatAvatar ? { uri: conversationOpponent.chatAvatar } : null}
                    style={{ height: 70, width: 70, borderRadius: 50, margin: 10 }}
                />

                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 12, marginLeft: 10 }}>
                        {conversationOpponent && conversationOpponent.chatName ? conversationOpponent.chatName : null}</Text>
                    <Text style={{ fontSize: 12, marginTop: 7, marginLeft: 10 }}>
                        No one can change my life</Text>
                </View>
            </View>
        </View>
    )
}

export default BackgroundInChat;
