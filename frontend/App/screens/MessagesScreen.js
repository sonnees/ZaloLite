import React, { memo, useState } from 'react';
import { View, Modal, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Text, StatusBar, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
const MessagesScreen = () => {
  let navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [colorTextInView, setColorTextInView] = useState("gray");
  const [modalChatVisible, setModalChatVisible] = useState(false);
  const data = [
    {
      id: 1, userName: "Hà Anh Thảo", userAvatar: "https://avatars.githubusercontent.com/u/81128952?v=4", value: "Xin chào! Bạn đã ăn tối chưa?", time: '1 hours'
    },
    {
      id: 2, userName: "Hiếu Đông", userAvatar: "https://s120-ava-talk.zadn.vn/b/1/6/9/2/120/49c735f44a48922c94785739bc2b91e7.jpg", value: "Biết Bằng bị Gay không", time: '2 hours'
    },
    {
      id: 3, userName: "Bích Trâm", userAvatar: "https://zpsocial-f48-org.zadn.vn/8f551df048eca6b2fffd.jpg", value: "Dọ dọ em xin lỗi", time: '1 min'
    },
    {
      id: 4, userName: "Pé Yêu", userAvatar: "https://luv.vn/wp-content/uploads/2021/12/hinh-anh-gai-mat-vuong-xinh-dep-12.jpg", value: "Hello Mother Fucker", time: '4 min'
    },
    {
      id: 5, userName: "Mai Linh", userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS3FjhqmMmpDz8QyIE7PkxUm1xmHn1TY9ARw&usqp=CAU", value: "Gì z ba", time: '1 hours'
    },
    {
      id: 6, userName: "Quang Minh", userAvatar: "https://htmediagroup.vn/wp-content/uploads/2021/06/Anh-profile-46.jpg", value: "Hôm qua đi học trễ", time: '1 hours'
    },
    {
      id: 7, userName: "Trang Hồ", userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsxmJ_6AgWofnHmTSdCBopgOXiQMZPzvc-vWT_Vvd2B-BvMxzI6Vp7OCE3tuWuXIwx3aY&usqp=CAU", value: "Hehe", time: '1 hours'
    },
    {
      id: 8, userName: "Tuấn Kiệt", userAvatar: "https://hthaostudio.com/wp-content/uploads/2019/08/Nam-11-min.jpg", value: "Xin lỗi", time: '1 hours'
    },
    {
      id: 9, userName: "Linh Nhi", userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOjVTVcNlPaeEpJnMLi3IGfoSlmZ-jj4MJpA&usqp=CAU", value: "Bạn là ai vậy ?", time: '1 hours'
    },
    {
      id: 10, userName: "Phương Anh", userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw6-fmpGWQFg8JA4eUKWwGwYNgS4H-FyLtnQ&usqp=CAU", value: "Haha", time: '1 hours'
    },
  ]

  const handlePress = () => {
    // Kiểm tra nếu modal đã hiển thị, thì đóng modal
    if (modalVisible) {
      setModalChatVisible(false);
    } else {
      // Nếu modal chưa hiển thị, thực hiện navigate qua TabNavigator
      navigation.navigate("ChatScreen");
    }
  };

  const handleLongPress = () => {
    // Hiển thị modal khi người dùng nhấn giữ lâu hơn 0.5 giây
    setTimeout(() => {
      setModalChatVisible(true);
    }, 500);
  };


  const ChatElement = memo(({ item }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={handlePress}
          onLongPress={handleLongPress}
          style={{ height: 75, flexDirection: 'row', width: '100%' }}
        >
          <Image style={{ width: 55, height: 55, resizeMode: "contain", borderRadius: 50, margin: 12, marginLeft: 20 }}
            source={{ uri: item.userAvatar }} />


          <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: '400', marginBottom: 10 }}>{item.userName}</Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: 'gray', marginBottom: 10 }}>{item.value}</Text>
          </View>


          <View style={{ justifyContent: 'flex-start', alignItems: 'center', flex: 1, flexDirection: 'row', marginBottom: 30 }}>
            <Icon name='pushpino' size={15}></Icon>
            <Text style={{ fontSize: 12.5, fontWeight: '400', color: 'gray' }}>{item.time}</Text>
          </View>
          <View style={{ height: 15, width: 20, borderRadius: 50, backgroundColor: 'red', marginTop: 45, marginRight: 15 }}>
            <Text style={{ fontSize: 10, fontWeight: '400', color: 'white', textAlign: 'center' }}>+2</Text>
          </View>

        </TouchableOpacity>
        <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 1, width: '100%', marginLeft: 100 }} />
      </View>
    );
  }, (prevProps, nextProps) => {
    // Kiểm tra xem các props có thay đổi không
    return prevProps.item.name === nextProps.item.name && prevProps.item.dial_code === nextProps.item.dial_code;
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Điều chỉnh offset nếu cần thiết
    >
      <StatusBar />
      <View style={{ flex: 1 }}>

        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 48 }}>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 14 }}>
            <Icon name='search1' size={22} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 7, borderRadius: 5, backgroundColor: "transparent", height: 40, width: 300, justifyContent: "center", alignItems: "flex-start" }}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Text style={{ marginLeft: 20, fontSize: 15.5, color: "#CCCCCC" }}>Search</Text>
          </TouchableOpacity>


          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginRight: 18 }}
            onPress={() => navigation.navigate('MeNavigator', { screen: 'QRScreen' })}
          >
            <Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={require("../assets/qr-code.png")} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginRight: 10 }}
            onPress={() => { setModalVisible(true) }}
          >
            <Icon name='plus' size={28} color={'white'} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "space-between", backgroundColor: "#fff", height: 43 }}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignContent: "space-between" }}>
            <TouchableOpacity style={styles.buttonNav}>
              <Text style={{ fontSize: 15.5, color: colorTextInView, fontWeight: '500' }}>Focused</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonNav}>
              <Text style={{ fontSize: 15.5, color: colorTextInView, fontWeight: '500' }}> Other</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", marginRight: 15 }}>
            <Icon name='filter' size={24} color={'gray'}></Icon>
          </TouchableOpacity>
        </View>
        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.2, width: '100%' }} />
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <FlatList
            data={data}
            renderItem={({ item }) => <ChatElement item={item} />}
            keyExtractor={(item) => item.id} // Sử dụng trường code làm key
          />
        </View>
      </View>









































      {/* Modal Plus*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', backgroundColor: 'transparent', margin: 6 }}>
            <View style={{ backgroundColor: 'white', height: 285, width: 200, borderRadius: 2, elevation: 5 }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', backgroundColor: 'transparent', margin: 6 }}>
                <View style={{ backgroundColor: 'white', height: 285, width: 200, borderRadius: 2, elevation: 5 }}>
                  <TouchableOpacity
                    style={styles.buttonInModal}
                    onPress={() => {
                      navigation.navigate('AddFriendScreen', { typeScreen: "MessagesScreen" });
                      setModalVisible(false)
                    }
                    }
                  >
                    <Icon name='adduser' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>Add friend</Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={styles.buttonInModal}
                    style={styles.buttonInModal}
                    onPress={() => setModalVisible(false)}>
                    <Icon name='addusergroup' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Icon name='addusergroup' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>Create group</Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={styles.buttonInModal}
              <TouchableOpacity
                    style={styles.buttonInModal}
                    onPress={() => setModalVisible(false)}>
                    <Icon name='cloudo' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Icon name='cloudo' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>My Cloud</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonInModal}
                    style={styles.buttonInModal}
                    onPress={() => setModalVisible(false)}>
                    <Icon name='calendar' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Icon name='calendar' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>Zalo Calendar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonInModal}
                    style={styles.buttonInModal}
                    onPress={() => setModalVisible(false)}>
                    <Icon name='videocamera' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Icon name='videocamera' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>Create group call</Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={styles.buttonInModal}
                    style={styles.buttonInModal}
                    onPress={() => setModalVisible(false)}>
                    <Icon name='iconfontdesktop' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Icon name='iconfontdesktop' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                    <Text style={styles.textInModal}>Logged-in devices</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>


          {/* Modal Chat*/}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalChatVisible}
            onRequestClose={() => {
              setModalChatVisible(false);
            }}>
            <TouchableWithoutFeedback onPress={() => setModalChatVisible(false)}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', height: 420, width: 300, borderRadius: 2, elevation: 5 }}>
                  <View style={{ flexDirection: 'row', height: 70, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20 }}>Thiện Đạt</Text>
                    <TouchableOpacity style={{ borderWidth: 0.2, borderRadius: 50, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', margin: 10, marginRight: 20 }}>
                      <Image style={{ width: 13, height: 13, resizeMode: "contain" }} source={require("../assets/draw.png")} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.2, width: '100%' }} />

                  <TouchableOpacity style={styles.buttonInChatModal}>
                    <Text style={styles.textInModal}>Move to Other</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonInChatModal}>
                    <Text style={styles.textInModal}>Hide conversation</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonInChatModal}>
                    <Text style={styles.textInModal}>Manage blocking</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonInChatModal}>
                    <Text style={styles.textInModal}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonInChatModal}>
                    <Text style={styles.textInModal}>Mark as read</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonInChatModal}>
                    <Text style={styles.textInModal}>Enable Bubble Chat mode</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonInChatModal}>
                    <Text style={styles.textInModal}>Mute</Text>
                  </TouchableOpacity>


                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>


        </KeyboardAvoidingView>
        );
};


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

        export default MessagesScreen;