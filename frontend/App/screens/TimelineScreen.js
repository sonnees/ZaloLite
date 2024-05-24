import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';

export default function Diary() {
  let navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View>
        <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 48 }}>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 14 }}>
            <Icon name='search1' size={22} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 7, borderRadius: 5, backgroundColor: "transparent", height: 40, width: 300, justifyContent: "center", alignItems: "flex-start" }}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Text style={{ marginLeft: 20, fontSize: 15.5, color: "#CCCCCC" }}>Tìm kiếm</Text>
          </TouchableOpacity>


          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginRight: 18 }}
            onPress={() => navigation.navigate('MeNavigator', { screen: 'QRScreen' })}
          >
            <Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={require("../assets/image.png")} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginRight: 10 }}

          >
            <Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={require("../assets/bell.png")} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 2, backgroundColor: "#FFFFFF", justifyContent: "center" }}>
        <View style={{ flex: 0.75, flexDirection: "row", alignItems: "center" }} >
          <View style={{ flex: 0.1 }}></View>
          <View style={{ flex: 0.1 }}></View>
          <Text style={{ fontFamily: "Roboto", fontSize: 18, color: "#808080" }}>Hôm nay bạn như thế nào?</Text>
        </View>
      </View>
      <View style={{ flex: 0.3 }}></View>
      <View style={{ flex: 3, backgroundColor: "#FFFFFF" }}></View>
      <View style={{ flex: 0.3 }}></View>

      <View style={{ flex: 7.95, backgroundColor: "#FFFFFF" }}></View>


      <View style={{ flex: 0.3 }}></View>
      <View style={{ flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row" }}>
        <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center" }}
          onPress={() => navigation.navigate("Person")}
        >
        </TouchableOpacity>



      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D7D7D7",
  },
})