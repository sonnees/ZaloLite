import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8, marginVertical: 4, backgroundColor: '#eee', borderRadius: 8 }}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderRadius: 4, padding: 8 }}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

export default ChatApp;
