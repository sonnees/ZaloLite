
const port='192.168.1.117'
export const host = `http://${port}:8080`;
export const socket = `ws://${port}:8082`;
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
export const API_CHANGE_AVATAR = `${GATEWAY}/api/v1/account/change-avatar`;

export const GROUP_SOCKET = `${CHAT_SERVER}/ws/group`
export const CHAT_SOCKET=`${CHAT_SERVER}/ws/chat`
export const ADDFRIEND_SOCKET=`${CHAT_SERVER}/ws/user`
export const ACCOUNT_SOCKET=`${ACCOUNT}/ws/auth/`


// export const API_AUTHENTICATE = `${host}/api/v1/auth/authenticate`;
// export const API_REGISTER = `${host}/api/v1/auth/register`;
// export const API_PROFILE = `${host}/api/v1/account/profile/`;
// export const API_CHECKPHONE = `${host}/api/v1/auth/check-uniqueness-phone-number/`;
// export const API_CHANGE_PASS = `${host}/api/v1/account/change-password`;
// export const API_RESET_PASS = `${host}/api/v1/auth/reset-password`;
// export const API_INFOR_ACCOUNT = `${host}/api/v1/account/info`;
// export const API_PROFILE_BY_USERID = `${host}/api/v1/account/profile/userID/`;
// export const API_INFOR_USER = `${host}/api/v1/user/info/`;
// export const API_GET_LIST_CHATACTIVITY = `${host}/api/v1/chat/x-to-y?id=`;

// export const GROUP_SOCKET = `${socket}/ws/group`
// export const CHAT_SOCKET=`${socket}/ws/chat`
// export const ADDFRIEND_SOCKET=`${socket}/ws/user`
// export const ACCOUNT_SOCKET=`${socket}/ws/auth/`