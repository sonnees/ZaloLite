import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../config/config';
import firebase from 'firebase/compat/app';
import { useNavigation, useRoute } from '@react-navigation/native';

const OtpScreen = () => {
    let navigation = useNavigation();
    let route = useRoute();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);

    // Lấy giá trị phoneNumber từ tham số của route
    const { params } = route;
    const routePhoneNumber = params ? params.phoneNumber : ''; // Lấy phoneNumber từ params, nếu không tồn tại thì gán là chuỗi rỗng

    // Set giá trị phoneNumber từ route.params vào state khi màn hình được tạo
    useEffect(() => {
        // Loại bỏ số 0 ở đầu và thêm +84 vào trước
        const formattedPhoneNumber = routePhoneNumber.startsWith('0')
            ? '+84' + routePhoneNumber.slice(1)
            : routePhoneNumber;
        setPhoneNumber(formattedPhoneNumber);
    }, [routePhoneNumber]);

    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
            .then(setVerificationId)
            .catch(console.error);
    }

    const confirmCode = () => {
        if (code.trim() === '') {
            Alert.alert('Lỗi', 'Mã OTP không được để trống.');
            return;
        }
        if (code.length !== 6) {
            Alert.alert('Lỗi', 'Mã OTP phải đúng 6 kí tự.');
            return;
        }

        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                setCode('');
                navigation.navigate('LoginNavigator', { screen: 'LoginScreen' });
                Alert.alert('Xác thực thành công', 'Đăng nhập thành công.');
            })
            .catch(error => {
                Alert.alert('Lỗi', 'Mã OTP không chính xác.');
            });
    }

    return (
        <View style={styles.container}>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
            />
            <Text style={styles.optText}>
                Login using OTP
            </Text>

            {/* Hiển thị số điện thoại từ route.params */}
            <TextInput
                style={styles.textInput}
                placeholder="Phone Number with country code"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType='phone-pad'
                editable={false} // Không cho phép chỉnh sửa số điện thoại
                placeholderTextColor="#1E90FF"
            />

            <TouchableOpacity style={styles.sendVerification} onPress={sendVerification}>
                <Text style={styles.buttonText}>
                    Send Verification
                </Text>
            </TouchableOpacity>
            <TextInput
                style={styles.textInput}
                placeholder="Confirmation Code"
                onChangeText={setCode}
                keyboardType='phone-pad'
                value={code}
                placeholderTextColor="#1E90FF"
            />

            <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
                <Text style={styles.buttonText}>
                    Confirm verification
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default OtpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        fontSize: 24,
        borderBottomColor: '#1E90FF',
        borderBottomWidth: 2,
        marginBottom: 20,
        textAlign: 'center',
        color: '#000'
    },
    sendVerification: {
        backgroundColor: '#3498db',
        padding: 20,
        borderRadius: 10,
    },
    sendCode: {
        backgroundColor: '#9b59b6',
        padding: 20,
        borderRadius: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    optText: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20
    }
});
