export const host = '192.168.33.63';

export const API_AUTHENTICATE = `http://${host}:8081/api/v1/auth/authenticate`;
export const API_REGISTER = `http://${host}:8081/api/v1/auth/register`;
export const API_PROFILE = `http://${host}:8081/api/v1/account/profile/`;
export const API_CHECKPHONE = `http://${host}:8081/api/v1/auth/check-uniqueness-phone-number/`;
export const API_CHANGE_PASS = `http://${host}:8081/api/v1/account/change-password`;
export const API_RESET_PASS = `http://${host}:8081/api/v1/auth/reset-password`;
export const API_INFOR_ACCOUNT = `http://${host}:8081/api/v1/account/info`;
export const API_PROFILE_BY_USERID = `http://${host}:8081/api/v1/account/profile/userID/`;

export const API_INFOR_USER = `http://${host}:8082/api/v1/user/info/`;
export const API_GET_LIST_CHATACTIVITY = `http://${host}:8082/api/v1/chat/x-to-y?id=`;


