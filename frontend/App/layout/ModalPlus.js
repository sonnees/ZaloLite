import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'

const ModalPlus = () => {
  let navigation = useNavigation();
  const dataIcon = [
    { name: 'adduser', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
    { name: 'addusergroup', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
    { name: 'cloudo', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
    { name: 'calendar', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
    { name: 'videocamera', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
    { name: 'iconfontdesktop', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
  ]
  const setIcon = ({ data }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          margin: 11.5,
          alignItems: 'center',
          marginTop: 13,
          marginLeft: 20
        }}
        onPress={() => navigation.navigate(data.navigate, { typeScreen: data.typeScreen })}>
        <Icon name={data.name} size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
        <Text style={styles.textInModal}>Add friend</Text>
      </TouchableOpacity>
    )
  }
  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', backgroundColor: 'transparent', margin: 6 }}>
      <View style={{ backgroundColor: 'white', height: 285, width: 200, borderRadius: 2, elevation: 5 }}>

        <FlatList
          data={dataIcon}
          renderItem={({ item }) => <setIcon item={item} />}
          keyExtractor={(item) => item.name} // Sử dụng trường code làm key
        />
      </View>
    </View>
  );
};
export default ModalPlus;
