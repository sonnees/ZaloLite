import React from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const ModalPlus = () => {
  let navigation = useNavigation();
  const dataIcon = [
    { title: 'Add friend', name: 'adduser', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
    { title: 'Create group', name: 'addusergroup', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
    { title: 'My Cloud', name: 'cloudo', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
    { title: 'Zalo Calendar', name: 'calendar', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
    { title: 'Create group call', name: 'videocamera', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
    { title: 'Logged-in devices', name: 'iconfontdesktop', navigate: 'AddFriendScreen', typeScreen: "MessagesScreen" },
  ];

  const SetIcon = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          margin: 11.5,
          alignItems: 'center',
          marginTop: 13,
          marginLeft: 20
        }}
        onPress={() => navigation.navigate(item.navigate, { typeScreen: item.typeScreen })}>
        <Icon name={item.name} size={22} color={"gray"} style={{ marginRight: 5 }}></Icon>
        <Text style={{
          marginLeft: 10,
          fontSize: 16
        }}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', backgroundColor: 'transparent', margin: 6 }}>
      <View style={{ backgroundColor: 'white', height: 285, width: 200, borderRadius: 2, elevation: 5 }}>
        <FlatList
          data={dataIcon}
          renderItem={({ item }) => <SetIcon item={item} />}
          keyExtractor={(item) => item.name} // Use the 'name' field as the key
        />
      </View>
    </View>
  );
};

export default ModalPlus;
