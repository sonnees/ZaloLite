import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet } from 'react-native';
// import CountryPicker from 'react-native-country-picker-modal';

const PhoneNumberInput = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('VN'); // Thay đổi đuôi quốc gia mặc định thành "VN"

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {/* <CountryPicker
          countryCode={countryCode}
          withFlagButton={true}
          withFilter={true}
          withFlag={true}
          withCountryNameButton={false} // Không hiển thị tên quốc gia
          withCallingCodeButton={false} // Không hiển thị calling code
          withAlphaFilter={true}
          onSelect={(country) => setCountryCode(country.cca2)}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1, // Chỉ áp dụng gạch chân dưới
    borderBottomColor: '#1E90FF', // Màu của gạch chân
    paddingHorizontal: 10,
    flex: 1,
    top: '7.3%',
  },
});

export default PhoneNumberInput;
