import React from 'react';
import { View, TextInput, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
const SearchScreen = () => {
  let navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Điều chỉnh offset nếu cần thiết
    >
      <StatusBar  />
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 8,height:50}}>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingLeft: '2%',paddingRight:'4%' }}
              onPress={() => navigation.navigate("TabNavigator")}
            >
              <Icon name='arrowleft' size={22} color={'white'} />
            </TouchableOpacity>
            <View style={{ flex: 7, flexDirection:'row',borderRadius: 8, backgroundColor: "#fff", height: 32, paddingHorizontal: 5,alignItems:'center'}}>
                <Icon name='search1' size={25} color={'gray'} style={{paddingLeft:5,justifyContent:'center'}} />
                <TextInput style={{ flex: 1,paddingLeft:10 }} placeholder="Tìm kiếm" />
            </View>
            
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingRight:'4%',paddingLeft:'5%'}}
                onPress={() => navigation.navigate('MeNavigator', { screen: 'QRScreen' })}
            >
              <Image style={{ width: 30, height: 30, resizeMode: "contain" }} source={require("../assets/qr-code.png")} />
            </TouchableOpacity>
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

export default SearchScreen;
