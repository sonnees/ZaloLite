import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function SettingScreen() {
  let navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{flex: 0.5, backgroundColor: "#0000FF", paddingVertical: 10}}></View>
      <View style={{flex: 1.2, backgroundColor: "#1E90FF", flexDirection: "row",  alignItems:"center"}}>
        <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/back1.png")}
           onStartShouldSetResponder={() => navigation.navigate('TabNavigator',{ screen: 'Me' })}
        ></Image>
        <Text style={{fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color:"white"}}>Cài đặt</Text>
      </View>
      <View style={{flex: 15.75}}>
        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain", marginLeft: "-6%"}} source={require("../assets/shield.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Tài khoản và bảo mật</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>

        
        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain", marginLeft: "-6.9%"}} source={require("../assets/lock.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Quyền riêng tư</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain", marginRight:"-1%"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.05}}></View>

        
        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain", marginLeft: "-4%"}} source={require("../assets/pie.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Dung lượng và dữ liệu</Text>
            <Text style={{fontFamily: "Roboto", fontSize: 13, color: "#808080"}}>Quản lý dữ liệu Zalo của bạn</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain", marginRight:"1%"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>

        
        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/cloud.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Sao lưu và khôi phục</Text>
            <Text style={{fontFamily: "Roboto", fontSize: 13, color: "#808080"}}>Bảo vệ tin nhắn khi đổi máy hoặc cài lại Zalo</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain", marginRight:"4.5%"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.05}}></View>

        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain", marginLeft: "-6%"}} source={require("../assets/bell1.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Thông báo</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain", marginRight: "-2%"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>

        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain", marginLeft: "-6%"}} source={require("../assets/chat.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Tin nhắn</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain", marginRight: "-2%"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>

        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain", marginLeft: "-6%"}} source={require("../assets/telephone.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Cuộc gọi</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain", marginRight: "-2%"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>

        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image styl e={{width: "15%", height: "40%", resizeMode: "contain", marginLeft: "-6%"}} source={require("../assets/wall-clock.png")}></Image>
          <View style={{flex: 0.12}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15, }}>Nhật ký</Text>
          </View>
          <View style={{flex: 0.67}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain", marginRight: "-2%"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>

        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "50%", resizeMode: "contain", marginLeft: "-6%"}} source={require("../assets/book.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Danh bạ</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain", marginRight: "-2%"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>

        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Image style={{width: "15%", height: "40%", resizeMode: "contain", marginLeft: "-1.5%"}} source={require("../assets/paintbrush.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Giao diện và ngôn ngữ</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain", marginRight: "2%"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.05}}></View>

        <View style={{flex: 0.75, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center"}}
          onStartShouldSetResponder={() => navigation.navigate("TranferAccount")}
        >
          <Image style={{width: "15%", height: "40%", resizeMode: "contain", marginLeft: "-5%"}} source={require("../assets/transfer.png")}></Image>
          <View style={{flex: 0.01}}></View>
          <View style={{justifyContent: "center"}}
             onStartShouldSetResponder={() => navigation.navigate('MeNavigator', { screen: 'SwitchAccountScreen' })}
          >
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Chuyển tài khoản</Text>
          </View>
          <View style={{flex: 0.75}}></View>
          <Image style={{width: "10%", height: "25%", resizeMode: "contain", marginRight: "-0.4%"}} source={require("../assets/next.png")}></Image>
        </View>
        <View style={{flex: 0.02}}></View>

        <View style={{flex: 1.2, backgroundColor: "#FFFFFF"}}>
          <View style={{flex: 0.2}}></View>
          <TouchableOpacity style={{flex: 0.6, backgroundColor: "#CCCCCC", flexDirection: "row",  alignItems:"center", justifyContent: "center", borderRadius: 20, marginLeft: "5%", marginRight: "5%"}}
              onPress={() => navigation.navigate('OpionNavigator',{ screen: 'SlashScreen' })}
          >
            <Image style={{width: "15%", height: "40%", resizeMode: "contain"}} source={require("../assets/logout.png")}></Image>
            <Text style={{fontSize: 15, fontWeight: "bold", fontFamily: "Roboto"}}>Đăng xuất</Text>
          </TouchableOpacity>
        
      </View>
        
        
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