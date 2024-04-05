const Port = 'http://192.168.103.63:8081';
export const API_AUTHENTICATE = `${Port}/api/v1/auth/authenticate`;
export const API_REGISTER = `${Port}/api/v1/auth/register`;
export const API_PROFILE = `${Port}/api/v1/account/profile/`;
export const API_CHECKPHONE = `${Port}/api/v1/auth/check-uniqueness-phone-number/`;
export const API_CHANGE_PASS = `${Port}/api/v1/account/change-password`;
export const API_RESET_PASS = `${Port}/api/v1/auth/reset-password`;
export const API_INFOR_ACCOUNT = `${Port}/api/v1/account/info`;

const PortChat = 'http://192.168.103.63:8082';
export const API_INFOR_USER = `${PortChat}/api/v1/user/info/`;

