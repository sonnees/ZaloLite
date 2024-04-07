import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [myUserInfo, setMyUserInfo] = useState({})
    const [chatID, setChatID] = useState({})
    const [listChatID, setListChatID] = useState([])

    const logIn = (token = "") => {
        if (!token.trim()) return;

        return localStorage.setItem("access_token", token);
    };

    const logOut = () => {
        localStorage.removeItem("access_token");
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