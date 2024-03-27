import React, { memo,useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, Text, ScrollView, StatusBar, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native';
import countries from '../data/countries';

const sortedCountries = [
  { name: "Vietnam", flag: "🇻🇳", code: "VN", dial_code: "+84" },
  { name: "China", flag: "🇨🇳", code: "CN", dial_code: "+86" },
  { name: "South Korean", flag: "🇰🇷", code: "KR", dial_code: "+82" },
  { name: "Myanmar", flag: "🇲🇲", code: "MM", dial_code: "+95" },
  ...countries.filter(country => !["Vietnam", "China", "South Korean", "Myanmar"].includes(country.name))
];



const ListCountryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [phoneCountry, setPhoneCountry] = useState(route.params?.phoneCountry || "");
  const CountryItem = memo(({ item }) => {
  return (
     <View>
      <TouchableOpacity style={{ flex: 1, height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        onPress={ ()=>{
            setPhoneCountry(item.dial_code);
            console.log(phoneCountry);
            navigation.navigate("AddFriendScreen", { phoneCountry: item.dial_code });
        }}
          
      >
        <Text style={{ marginLeft: 40, fontSize: 15 }}>
          {item.name}
        </Text>
        <Text style={{ marginRight: 20, fontSize: 15 }}>
          {item.dial_code}
        </Text>
      </TouchableOpacity>
      <View style={{borderBottomColor: '#EEEEEE',borderBottomWidth: 1,width: '100%'}} />
    </View>
  );
}, (prevProps, nextProps) => {
  // Kiểm tra xem các props có thay đổi không
  return prevProps.item.name === nextProps.item.name && prevProps.item.dial_code === nextProps.item.dial_code;
});
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Điều chỉnh offset nếu cần thiết
    >
      <StatusBar />
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: "#1E90FF", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 8,height:50}}>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingLeft: '2%', paddingRight: '4%' }}
              onPress={() => navigation.navigate("AddFriendScreen",{ phoneCountry: item.dial_code })}
            >
              <Icon name='arrowleft' size={22} color={'white'} />
            </TouchableOpacity>
            <View style={{ flex: 7, flexDirection: 'column', borderRadius: 8, height: 32, paddingHorizontal: 5 }}>
              <TextInput style={{ flex: 1, fontSize: 17, color: 'white' }} placeholder="Search" placeholderTextColor="white" />
              <View style={{ borderBottomColor: '#CCCCCC', borderBottomWidth: 0.2, width: '100%' }} />
            </View>
          </View>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <FlatList
              data={sortedCountries}
              renderItem={({ item }) => <CountryItem item={item} />}
              keyExtractor={(item) => item.code} // Sử dụng trường code làm key
            />
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

export default ListCountryScreen;
