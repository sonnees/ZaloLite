import React, { useState } from 'react';
import { View, Modal, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView, Text, StatusBar, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'

const MessagesScreen = () => {
  let navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [colorTextInView, setColorTextInView] = useState("gray");

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
          {/* Your remaining content */}
        </View>
      </View>

      {/* Modal */}
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
              <TouchableOpacity
                style={styles.buttonInModal}
                onPress={() => navigation.navigate('AddFriendScreen', { typeScreen: "MessagesScreen" })}>
                <Icon name='adduser' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                <Text style={styles.textInModal}>Add friend</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.buttonInModal}
                onPress={() => setModalVisible(false)}>
                <Icon name='addusergroup' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                <Text style={styles.textInModal}>Create group</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.buttonInModal}
                onPress={() => setModalVisible(false)}>
                <Icon name='cloudo' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                <Text style={styles.textInModal}>My Cloud</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonInModal}
                onPress={() => setModalVisible(false)}>
                <Icon name='calendar' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                <Text style={styles.textInModal}>Zalo Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonInModal}
                onPress={() => setModalVisible(false)}>
                <Icon name='videocamera' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                <Text style={styles.textInModal}>Create group call</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.buttonInModal}
                onPress={() => setModalVisible(false)}>
                <Icon name='iconfontdesktop' size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
                <Text style={styles.textInModal}>Logged-in devices</Text>
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
  }
});

export default MessagesScreen;
