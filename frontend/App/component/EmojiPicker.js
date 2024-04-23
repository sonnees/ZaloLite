import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

const EmojiPicker = ({ onSelect }) => {
    // Lấy các emoji từ dữ liệu đã cung cấp
    const emojis = ['😊', '❤️', '🔥', '👍', '😀', '😃', '😄', '😁',
        '😆', '😅', '😂', '🤣', '😊', '😇',
        '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
        '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
        '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
        '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
        '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
        '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
        '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
        '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
        '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾',
        '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

    return (
        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }} style={{ height: 10, backgroundColor: 'white' }}>
            {emojis.map((emoji, index) => (
                <TouchableOpacity key={index} onPress={() => onSelect(emoji)} style={{ margin: 7 }}>
                    <Text style={{ fontSize: 25 }}>{emoji}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default EmojiPicker;
