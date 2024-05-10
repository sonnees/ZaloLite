export const Port = '192.168.0.246';

export const API_AUTHENTICATE = `http://${Port}:8081/api/v1/auth/authenticate`;
export const API_REGISTER = `http://${Port}:8081/api/v1/auth/register`;
export const API_PROFILE = `http://${Port}:8081/api/v1/account/profile/`;
export const API_CHECKPHONE = `http://${Port}:8081/api/v1/auth/check-uniqueness-phone-number/`;
export const API_CHANGE_PASS = `http://${Port}:8081/api/v1/account/change-password`;
export const API_RESET_PASS = `http://${Port}:8081/api/v1/auth/reset-password`;
export const API_INFOR_ACCOUNT = `http://${Port}:8081/api/v1/account/info`;
export const API_PROFILE_BY_USERID = `http://${Port}:8081/api/v1/account/profile/userID/`;

export const API_INFOR_USER = `http://${Port}:8082/api/v1/user/info/`;
export const API_GET_LIST_CHATACTIVITY = `http://${Port}:8082/api/v1/chat/x-to-y?id=`;

export const CREATE_GROUP = `ws://${Port}:8082/ws/group`


