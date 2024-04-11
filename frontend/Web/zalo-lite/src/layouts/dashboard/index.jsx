import React, { useState, useLayoutEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { UserProvider } from "../../context/UserContext";

import OtherMessage from "../../pages/Message/OtherMessage";
import Conversation from "../../components/Conversation";

function DashboardLayout({ children, component }) {
  const [width, setWidth] = useState(window.innerWidth);
  const [userID, setUserID] = useState(""); // State để lưu userID

  useLayoutEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isNavbarReady, setIsNavbarReady] = useState(false);

  // Callback function để thông báo rằng Navbar đã sẵn sàng và có dữ liệu
  const handleNavbarReady = (userID) => {
    setUserID(userID); // Cập nhật userID khi nhận được từ Navbar
    setIsNavbarReady(true); // Đánh dấu là Navbar đã sẵn sàng
  };

  // // Hàm để cập nhật userID
  // const updateUserID = (newUserID) => {
  //   setUserID(newUserID);
  // };
  // console.log("userID in dashboard layout", userID);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex h-screen w-full ">
        <UserProvider>
          <Navbar onNavbarReady={handleNavbarReady} />
          {/* <div className="flex h-screen w-full grid-flow-col ">
          <div className="ml-16 w-full max-w-fit flex-1 border-r md:w-[345px]">
            <div className="flex-1 text-gray-500 ">
              <Outlet />
            </div>
          </div>
          <div className="hidden w-full overflow-hidden md:flex ">
            <div className="h-fit w-max flex-1">
              {children}
            </div>
          </div>
        </div> */}

          <Outlet />
        </UserProvider>
      </div>
    </div>
  );
}

export default DashboardLayout;
