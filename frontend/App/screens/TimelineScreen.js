import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity,StatusBar } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import Navbar from '../layout/Navbar';

export default function Diary() {
  let navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <Navbar type={'TimelineScreen'}></Navbar>
      
      <View style={{flex: 2, backgroundColor: "#FFFFFF", justifyContent: "center"}}>
        <View style={{flex: 0.75, flexDirection: "row", alignItems: "center"}} > 
          <View style={{flex: 0.1}}></View>
          <View style={{flex: 0.1}}></View>
            <Text style={{fontFamily: "Roboto", fontSize: 18, color: "#808080"}}>Hôm nay bạn như thế nào?</Text>
        </View>
      </View>
      <View style={{flex: 0.3}}></View>
      <View style={{flex: 3, backgroundColor: "#FFFFFF"}}></View>
      <View style={{flex: 0.3}}></View>

      <View style={{flex: 7.95, backgroundColor: "#FFFFFF"}}></View>
      
     
      <View style={{flex: 0.3}}></View>
      <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row"}}>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, borderRadius: 20, justifyContent: "center", alignItems: "center"}}
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