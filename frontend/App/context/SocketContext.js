import { createContext, useState } from "react";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState({});

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>

            {children}

        </SocketContext.Provider>
    );
};