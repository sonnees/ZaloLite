import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Text,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const RegisterDEScreen = () => {
  const [isMaleChecked, setIsMaleChecked] = useState(false);
  const [isFemaleChecked, setIsFemaleChecked] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [gender, setGender] = useState(null);
  const [birthDate, setBirthDate] = useState(null);

  let navigation = useNavigation();
  let route = useRoute();
    // Nhận giá trị userName từ tham số được truyền qua
    const { userName, phoneNumber } = route.params;

  const handleMaleCheckbox = () => {
    setIsMaleChecked(true);
    setIsFemaleChecked(false);
    setGender("Nam");
  };

  const handleFemaleCheckbox = () => {
    setIsFemaleChecked(true);
    setIsMaleChecked(false);
    setGender("Nữ");
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    setSelectedDate(date);
    setBirthDate(date.toLocaleDateString());
  };

  const handleNextScreen = () => {
    if (!gender || !birthDate) {
      // Kiểm tra giới tính và ngày sinh có được chọn hay không
      alert("Vui lòng chọn giới tính và ngày sinh trước khi tiếp tục.");
      return;
    }

    // Chuyển qua màn hình tiếp theo
    navigation.navigate("RegisterProfileScreen",{
      userName: userName,
      phoneNumber: phoneNumber,
      gender: gender,
      birthDate: birthDate,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // Điều chỉnh offset nếu cần thiết
    >
      <StatusBar />
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#1E90FF",
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 6,
            height: 50,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "white",
              marginLeft: "6%",
            }}
          >
            Ngày sinh và giới tính
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            backgroundColor: "#DDDDDD",
            height: 45,
          }}
        >
          <Text style={{ fontSize: 14, marginLeft: "6%" }}>
            Hãy chọn ngày sinh và giới tính của bạn
          </Text>
        </View>
        <View
          style={{
            borderBottomColor: "gray",
            borderBottomWidth: 1,
            width: "100%",
          }}
        />
        <View style={{ flex: 3, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 14, marginLeft: "6%", marginTop: "6%" }}>
            Giới tính
          </Text>
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
              top: "7%",
            }}
          >
            <TouchableOpacity
              onPress={handleMaleCheckbox}
              style={{ flex: 1, alignItems: "center" }}
            >
              <Image
                style={{ width: "60%", height: "40%", resizeMode: "contain" }}
                source={require("../assets/boy.png")}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 5,
                  color: isMaleChecked ? "green" : "black",
                }}
              >
                Nam
              </Text>
              {isMaleChecked && (
                <Icon
                  name="checkcircle"
                  size={24}
                  color="green"
                  style={{ position: "absolute", bottom: 10, right: 5 }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFemaleCheckbox}
              style={{ flex: 1, alignItems: "center" }}
            >
              <Image
                style={{ width: "60%", height: "40%", resizeMode: "contain" }}
                source={require("../assets/girl.png")}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 5,
                  color: isFemaleChecked ? "green" : "black",
                }}
              >
                Nữ
              </Text>
              {isFemaleChecked && (
                <Icon
                  name="checkcircle"
                  size={24}
                  color="green"
                  style={{ position: "absolute", bottom: 10, right: 5 }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: "gray",
            borderBottomWidth: 2,
            width: "100%",
          }}
        />
        <View style={{ flex: 2 }}>
          <Text style={{ fontSize: 14, marginLeft: "6%", marginTop: "6%" }}>
            Ngày sinh
          </Text>
          <TouchableOpacity
            onPress={showDatePicker}
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              top: "7%",
            }}
          >
            <Text
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#1E90FF",
                fontSize: 16,
                fontFamily: "Roboto",
                padding: 10,
              }}
            >
              {selectedDate
                ? selectedDate.toLocaleDateString()
                : "Chọn ngày sinh"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
        <View style={{ flex: 3 }}></View>
        <View style={{ flex: 2, justifyContent: "center", paddingLeft: "70%" }}>
          <TouchableOpacity
            style={{
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleNextScreen}
          >
            <Image
              style={{ width: 80, height: 50, resizeMode: "contain" }}
              source={require("../assets/right-arrow.png")}
            />
          </TouchableOpacity>
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

export default RegisterDEScreen;
