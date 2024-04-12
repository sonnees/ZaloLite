import React, { memo, useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function  ChatGroupScreen ({ route, navigation }) {
  const { groupId, groupName, groupImage, members, owner } = route.params;
  useEffect(() => {
    // Lưu dữ liệu vào local storage
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@groupData:groupId', groupId);
        await AsyncStorage.setItem('@groupData:groupName', groupName);
        await AsyncStorage.setItem('@groupData:groupImage', groupImage);
        await AsyncStorage.setItem('@groupData:members', JSON.stringify(members));
        await AsyncStorage.setItem('@groupData:owner', JSON.stringify(owner)); // Chuyển owner sang chuỗi
      } catch (error) {
        console.error('Lỗi khi lưu dữ liệu:', error);
      }
    };
  
    saveData();
  }, [groupId, groupName, groupImage, members, owner]);
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TabNavigator', { screen: 'MessagesScreen' })}
        >
          <Icon name='arrowleft' color={'white'} size={25} />
        </TouchableOpacity>
        <View style={{ flexDirection: "column", marginLeft: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>{groupName}</Text>
          <Text style={{ fontSize: 12, fontFamily: "Roboto", color: "white" }}>{members.length + 1} thành viên</Text>
        </View>

        <View style={{ flex: 3 }}></View>

        <Image
          style={{ width: 22, height: 22, resizeMode: "contain", margin: 8 }}
          source={require("../assets/telephone.png")}
        />
        <Image
          style={{ width: 28, height: 28, resizeMode: "contain", margin: 10 }}
          source={require("../assets/video.png")}
        />
        <Image
          style={{ width: 20, height: 20, resizeMode: "contain", margin: 8 }}
          source={require("../assets/list.png")}
          onStartShouldSetResponder={() => navigation.navigate("OpionNavigator", { screen: "OptionGroupScreen" })}
        />
      </View>

      <View style={{ flex: 9 }}>
        <View style={{ flex: 1.5, backgroundColor: "#fff", flexDirection: "row", marginLeft: "5%", marginRight: "5%", top: "5%", justifyContent: "center", alignItems: "center" }}>
            <Image style={{ width: 50, height: 50, borderRadius: 50, resizeMode: "contain", marginLeft: "5%" }} source={{ uri: groupImage }} />
            <View style={{flexDirection: "column", marginLeft: "5%"}}>
                <Text style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold" }}>{groupName}</Text>
                <Text style={{ fontFamily: "Roboto", fontSize: 15, color: "#808080" }}>Bắt đầu chia sẻ những câu chuyện</Text>
            </View>
        </View>
        <View style={{flex: 8}}>
          {/* Thêm code để hiển thị các tin nhắn trong nhóm ở đây hiện thị thông tin */}
        </View>
      </View>

      <View style={styles.foter}>
        <Image
          style={{ width: 22, height: 22, resizeMode: "contain", marginLeft: 8 }}
          source={require("../assets/face.png")}
        />
        <TextInput 
          style={{
            flex: 1,
            borderRadius: 5, 
            fontSize: 20,
            marginLeft: 10, 
            color: "#808080", 
            justifyContent: "center",
          }}
          placeholder="Message" 
          placeholderTextColor={'gray'} 
        />
        <View style={{ flexDirection: 'row', flex: 0.8, justifyContent: 'space-between', marginBottom: 5, marginRight: -5 }}>
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
            <Image
              style={{ width: 30, height: 30, resizeMode: "contain", marginLeft: 2 }}
              source={require("../assets/morechat.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ justifyContent: 'center' }}>
            <Image
              style={{ width: 23, height: 23, resizeMode: "contain" }}
              source={require("../assets/microphone.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ justifyContent: 'center', marginBottom: 5 }}>
            <EvilIcon name='image' size={38} color={'gray'} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  header: {
    height: 50,
    backgroundColor: "#1E90FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  foter: {
    height: 48,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
});

