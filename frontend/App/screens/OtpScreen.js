import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { firebaseConfig } from '../config/config'
import firebase from 'firebase/compat/app'
import { set } from 'date-fns'
import { useNavigation, useRoute } from '@react-navigation/native';


const OtpScreen = () => {

    function convertPhoneNumber(phoneNumber) {
        // Kiểm tra xem phoneNumber có tồn tại và có phải là một chuỗi không
        if (typeof phoneNumber === 'string' && phoneNumber.startsWith('0')) {
            // Xóa ký tự '0' đầu tiên và thêm dấu '+84'
            return '+84' + phoneNumber.slice(1);
        } else {
            // Nếu số điện thoại không bắt đầu bằng '0' hoặc không phải là chuỗi, trả về số điện thoại không thay đổi
            return phoneNumber;
        }
    }
    let navigation = useNavigation();
    let route = useRoute();
    const p1 = route.params.p;
    const phoneNumber = convertPhoneNumber(p1)
    const [code, setCode] = useState('')
    const [verificationId, setVerificationId] = useState(null)
    const recaptchaVerifier = useRef(null)

    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider()
        phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
            .then(setVerificationId)
            .catch(console.error)
    }



    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                setCode('')
                navigation.navigate('LoginNavigator', { screen: 'LoginScreen' });
            })
            .catch(error => {
                alert(error)
            })
        Alert.alert('Phone authentication successful 👍')
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
    )
}

export default OtpScreen

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
})