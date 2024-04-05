import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../config/config';
import firebase from 'firebase/compat/app';
import { useNavigation, useRoute } from '@react-navigation/native';

const OPTLoginScreen = () => {
    let navigation = useNavigation();
    let route = useRoute();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);

    // Lấy giá trị phoneNumber từ tham số của route
    const { phoneNumber: routePhoneNumber } = route.params;

    // Set giá trị phoneNumber từ route.params vào state khi màn hình được tạo
    useState(() => {
        // Loại bỏ số 0 ở đầu và thêm +84 vào trước
        const formattedPhoneNumber = routePhoneNumber.startsWith('0')
            ? '+84' + routePhoneNumber.slice(1)
            : routePhoneNumber;
        setPhoneNumber(formattedPhoneNumber);
    }, []);

    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
            .then(setVerificationId)
            .catch(console.error);
    }

    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                setCode('');
                navigation.navigate('LoginNavigator', { screen: 'CreatePasswordScreen', params: { phoneNumber: phoneNumber } });

            })
            .catch(error => {
                alert(error);
            });
        Alert.alert('Phone authentication successful 👍');
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
            />

            <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
                <Text style={styles.buttonText}>
                    Confirm verification
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default OPTLoginScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        fontSize: 24,
        borderBottomColor: '#fff',
        borderBottomWidth: 2,
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff'
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
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20
    }
});
