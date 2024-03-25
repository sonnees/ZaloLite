import React from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
const AddFriendScreen = () => {
  let navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Điều chỉnh offset nếu cần thiết
    >
      <StatusBar  />
        <View style={{ flex: 1, height:60}}>
          <View style={{ flexDirection: "row", paddingVertical: 8,height:50}}>
            <TouchableOpacity style={{paddingLeft: '2%',paddingRight:'4%' }}
              onPress={() => navigation.navigate("TabNavigator")}
            >
              <Icon name='arrowleft' size={22} color={'black'} />
            </TouchableOpacity>
            <Text style={{fontSize:15}}>Add friends</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Your remaining content */}
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

export default AddFriendScreen;
