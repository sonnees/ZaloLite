const Port = '192.168.1.8';


const API_AUTHENTICATE = `http://${Port}:8081/api/v1/auth/authenticate`;
const API_REGISTER = `http://${Port}:8081/api/v1/auth/register`;
const API_PROFILE = `http://${Port}:8081/api/v1/account/profile/`;
const API_CHECKPHONE = `http://${Port}:8081/api/v1/auth/check-uniqueness-phone-number/`;
const API_CHANGE_PASS = `http://${Port}:8081/api/v1/account/change-password`;
const API_RESET_PASS = `http://${Port}:8081/api/v1/auth/reset-password`;
const API_INFOR_ACCOUNT = `http://${Port}:8081/api/v1/account/info`;
const API_PROFILE_BY_USERID = `http://${Port}:8081/api/v1/account/profile/userID/`;

const API_INFOR_USER = `http://${Port}:8082/api/v1/user/info/`;

const fetchProfileInfoByUserID = async (userID, token) => {
    try {
        const response = await axios.get(`${API_PROFILE_BY_USERID}${userID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("PROFILE FRIEND REQUEST:\n", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status !== 404) {
                return {
                    status: error.response.status,
                    message: 'Lỗi khi lấy thông tin cá nhân'
                };
            }
            return {
                status: 404,
                message: 'Không tìm thấy thông tin cá nhân'
            };
        } else {
            return {
                status: -1,
                message: 'Lỗi kết nối máy chủ'
            };
        }
    }
};
// const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6IjAwMDAwMDAwMDAiLCJpYXQiOjE3MTI1NDI5MzQsImV4cCI6MTcxMjY1MDkzNH0.s7TFD3UzgfeEdrW7CcFRuqL4dCA6Ddab43gyoDrF3i0'
// const userID = 'f1cee7b8-7712-4042-9e94-17bd21209a62'
// const data = fetchProfileInfoByUserID(userID, token)
// console.log("DATA \n", data);
export { fetchProfileInfoByUserID };
