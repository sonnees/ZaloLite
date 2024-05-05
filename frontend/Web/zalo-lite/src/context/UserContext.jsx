import React, { useContext, useState } from "react";

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [userID, setUserID] = useState("");
  const [cons, setCons] = useState("");
  const [loadDefaultAvt, setLoadDefaultAvt] = useState("https://res.cloudinary.com/du73a0oen/image/upload/v1713020468/Zalo-Lite/juqqm5zgxjaamjw41lvz.png");

  return (
    <UserContext.Provider value={{ userID, setUserID, cons, setCons, loadDefaultAvt, setLoadDefaultAvt}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
