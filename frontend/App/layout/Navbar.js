import React,{ useState } from 'react';
import { View, Modal, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Image, ScrollView,Text,StatusBar,TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'

function Navbar({ type }) { 
    let navigation = useNavigation();
    function Checktype() { 
        if (type === "MessagesScreen") {
            return (
                <View style={{ flexDirection: 'row', width: 80 }}>
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
            )
        }
        else if (type === "ContactsScreen") {
            return (
                <View style={{ flexDirection: 'row', width: 80 }}>
                    <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", marginRight: 12 }}
                        onPress={() => { setModalVisible(true) }}
                    >
                        <Icon name='adduser' size={23} color={'white'} />
                    </TouchableOpacity>
                </View>
            )
        }
        else if (type === "TimelineScreen") { 
            return (
                    <View style={{flexDirection:'row',width:80}}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",marginRight:18}}
                            onPress={() => navigation.navigate('MeNavigator', { screen: 'QRScreen' })}
                        >
                            <Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={require("../assets/image.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", marginRight: 10 }}
                        onPress={() => { setModalVisible(true)}}
                        >
                            <Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={require("../assets/bell.png")} />
                        </TouchableOpacity>
                    </View>
            )
        }else if (type === "MeScreen") {
            return (
                <View style={{ flexDirection: 'row', width: 80 }}>
                    <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", marginRight: 12 }}
                        onPress={() => { setModalVisible(true) }}
                    >
                        <Icon name='setting' size={23} color={'white'} />
                    </TouchableOpacity>
                </View>
            )
        }
    }
    return (
        <View>
          <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center",height:48 }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center",marginLeft:14 }}>
              <Icon name='search1' size={22} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 7, borderRadius: 5, backgroundColor: "transparent", height: 40, width:300,justifyContent: "center", alignItems: "flex-start"}}
              onPress={() => navigation.navigate("SearchScreen")}
            >
                <Text style={{marginLeft:20,fontSize:15.5,color:"#CCCCCC"}}>Search</Text>
            </TouchableOpacity>
            
           {Checktype()}
          </View>
      </View>
    )
}
export default Navbar;
