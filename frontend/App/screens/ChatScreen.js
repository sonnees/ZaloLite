import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView,TouchableOpacity,StatusBar  } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import React from 'react'
// import { useNavigation } from '@react-navigation/native'

export default function ChatScreen({ navigation }) {
  // let navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.header}>
          <Image
            style={{ width: "15%", height: "40%", resizeMode: "contain" }}
            source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.navigate('TabNavigator',{ screen: 'Me' })}
          />
          <View style={{flexDirection: "column"}}>
            <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>Trần Thiện Đạt </Text>
            <Text style={{ fontSize: 12,  fontFamily: "Roboto", color: "white" }}>Truy cập 5 giờ trước</Text>
          </View>

          <View style={{flex: 3}}></View>
         
            <Image
              style={{ width: "17%", height: "40%", resizeMode: "contain" , marginRight: "-5%"}}
              source={require("../assets/phone.png")}
            />
            <Image
              style={{ width: "17%", height: "45%", resizeMode: "contain" , marginRight: "-5%"}}
              source={require("../assets/video.png")}
            />
        <Image
          style={{ width: "17%", height: "60%", resizeMode: "contain", marginRight: "-5%" }}
          source={require("../assets/list.png")}
          onStartShouldSetResponder={() => navigation.navigate( "OpionNavigator", { screen:"OptionScreen"})}
            />     
        </View>
      <View style={{ flex: 9 }}>
        
        
        </View>
        <View style={styles.foter}>
          <Image
              style={{ width: "15%", height: "45%", resizeMode: "contain"}}
              source={require("../assets/face.png")}
          />
          <TextInput style={{flex: 7, borderRadius: 5,fontSize:18, backgroundColor: "#FFFFFF", paddingLeft: "1%", paddingRight: "7%", color: "#808080", justifyContent: "center"}} placeholder="Tin nhắn"></TextInput>    
          <Image
              style={{ width: "15%", height: "45%", resizeMode: "contain", marginRight: "-2%"}}
              source={require("../assets/morechat.png")}
          />
           <Image
              style={{ width: "15%", height: "45%", resizeMode: "contain", marginRight: "-2%"}}
              source={require("../assets/microphone.png")}
          /> 
           <Image
              style={{ width: "15%", height: "45%", resizeMode: "contain", marginRight: "-2%"}}
              source={require("../assets/imagechat.png")}
          /> 
        </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#abcdff',
  },
  header: {
    height: 50,
    backgroundColor: "#1E90FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  foter: {
    height: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});

