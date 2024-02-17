import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Icon, Text, Header } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'; // Import MenuProvider here

const ChatScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello', fromMe: false },
    { id: 2, text: 'Hi there!', fromMe: true },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = { id: messages.length + 1, text: inputText, fromMe: true };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.fromMe && styles.myMessageContainer]}>
      <Text style={[styles.messageText, item.fromMe && styles.myMessageText]}>{item.text}</Text>
    </View>
  );

  const renderHeader = () => (
    <Header
      placement="left"
      leftComponent={<HeaderBackButton />}
      rightComponent={<HeaderButtons />}
      centerComponent={{ text: 'Trần Thiện Đạt', style: { color: '#fff', fontSize: 18, fontWeight: "bold" } }}
      containerStyle={{ backgroundColor: '#1E90FF' }}
    />
  );

  const HeaderBackButton = () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon name="arrow-back" size={30} color="#fff" style={{ marginHorizontal: 10 }} />
    </TouchableOpacity>
  );

  const HeaderButtons = () => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => { /* Handle call button press */ }}>
        <Icon name="call" size={30} color="#fff" style={{ marginHorizontal: 10 }} />
      </TouchableOpacity>
      
      {/* Menu trigger */}
      <Menu>
        <MenuTrigger>
          <TouchableOpacity>
            <Icon name="dots-horizontal" size={30} color="#fff" style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
        </MenuTrigger>

        {/* Menu options */}
        <MenuOptions>
          <MenuOption onSelect={() => { /* Handle option 1 press */ }} text="Option 1" />
          <MenuOption onSelect={() => { /* Handle option 2 press */ }} text="Option 2" />
          {/* Add more options as needed */}
        </MenuOptions>
      </Menu>
    </View>
  );

  return (
    <MenuProvider> {/* Wrap your entire component with MenuProvider */}
      <View style={styles.container}>
        {renderHeader()}
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
        <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={(text) => setInputText(text)}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Icon name="send" size={30} color="#007AFF" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 8,
    padding: 10,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  myMessageText: {
    color: '#0084FF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
