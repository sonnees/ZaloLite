import { Routes, Route, Link, useLocation } from "react-router-dom";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";

function Navbar() {
  const location = useLocation();

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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="fixed h-full w-16 bg-[#0091ff]  pt-8">
      <nav className="w-full">
        <ul className="grid w-full items-center justify-center">
          <li className="pb-5">
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
                    src="https://s120-ava-talk.zadn.vn/2/5/a/5/6/120/5ded83a5856f6d2af9fce6eac4b8d6d2.jpg"
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
                      onClick={handleClose}
                    >
                      Hồ sơ của bạn
                    </MenuItem>
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
