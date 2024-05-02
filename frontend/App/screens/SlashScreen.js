import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function SlashScreen() {
    let navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={{ flex: 6 }}>
                <Image source={require('../assets/login_image.jpg')} style={{ width: '100%', height: '100%' }} />
                <Text style={{
                    flex: 3, position: "absolute", justifyContent: "center",
                    alignItems: "center", fontFamily: "Roboto", fontSize: 50,
                    fontWeight: "bold", color: "#1E90FF", alignSelf: 'center', justifyContent: "center",
                    top: "40%",
                }}>Zalo Lite</Text>
            </View>
            <View style={{ flex: 3, backgroundColor: "#fff", justifyContent: "center", }}>
                <TouchableOpacity style={{ backgroundColor: "#1E90FF", height: "18%", justifyContent: "center", marginLeft: "21%", marginRight: "21%", alignItems: 'center', borderRadius: 50 }}
                    onPress={() => navigation.navigate("LoginScreen")}
                >
                    <Text style={{ fontSize: 20, fontFamily: "Roboto", fontWeight: "bold", color: "#fff" }}>Đăng nhập</Text>
                </TouchableOpacity>

                <View style={{ flex: 0.1 }}></View>

                <TouchableOpacity style={{ backgroundColor: "#C0C0C0", height: "18%", justifyContent: "center", marginLeft: "21%", marginRight: "21%", alignItems: 'center', borderRadius: 50 }}
                    onPress={() => navigation.navigate("AddInforScreen")}
                >
                    <Text style={{ fontSize: 20, fontFamily: "Roboto", fontWeight: "bold" }}>Đăng ký</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                <Text style={{ fontFamily: "Roboto", fontSize: 16, fontWeight: "bold" }}
                >Tiếng Việt</Text>
                <View style={{ flex: 0.1 }}></View>
                <Text style={{ fontFamily: "Roboto", fontSize: 16, fontWeight: "bold" }}
                >English</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})