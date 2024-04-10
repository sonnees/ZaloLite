// Import thư viện mã hóa AES
import CryptoJS from 'crypto-js';

// Khóa bí mật để mã hóa/ giải mã dữ liệu
const secretKey = 'tranquanghuydangcodeappzaloxinchaotatcacacban09@#$%^&*()_+';

// Hàm để mã hóa dữ liệu trước khi lưu vào cookies
export const encryptData = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encryptedData;
};

// Hàm để giải mã dữ liệu từ cookies
export const decryptData = (encryptedData) => {
    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

        // Kiểm tra xem dữ liệu có đúng định dạng JSON không
        if (!decryptedData || decryptedData.trim() === '') {
            throw new Error('Invalid JSON data');
        }

        // Parse dữ liệu JSON
        const parsedData = JSON.parse(decryptedData);
        return parsedData;
    } catch (error) {
        console.error('Error decrypting data:', error);
        return null;
    }
};

// // Lưu trữ dữ liệu đã được mã hóa vào cookies
// const setEncryptedDataInCookie = (data) => {
//     const encryptedData = encryptData(data);
//     document.cookie = `encryptedData=${encryptedData}; expires=${new Date(Date.now() + 86400e3).toUTCString()}; path=/`;
// };

// // Lấy dữ liệu đã được giải mã từ cookies
// const getDecryptedDataFromCookie = () => {
//     const cookieData = document.cookie.split('; ').find(row => row.startsWith('encryptedData='));
//     if (cookieData) {
//         const encryptedData = cookieData.split('=')[1];
//         const decryptedData = decryptData(encryptedData);
//         return decryptedData;
//     }
//     return null;
// };