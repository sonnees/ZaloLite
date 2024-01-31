import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function AccountTranfer() {
    let navigation = useNavigation();
  return (
    <View style={styles.container}>
        <View style={{flex: 1, backgroundColor: "#1E90FF", flexDirection: "row"}}>
            <Image style={{width: "20%", height: "100%", resizeMode: "center", marginLeft: "-2%"}} source={require("../assets/back.png")}
                onStartShouldSetResponder={() => navigation.navigate("Person")}
            ></Image>
            <Text style={{flex: -1, textAlign: "center", fontFamily: "Roboto", fontSize: 15 , fontWeight: "bold", color: "#fff", alignSelf: "center"}}>Chuyển tài khoản</Text>
        </View>
        <View style={{flex: 0.8, backgroundColor: "#F5F5F5", justifyContent: "center",}}>
            <Text style={{textAlign: "center", fontFamily: "Roboto", fontSize: 15, fontWeight: "bold"}}>Thêm tài khoản để đăng nhập nhanh.</Text>
        </View>
        <View style={{flex: 3, backgroundColor: "#fff"}}>
            <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center"}}>
                <View style={{flex: 0.75, flexDirection: "row"}} > 
                    <View style={{flex: 0.1}}></View>
                    <Image style={{width: 50, height: 50,borderRadius: 50, resizeMode: "contain"}} source={require("../assets/avata.jpg")}></Image>
                    <View style={{flex: 0.2}}></View>
                    <View style={{justifyContent: "center"}}>
                        <Text style={{fontFamily: "Roboto", fontSize: 18, fontWeight: "bold" }}>Lê Hữu Bằng</Text>
                    </View>
                </View>
                <Text style={{flex: 0.3, textAlign: "center", fontFamily: "Roboto", fontSize: 15, color: "#808080"}}>Đã đăng nhập</Text>
                <View style={{flex: 0.1}}></View>
            </View>
            <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center"}}>
                <View style={{flex: 0.75, flexDirection: "row"}} > 
                    <View style={{flex: 0.15}}></View>
                    <Image style={{width: 50, height: 60,borderRadius: 50, resizeMode: "contain"}} source={require("../assets/plus.png")}></Image>
                    <View style={{flex: 0.2}}></View>
                    <View style={{justifyContent: "center"}}>
                        <Text style={{fontFamily: "Roboto", fontSize: 18, fontWeight: "bold" }}>Thêm tài khoản</Text>
                    </View>
                </View>
                <View style={{flex: 0.4}}></View>
            </View>


        </View>
        <View style={{flex: 8.5, backgroundColor: "#F5F5F5"}}></View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
})