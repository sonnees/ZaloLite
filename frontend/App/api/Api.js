const Host = '192.168.1.8';

export const API_AUTHENTICATE = `http://${Host}:8081/api/v1/auth/authenticate`;
export const API_REGISTER = `http://${Host}:8081/api/v1/auth/register`;
export const API_PROFILE = `http://${Host}:8081/api/v1/account/profile/`;
export const API_CHECKPHONE = `http://${Host}:8081/api/v1/auth/check-uniqueness-phone-number/`;
export const API_CHANGE_PASS = `http://${Host}:8081/api/v1/account/change-password`;
export const API_RESET_PASS = `http://${Host}:8081/api/v1/auth/reset-password`;
export const API_INFOR_ACCOUNT = `http://${Host}:8081/api/v1/account/info`;
export const API_INFOR_USER = `http://${Host}:8082/api/v1/user/info/`;
export const API_LIST_CHAT = `http://${Host}:8082/api/v1/chat/x-to-y`;


