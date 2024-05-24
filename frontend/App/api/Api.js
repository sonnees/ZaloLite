export const host = '192.168.1.9';

const GATEWAY='https://zalolite-gateway-server-production.up.railway.app';
export const ACCOUNT='wss://zalolite-account-server-production.up.railway.app';
export const CHAT_SERVER='wss://zalolite-chat-server-production.up.railway.app';

export const API_AUTHENTICATE = `${GATEWAY}/api/v1/auth/authenticate`;
export const API_REGISTER = `${GATEWAY}/api/v1/auth/register`;
export const API_PROFILE = `${GATEWAY}/api/v1/account/profile/`;
export const API_CHECKPHONE = `${GATEWAY}/api/v1/auth/check-uniqueness-phone-number/`;
export const API_CHANGE_PASS = `${GATEWAY}/api/v1/account/change-password`;
export const API_RESET_PASS = `${GATEWAY}/api/v1/auth/reset-password`;
export const API_INFOR_ACCOUNT = `${GATEWAY}/api/v1/account/info`;
export const API_PROFILE_BY_USERID = `${GATEWAY}/api/v1/account/profile/userID/`;
export const API_INFOR_USER = `${GATEWAY}/api/v1/user/info/`;
export const API_GET_LIST_CHATACTIVITY = `${GATEWAY}/api/v1/chat/x-to-y?id=`;

export const CREATE_GROUP = `${CHAT_SERVER}/ws/group`

 