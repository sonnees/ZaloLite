import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView,TouchableOpacity  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
export default function OptionGroupScreen() {
  let navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            style={{ width: "15%", height: "40%", resizeMode: "contain" }}
            source={require("../assets/back1.png")}
            onStartShouldSetResponder={() => navigation.goBack()}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "white" }}>
            Tùy chọn
          </Text>
        </View>
        <ScrollView>
        <View style={{flex:5.7, justifyContent: "center", alignItems: 'center', backgroundColor: "#FFFFFF"}}>
          <View style={{marginTop: "5%"}}></View>
          <Image style={{width: 80, height: 80,borderRadius: 50, resizeMode: "contain"}} source={require("../assets/avata.jpg")}></Image>
          <View style={{marginTop: "3%"}}></View>
          <Text style={{fontSize: 20, fontWeight: "bold",  marginTop: 10}}>Lê Hữu Bằng</Text>
          <View style={{marginTop: "10%"}}></View>
        </View>
        <View style={{flex: 4.5, flexDirection: "row",justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF"}}>
          <View style={{paddingLeft: "3%"}}></View>
          <View style={{flexDirection: "column", marginBottom: "7%"}}>
            <TouchableOpacity style={{justifyContent: "center", alignItems: "center", backgroundColor: "#D3D3D3", borderRadius: 70, height: 45}}>
              <Image style={{width: "50%", height: "40%", resizeMode: "cover"}} source={require("../assets/search_back.png")}></Image>
            </TouchableOpacity>
            <View style={{marginTop: "20%"}}></View>
            <Text style={{fontSize: 12, fontFamily: "Roboto",  color: "#4F4F4F", textAlign: "center"}}>Tìm</Text>
            <Text style={{fontSize: 12, fontFamily: "Roboto", color: "#4F4F4F", textAlign: "center"}}>tin nhắn</Text>
          </View>

          <View style={{flexDirection: "column", marginBottom: "7%"}}>
            <TouchableOpacity style={{justifyContent: "center", alignItems: "center", backgroundColor: "#D3D3D3", borderRadius: 70, height: 45}}>
              <Image style={{width: "30%", height: "50%", resizeMode: "cover"}} source={require("../assets/add-group.png")}></Image>
            </TouchableOpacity>
            <View style={{marginTop: "20%"}}></View>
            <Text style={{fontSize: 12, fontFamily: "Roboto",  color: "#4F4F4F", textAlign: "center"}}>Thêm</Text>
            <Text style={{fontSize: 12, fontFamily: "Roboto", color: "#4F4F4F", textAlign: "center"}}>thàn viên</Text>
          </View>

          <View style={{flexDirection: "column",marginBottom: "7%"}}>
            <TouchableOpacity style={{justifyContent: "center", alignItems: "center", backgroundColor: "#D3D3D3", borderRadius: 70, height: 45}}>
              <Image style={{width: "50%", height: "40%", resizeMode: "cover"}} source={require("../assets/paintbrush.png")}></Image>
            </TouchableOpacity>
            <View style={{marginTop: "20%"}}></View>
            <Text style={{fontSize: 12, fontFamily: "Roboto",  color: "#4F4F4F", textAlign: "center"}}>Đổi</Text>
            <Text style={{fontSize: 12, fontFamily: "Roboto", color: "#4F4F4F", textAlign: "center"}}>hình nền</Text>
          </View>
          <View style={{flexDirection: "column", marginBottom: "7%"}}>
            <TouchableOpacity style={{justifyContent: "center", alignItems: "center", backgroundColor: "#D3D3D3", borderRadius: 50, height: 45}}>
              <Image style={{width: "30%", height: "45%", resizeMode: "cover"}} source={require("../assets/bell_black.png")}></Image>
            </TouchableOpacity>
            <View style={{marginTop: "20%"}}></View>
            <Text style={{fontSize: 12, fontFamily: "Roboto",  color: "#4F4F4F", textAlign: "center"}}>Tắt</Text>
            <Text style={{fontSize: 12, fontFamily: "Roboto", color: "#4F4F4F", textAlign: "center"}}>thôn báo</Text>
          </View>
          <View style={{paddingLeft: "3%"}}></View>
        </View>
        <View style={{flex: 11.25}}> 
        <View style={{marginTop: "2%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 80}}>
          <View style={{paddingLeft: "3%"}}></View>
          <Image style={{width: "8%", height: "100%", resizeMode: "contain"}} source={require("../assets/dange.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15, color: "#7E7E7E" }}>Thêm mô tả nhóm</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "2%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/image_gay.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Ảnh, file, link đã gửi</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "2%"}}></View>
        <View style={{flex: 3,  flexDirection: "row", justifyContent: "center", alignItems: "center", height: 100, marginLeft: "20%"}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "10%", height: "50%", resizeMode: "contain"}} source={require("../assets/round.png")}></Image>
          <View style={{justifyContent: "center", marginLeft: "5%"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Hình ảnh mới của cuộc trò chuyện sẽ xuất hiện tại đây</Text>
          </View>
          <View style={{marginRight: "20%"}}></View>
          <View style={{flex: 1}}></View>
        </View>



        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/calendar.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Lịch nhóm</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "2%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/push-pin.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Tin nhắn đã ghim</Text>
          </View>
          <View style={{flex: 1}}></View> 
        </View>

        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/column-chart.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Bình chọn</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>
        <View style={{marginTop: "2%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/setting.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Cài đặt nhóm</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "2%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/team.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Xem thành viên nhóm</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/membership.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Duyệt thành viên</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/link.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Link tham gia nhóm</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "2%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/push-pin.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Ghim trò chuyện</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/hide_group.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Ẩn trò chuyện</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 2, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/stopwatch.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Tin nhắn tự xóa</Text>
            <Text style={{fontFamily: "Roboto", fontSize: 12, color: "#878383" }}>Không tự xóa</Text>
            
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/person.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Cài đặt cá nhân</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>


        <View style={{marginTop: "2%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/danger.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Báo xấu</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/access-denied.png")}></Image>
          <View style={{flex: 0.4}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Quản lý chặn</Text>
          </View>
          <View style={{flex: 5.5}}></View>
          <View style={{flex: 1}}>
            <Image style={{width: "30%", height: "90%", resizeMode: "contain"}} source={require("../assets/next.png")}></Image>
          </View>
        </View>

        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/pie-cart.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15 }}>Dung lượng trò chuyện</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/trash-bin.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15, color: "#FF0000" }}>Xóa lịch sử trò chuyện</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View style={{marginTop: "0.5%"}}></View>
        <View style={{flex: 1.5, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60}}>
          <View style={{paddingLeft: "4%"}}></View>
          <Image style={{width: "6%", height: "90%", resizeMode: "contain"}} source={require("../assets/logout_group.png")}></Image>
          <View style={{flex: 0.05}}></View>
          <View style={{justifyContent: "center"}}>
            <Text style={{fontFamily: "Roboto", fontSize: 15, color: "#FF0000" }}>Rời nhóm</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

  
        </View>
        

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
  },
  header: {
    height: 50,
    backgroundColor: "#1E90FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
