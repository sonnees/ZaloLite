import React, { useState, useEffect, useContext } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Text,
  StatusBar,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { GlobalContext } from '../context/GlobalContext';
import { host } from "../api/Api";

const AddMemberScreen = () => {
  let navigation = useNavigation();
  let route = useRoute();
  const isFocused = useIsFocused();
  const { myUserInfo, setMyUserInfo } = useContext(GlobalContext);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [chatGroupdata, setChatGroupdata] = useState([]);
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    fetchChatGroupData();
  }, [isFocused]);

  const fetchChatGroupData = async () => {
    try {
      const data = myUserInfo.conversations.map((conversation) => ({
        id: conversation.chatID,
        userName: conversation.chatName,
        userAvatar: conversation.chatAvatar,
        type: conversation.type,
      }));
      const datafilter = data.filter((item) => item.type !== "GROUP");
      setChatGroupdata(datafilter);
    } catch (error) {
      console.error("Error fetching chat group data:", error.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleSelect(item.id)}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <Image
          style={{ width: 50, height: 50, borderRadius: 25 }}
          source={{ uri: item.userAvatar }}
        />
        <View style={{ marginLeft: 20, flexDirection: "column", flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", top: 10 }}>
            {item.userName}
          </Text>
          <Text style={{ fontSize: 16, color: "#808080" }}>{item.time}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleSelect(item.id)}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: selectedIds.includes(item.id) ? "#1E90FF" : "#ccc",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedIds.includes(item.id) && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "#1E90FF",
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleChoosePhoto = (imageUrl) => {
    setModalVisible(false);
    setSelectedImageUrl(imageUrl);
  };

  const handleTakePhoto = () => {
    setModalVisible(false);
  };

  const handleCreateGroup = async () => {
    const ownerId = selectedIds[0];
    const owner = {
      userID: ownerId,
      userName: chatGroupdata.find((user) => user.id === ownerId)?.userName,
      userAvatar: chatGroupdata.find((user) => user.id === ownerId)?.userAvatar,
    };

    const members = selectedIds.map((id) => ({
      userID: id,
      userName: chatGroupdata.find((user) => user.id === id)?.userName,
      userAvatar: chatGroupdata.find((user) => user.id === id)?.userAvatar,
    }));

    const generateUUID = () => {
      const randomPart = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };

      return (
        randomPart() +
        randomPart() +
        '-' +
        randomPart() +
        '-0000-' +
        randomPart() +
        '-' +
        randomPart() +
        randomPart() +
        randomPart()
      );
    };

    const newGroup = {
      id: generateUUID(),
      tgm: "TGM01",
      chatName: groupName,
      owner,
      members,
      avatar: selectedImageUrl,
    };

    console.log("Thông tin newGroup: ", newGroup);

    try {
      let existingGroups = await AsyncStorage.getItem('groups');
      existingGroups = existingGroups ? JSON.parse(existingGroups) : [];

      // Check if group already exists
      const existingGroupIndex = existingGroups.findIndex(group => group.id === newGroup.id);
      if (existingGroupIndex !== -1) {
        // Add new members to existing group
        existingGroups[existingGroupIndex].members.push(...newGroup.members);
      } else {
        existingGroups.push(newGroup);
      }

      // Save updated groups to AsyncStorage
      await AsyncStorage.setItem('groups', JSON.stringify(existingGroups));

      // Lưu thông tin nhóm vào database backend
      await saveGroupToBackend(newGroup);
      console.log("Thông tin newGroup: ", newGroup);

      // Update myUserInfo with the new group
      const updatedUserInfo = {
        ...myUserInfo,
        conversations: [
          ...myUserInfo.conversations,
          {
            chatID: newGroup.id,
            chatName: newGroup.chatName,
            chatAvatar: newGroup.avatar,
            type: "GROUP",
          },
        ],
      };

      // Update GlobalContext
      setMyUserInfo(updatedUserInfo);

      navigation.navigate("OpionNavigator", {
        screen: "ChatGroupScreen",
        params: {
          groupId: newGroup.id,
          groupName: newGroup.chatName,
          groupImage: newGroup.avatar,
          owner: newGroup.owner.userID,
          members: newGroup.members.map((member) => member.userID),
        },
      });
    } catch (error) {
      console.error("Error saving group:", error);
    }
  };


  const saveGroupToBackend = async (newGroup) => {
    const newSocket = new WebSocket(`ws://${host}:8082/ws/group`);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      newSocket.send(JSON.stringify(newGroup));
    };

    newSocket.onmessage = (event) => {
      console.log("Received data from backend:", event.data);
      newSocket.close();
    };

    newSocket.onerror = (error) => {
      console.error('Error connecting to WebSocket:', error);
      Alert.alert("Lỗi", "Không thể kết nối đến server");
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      newSocket.close();
    };
  };




  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <StatusBar />
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#DDDDDD",
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 6,
            height: 60,
          }}
        >
          <Image
            style={{ width: "15%", height: "65%", resizeMode: "contain" }}
            source={require("../assets/back_den.png")}
            onStartShouldSetResponder={() =>
              navigation.navigate("TabNavigator", { screen: "Messages" })
            }
          />
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                fontFamily: "Roboto",
                marginLeft: "2%",
              }}
            >
              Thêm vào nhóm
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                fontFamily: "Roboto",
                color: "#999999",
                marginLeft: "2%",
              }}
            >
              Đã chọn: {selectedIds.length}
            </Text>
          </View>
        </View>


        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 30,
            height: 80,
            top: 40,
            paddingLeft: "4%",
            paddingRight: "4%",
          }}
        >
          <View
            style={{
              flex: 7,
              flexDirection: "row",
              borderRadius: 8,
              backgroundColor: "#fff",
              height: 45,
              paddingHorizontal: 5,
              alignItems: "center",
            }}
          >
            <Icon
              name="search1"
              size={25}
              color={"gray"}
              style={{ paddingLeft: 2, justifyContent: "center" }}
            />
            <TextInput
              style={{ flex: 1, paddingLeft: 10 }}
              placeholder="Tìm kiếm hoặc số điện thoại"
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", top: 7, alignItems: "center", marginLeft: "5%", justifyContent: "flex-start" }}>
          <Image style={{ width: 50, height: 50, resizeMode: "contain", marginTop: "5%" }} source={require("../assets/copy-linkD.png")}></Image>
          <Text style={{ fontSize: 16, fontWeight: "bold", top: 10, left: 20 }}>Mời vào nhóm bằng link</Text>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.bottomModal}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  style={{ alignItems: "flex-start" }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    Cập nhật hình đại diện
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={{ alignItems: "center", top: 15 }}
                      onPress={() =>
                        handleChoosePhoto(
                          "https://res.cloudinary.com/dbmkvqy3b/image/upload/v1712652089/inup7ki7zxzwo90dwfhv.jpg"
                        )
                      }
                    >
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 50,
                          resizeMode: "cover",
                          marginBottom: 10,
                        }}
                        source={{
                          uri: "https://res.cloudinary.com/dbmkvqy3b/image/upload/v1712652089/inup7ki7zxzwo90dwfhv.jpg",
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ alignItems: "center", top: 15, marginLeft: 15 }}
                      onPress={() =>
                        handleChoosePhoto(
                          "https://res.cloudinary.com/dbmkvqy3b/image/upload/v1712652089/axrbkyueasx5pniemkvn.jpg"
                        )
                      }
                    >
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 50,
                          resizeMode: "cover",
                          marginBottom: 10,
                        }}
                        source={{
                          uri: "https://res.cloudinary.com/dbmkvqy3b/image/upload/v1712652089/axrbkyueasx5pniemkvn.jpg",
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ alignItems: "center", top: 15, marginLeft: 15 }}
                      onPress={() =>
                        handleChoosePhoto(
                          "https://res.cloudinary.com/dbmkvqy3b/image/upload/v1712652090/ewvanu0x7gbweck2y63j.jpg"
                        )
                      }
                    >
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 50,
                          resizeMode: "cover",
                          marginBottom: 10,
                        }}
                        source={{
                          uri: "https://res.cloudinary.com/dbmkvqy3b/image/upload/v1712652090/ewvanu0x7gbweck2y63j.jpg",
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ alignItems: "center", top: 15, marginLeft: 15 }}
                      onPress={() =>
                        handleChoosePhoto(
                          "https://res.cloudinary.com/dbmkvqy3b/image/upload/v1712652090/en6wlbvhw9dudqwk46tu.jpg"
                        )
                      }
                    >
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 50,
                          resizeMode: "cover",
                          marginBottom: 10,
                        }}
                        source={{
                          uri: "https://res.cloudinary.com/dbmkvqy3b/image/upload/v1712652090/en6wlbvhw9dudqwk46tu.jpg",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{ alignItems: "flex-start" }}
                onPress={handleTakePhoto}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Chọn ảnh từ thư viện
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={{ flex: 1, top: 50 }}>
          <FlatList
            data={chatGroupdata.filter((user) =>
              user.userName.toLowerCase().includes(searchText.toLowerCase())
            )}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {selectedIds.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingBottom: 10,
              backgroundColor: "#DDDDDD",
              height: 100,
            }}
          >
            <FlatList
              horizontal
              data={chatGroupdata.filter((item) =>
                selectedIds.includes(item.id)
              )}
              renderItem={({ item }) => (
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 30,
                    margin: 5,
                    top: 10,
                  }}
                  source={{ uri: item.userAvatar }}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />

            <TouchableOpacity
              style={{
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 5,
              }}
              onPress={handleCreateGroup}
            >
              <Image
                style={{ width: 80, height: 50, resizeMode: "contain" }}
                source={require("../assets/right-arrow.png")}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddMemberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomModal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
  },
  modalView: {
    backgroundColor: "white",
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 0,
  },
});