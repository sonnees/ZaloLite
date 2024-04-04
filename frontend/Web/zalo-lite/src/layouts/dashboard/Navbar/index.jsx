import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import PopupWindow from "../../../components/PopupWindow";

// import fetch from "node-fetch";

function Navbar() {
  const [profileData, setProfileData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation();
  const token = location.state?.token;
  const phoneNumber = location.state?.phoneNumber;
  console.log("Token: ", token);
  console.log("Phone Number: ", phoneNumber);

  let messageImage = "/message-outline.png";
  let contactImage = "/contact-book-outline.png";
  let todoImage = "/todo-outline.png";

  if (
    location.pathname === "/app" ||
    location.pathname === "/app/other-message"
  ) {
    messageImage = "/message.png";
  }
  if (location.pathname === "/contact") {
    contactImage = "/contact-selected.png";
  }
  if (location.pathname === "/todo") {
    todoImage = "/todo-selected.png";
  }

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    console.log(isPopupOpen);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    console.log(isPopupOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Gửi yêu cầu GET khi component được mount hoặc phoneNumber thay đổi
  useEffect(() => {
    if (token && phoneNumber) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(
            `http://localhost:8081/api/v1/account/profile/${phoneNumber}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`
              },
            },
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log(data);
          setProfileData(data);
          setAvatar(data.avatar)
          console.log(avatar);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfileData(null);
        }
      };

      fetchProfile();
    }
  }, [token, phoneNumber]);


  console.log(profileData);

  return (
    <div className="fixed h-full w-16 bg-[#0091ff]  pt-[26px]">
      <nav className="w-full">
        <ul className="grid w-full items-center justify-center">
          <li className="pb-[14px]">
            <div className="">
              <Button
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                disableTouchRipple
              >
                <div>
                  <img
                    // src="https://s120-ava-talk.zadn.vn/2/5/a/5/6/120/5ded83a5856f6d2af9fce6eac4b8d6d2.jpg"
                    src={avatar}
                    className="w-14 rounded-full border "
                    alt="avatar"
                  />
                </div>
              </Button>
              <Menu
                id="fade-menu"
                MenuListProps={{
                  "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <div className="px-4 text-sm ">
                  <div className="py-2">
                    <span className="text-lg font-medium text-[#081c36]">
                      Trần Huy
                    </span>
                  </div>
                  <div className="w-[270px] border-y py-1 text-sm ">
                    <MenuItem
                      sx={{
                        fontSize: 14,
                        paddingLeft: 0,
                        height: 36,
                        color: "#081c36",
                      }}
                      onClick={handleOpenPopup}
                    >
                      Hồ sơ của bạn
                    </MenuItem>
                      <PopupWindow isOpen={isPopupOpen} onClose={handleClosePopup} data={profileData} phoneNumber={phoneNumber} token={token} />
                    <MenuItem
                      sx={{
                        fontSize: 14,
                        paddingLeft: 0,
                        height: 36,
                        color: "#081c36",
                      }}
                      onClick={handleClose}
                    >
                      Cài đặt
                    </MenuItem>
                  </div>
                  <Link to="/auth/login">
                    <MenuItem
                      sx={{
                        fontSize: 14,
                        paddingLeft: 0,
                        paddingTop: 1,
                        height: 36,
                        color: "#081c36",
                      }}
                      onClick={handleClose}
                    >
                      Đăng xuất
                    </MenuItem>
                  </Link>
                </div>
              </Menu>
            </div>
          </li>
            
          <li>
            <Link
              to="/"
              className={`flex justify-center p-4 py-5 ${
                location.pathname === "/app" ||
                location.pathname === "/app/other-message"
                  ? "bg-[#006edc]"
                  : ""
              }`}
            >
              <img
                src={messageImage}
                className="h-[24px] w-[24px] items-center justify-center"
                alt="avatar"
              />
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`flex justify-center p-4 py-5 ${
                location.pathname === "/contact" ? "bg-[#006edc]" : ""
              }`}
            >
              <img
                src={contactImage}
                className="h-[24px] w-[24px]"
                alt="avatar"
              />
            </Link>
          </li>
          <li>
            <Link
              to="/todo"
              className={`flex justify-center p-4 py-5 ${
                location.pathname === "/todo" ? "bg-[#006edc]" : ""
              }`}
            >
              <img src={todoImage} className="h-[22px] w-[22px]" alt="avatar" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
