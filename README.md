# FRONT END APP
`Config API:`
        
        ipconfig
        
Sau đó vào App/api/Api.js => đổi lại mạng cho giống với IPv4 Address

Ví dụ: 

        export const API_URL ='http://192.168.1.3:8081/api/v1/auth/authenticate'
        
        IPv4 Address. . . . . . . . . . . : 192.168.1.186
        
        => export const API_URL ='http://192.168.1.186:8081/api/v1/auth/authenticate';

<details>
  <summary>👇 Cài đặt các thư viện </summary> <br>
`THƯ VIỆN LIÊN QUAN ĐẾN NAVIGATION`
  
        
        npm install @react-navigation/bottom-tabs @react-navigation/stack
        
        
        npm install react-native-elements react-native-popup-menu

        
        npm install react-native-gesture-handler@2.14.0 expo@~50.0.14 react-native@0.73.6
        
  
`THƯ VIỆN LIÊN QUAN ĐẾN LINEAR-GRADIENT`
        
        npm install react-native-linear-gradient
        

`THƯ VIỆN LIÊN QUAN ĐẾN CAMERA VÀ QR`

        
        npm install react-native-camera react-native-qrcode-scanner react-native-camera expo-barcode-scanner expo-camera
        
        
        
        npm install @react-native-camera/core @react-native-camera/react-native-camera
        
        
        
        npm install react-native-keyboard-aware-scrollview --save
        

`THƯ VIỆN LIÊN QUAN ĐẾN XÁC THỰC`

        
        npm install expo-firebase-core
        

</details>
`APP RUN`

        
        npx expo start --port 3005
        
