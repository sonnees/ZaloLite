import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [myUserInfo, setMyUserInfo] = useState({})
    const [chatID, setChatID] = useState({})
    const [listChatID, setListChatID] = useState([])

    const logIn = async (token = "") => {
        if (!token.trim()) return;

        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            console.error("Error saving token:", error);
        }
    };

    const logOut = async () => {
        await AsyncStorage.removeItem("token");
        return setUser({});
    };

    return (
        <GlobalContext.Provider
            value={{
                myUserInfo,
                chatID,
                listChatID,
                setMyUserInfo,
                setChatID,
                setListChatID,
                logIn,
                logOut,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};