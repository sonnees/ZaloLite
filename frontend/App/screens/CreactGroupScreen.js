import React, { useState, useEffect } from "react";
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
import chatGroupdata from "../data/chatGroup"; // Thay đổi đường dẫn

const CreateGroupScreen = () => {
  let navigation = useNavigation();
  let route = useRoute();

  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [groupName, setGroupName] = useState("");

  // WebSocket
  const ws = new WebSocket("ws://192.168.1.10:8082/ws/group");

  ws.onopen = () => {
    console.log("Connected to the websocket");
  };

  ws.onmessage = (event) => {
    try {
      const data = event.data.trim();
      console.log("Received:", data);

      if (data === "Connect success") {
        console.log("data: Connect success", data);
        return;
      }

      if (isJSON(data)) {
        const jsonData = JSON.parse(data);

        navigation.navigate("OpionNavigator", {
          screen: "ChatGroupScreen",
          params: {
            groupId: jsonData.id,
            groupName: jsonData.chatName,
            groupImage: jsonData.avatar,
            members: jsonData.members.map((member) => member.userID),
          },
        });
      } else {
        console.error("Received data is not a valid JSON.");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  const isJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
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
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
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
    // TODO: Handle taking photo
    setModalVisible(false);
  };

  const handleCreateGroup = async () => {
    if (!groupName) {
      Alert.alert("Lỗi", "Bạn phải nhập tên nhóm để tiếp tục!");
      return;
    }
  
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

    const newGroup = {
      id: Date.now().toString(),
      tgm: "TGM01",
      chatName: groupName,
      owner,
      members,
      avatar: selectedImageUrl,
    };

    // Save owner to AsyncStorage
    try {
      await AsyncStorage.setItem('owner', JSON.stringify(owner));
    } catch (error) {
      console.error("Error saving owner to AsyncStorage:", error);
    }

    // Hiển thị thông tin new group
    console.log("Thông tin newGroup: ", newGroup);

    // Chuyển đến màn hình ChatGroupScreen và truyền các tham số
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
              Nhóm mới
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
            height: 60,
            top: 30,
          }}
        >
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50, resizeMode: "contain", top: -1 }}
              source={selectedImageUrl ? { uri: selectedImageUrl } : require("../assets/photo.png")}
            />
          </TouchableOpacity>

          <View style={{ paddingHorizontal: 30 }}>
            <TextInput
              style={{
                marginRight: "15%",
                borderBottomColor: "#1E90FF",
                fontSize: 16,
                top: "-12%",
                padding: 10,
                flex: 1,
                marginLeft: "-15%",
              }}
              placeholder="Đặt tên nhóm"
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>
          <TouchableOpacity
            style={{ position: "absolute", right: "6%", top: "10%" }}
            onPress={handleCreateGroup}
          >
            <Image
              style={{ width: 30, height: 30, resizeMode: "contain" }}
              source={require("../assets/check.png")}
            />
          </TouchableOpacity>
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
            />
          </View>
        </View>

        {/* Modal for choosing photo */}
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

        {/* Display list of friends */}
        <View style={{ flex: 1, top: 50 }}>
          <FlatList
            data={chatGroupdata}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Display selected items if any */}
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

            {/* Additional TouchableOpacity on the right */}
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

export default CreateGroupScreen;

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
