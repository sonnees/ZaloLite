import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [conversationId, setConversationId] = useState("");

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
                user,
                conversationId,
                setUser,
                setConversationId,
                logIn,
                logOut,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};