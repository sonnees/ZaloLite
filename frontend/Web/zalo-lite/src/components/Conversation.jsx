import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import MessageDetail from "./MessageDetail"; 

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Message = ({ sender, content, timestamp }) => (
  <div
    className={`flex ${sender === "me" ? "justify-end" : "justify-start"} mb-2`}
  >
    <div
      className={`bg-${sender === "me" ? "blue" : "green"}-300 rounded-md p-2`}
    >
      <p className="text-white">{content}</p>
      <span className="text-xs text-gray-500">{timestamp}</span>
    </div>
  </div>
);

const Conversation = () => {
    const messages = [
      {
        sender: "other",
        content: "Xin chào!",
        timestamp: "15:30",
        avatar: "avatar_url",
      },
      {
        sender: "me",
        content: "Chào bạn!",
        timestamp: "15:32",
        avatar: "my_avatar_url",
      },
      // Thêm tin nhắn khác ở đây
    ];
  return (
    <div className="w-full flex-1">
      <div className="h-[68px] w-full border px-4">
        <div className="flex h-full w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-2">
            <FontAwesomeIcon icon={faChevronLeft} className="pl-1 pr-3" />
            <div className="hidden lg:block">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  sx={{ width: 48, height: 48 }}
                  alt="Name"
                  src="https://zpsocial-f50-org.zadn.vn/b460c9d113d8fd86a4c9.jpg"
                />
              </StyledBadge>
            </div>
            <div className="flex flex-col">
              <div className="text-lg font-medium text-[#081c36]">
                <span>Nguyễn Anh Vũ</span>
              </div>
              <div className="flex items-center text-sm text-[#7589a3]">
                <span>Vừa truy cập</span>
                <span className="text-[#D7DBE0]"> &nbsp;|&nbsp;</span>
                <span className="flex items-center justify-center">
                  <img
                    className="mt-[1px] h-[10px]"
                    src="/src/assets/tag.png"
                    alt=""
                    srcset=""
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <a href="" className="p-1">
              <img src="/src/assets/group-user-plus.png" alt="" />
            </a>
            <a href="" className="p-2">
              <img
                src="/src/assets/mini-search.png"
                alt=""
                className="m-1 h-4 w-4"
              />
            </a>
            <a href="" className="p-2">
              <img src="/src/assets/video.png" alt="" className="m-1 h-5 w-5" />
            </a>
            <a href="" className="p-2">
              <img
                src="/src/assets/right-bar.png"
                alt=""
                className="m-1 h-4 w-4"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="h-screen w-full overflow-auto bg-[#A4BEEB] p-4">
        {/* <Message sender="other" content="Xin chào!" timestamp="15:30" />
        <Message sender="me" content="Chào bạn!" timestamp="15:32" />
        Thêm tin nhắn khác ở đây */}
        {messages.map((message, index) => (
          <MessageDetail key={index} message={message} />
        ))}
      </div>
    </div>
  );
};

export default Conversation;
