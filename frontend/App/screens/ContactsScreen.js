import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView, Text, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native'
const ContactsScreen = () => {
  const navigation = useNavigation();
  const [friendViews, setFriendViews] = useState(true)
  const [groupsViews, setGroupsViews] = useState(false)
  const [OAViews, setOAViews] = useState(false)
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
            <Text style={{ marginLeft: 20, fontSize: 15.5, color: "#CCCCCC" }}>Tìm kiếm</Text>
          </TouchableOpacity>


          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", marginRight: 12 }}
            onPress={() => { navigation.navigate("AddFriendScreen", { typeScreen: 'ContactsScreen' }) }}
          >
            <Icon name='adduser' size={23} color={'white'} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "space-between", paddingVertical: 12, backgroundColor: "#fff", height: 45 }}>
          <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setFriendViews(true)
              setGroupsViews(false)
              setOAViews(false)
            }}
          >
            <Text style={{ fontSize: 16 }}> Bạn bè</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setFriendViews(false)
              setGroupsViews(true)
              setOAViews(false)
            }}
          >
            <Text style={{ fontSize: 16 }}> Nhóm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setFriendViews(false)
              setGroupsViews(false)
              setOAViews(true)
            }}
          >
            <Text style={{ fontSize: 16 }}> OA</Text>
          </TouchableOpacity>
        </View>
        <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 1, width: '100%' }} />
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {friendViews && (
            <View>
              <View style={{ height: 160 }}>
                <TouchableOpacity
                  style={{ height: 40, flexDirection: 'row', marginTop: 10 }}
                  onPress={() => navigation.navigate('FriendRequestScreen')}
                >
                  <View style={{
                    backgroundColor: '#4876FF', height: 35, width: 35, borderRadius: 12,
                    marginLeft: 20, justifyContent: 'center', alignItems: 'center'
                  }}>
                    <FontAwesome name='user-plus' size={18} color={'white'}></FontAwesome>
                  </View>
                  <Text
                    style={{
                      marginLeft: 20, color: 'black', alignSelf: 'center',
                      fontWeight: '500', fontSize: 15, marginBottom: 8
                    }}> Lời mời kết bạn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ height: 40, flexDirection: 'row', marginTop: 10 }}
                >
                  <View style={{
                    backgroundColor: '#4876FF', height: 35, width: 35, borderRadius: 12,
                    marginLeft: 20, justifyContent: 'center', alignItems: 'center'
                  }}>
                    <FontAwesome name='address-book' size={20} color={'white'}></FontAwesome>
                  </View>
                  <Text
                    style={{
                      marginLeft: 20, color: 'black', alignSelf: 'center',
                      fontWeight: '500', fontSize: 15, marginBottom: 8
                    }}> Danh bạ máy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ height: 40, flexDirection: 'row', marginTop: 10 }}
                >
                  <View style={{
                    backgroundColor: '#4876FF', height: 35, width: 35, borderRadius: 12,
                    marginLeft: 20, justifyContent: 'center', alignItems: 'center'
                  }}>
                    <FontAwesome name='birthday-cake' size={20} color={'white'}></FontAwesome>
                  </View>
                  <Text
                    style={{
                      marginLeft: 20, color: 'black', alignSelf: 'center',
                      fontWeight: '500', fontSize: 15, marginBottom: 8
                    }}> Lịch sinh nhật</Text>
                </TouchableOpacity>

              </View>
              <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 8, width: '100%' }} />
              <View></View>
            </View>
          )}
          {groupsViews && (
            <View>
              <View style={{ height: 80 }}>
                <TouchableOpacity
                  style={{ height: 40, flexDirection: 'row', marginTop: 10 }}
                >
                  <View style={{
                    backgroundColor: '#63B8FF', height: 50, width: 50, borderRadius: 50,
                    marginLeft: 20, justifyContent: 'center', alignItems: 'center'
                  }}>
                    <FontAwesome name='users' size={20} color={'white'}></FontAwesome>
                  </View>
                  <Text
                    style={{
                      marginLeft: 20, color: 'black', alignSelf: 'center',
                      fontWeight: '400', fontSize: 15, marginTop: 5
                    }}> Tạo nhóm mới</Text>
                </TouchableOpacity>
              </View>
              <View style={{ borderBottomColor: '#EEEEEE', borderBottomWidth: 8, width: '100%' }} />
              <View></View>
            </View>
          )}
          {OAViews && (
            <View>

            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ContactsScreen;