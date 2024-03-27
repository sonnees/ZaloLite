import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import MessageDetail from "./MessageDetail";
import MessageInput from "./MessageInput";

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
  const handleSendMessage = (newMessage) => {
    // Xử lý logic gửi tin nhắn, có thể thêm tin nhắn mới vào danh sách messages
    // hoặc sử dụng một hàm callback để truyền tin nhắn lên component cha.
    console.log("Gửi tin nhắn:", newMessage);
  };
  const messages = [
    {
      sender: "other",
      content: "Hello!",
      timestamp: "15:30",
      avatar: "avatar_url",
    },
    {
      sender: "me",
      content: "Hi there!",
      timestamp: "15:32",
      avatar: "my_avatar_url",
    },
    {
      sender: "other",
      content: "How are you doing today?",
      timestamp: "15:35",
      avatar: "avatar_url",
    },
    {
      sender: "me",
      content: "I'm doing well, thank you. How about you?",
      timestamp: "15:37",
      avatar: "my_avatar_url",
    },
    {
      sender: "other",
      content: "I'm great! What have you been up to lately?",
      timestamp: "15:40",
      avatar: "avatar_url",
    },
    {
      sender: "me",
      content: "Not much, just working on some projects. How about you?",
      timestamp: "15:42",
      avatar: "my_avatar_url",
    },
    {
      sender: "other",
      content:
        "I've been busy with work too. Do you have any plans for the weekend?",
      timestamp: "15:45",
      avatar: "avatar_url",
    },
    {
      sender: "me",
      content:
        "I'm thinking of relaxing and maybe catching up on some movies. How about you?",
      timestamp: "15:47",
      avatar: "my_avatar_url",
    },
    {
      sender: "other",
      content:
        "That sounds nice! I might go hiking with friends. Would you like to join?",
      timestamp: "15:50",
      avatar: "avatar_url",
    },
    
    {
      sender: "me",
      content: "Thanks for the invitation! I'll let you know if I can make it.",
      timestamp: "15:52",
      avatar: "my_avatar_url",
    },
    {
      sender: "me",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero adipisci itaque, quis fugiat dolore recusandae cum esse et ducimus blanditiis magni explicabo. Illo, architecto sed! Ad quod tempore sed quo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores velit, ex voluptas sint modi iste unde ipsam explicabo ducimus, animi doloremque nostrum, delectus ab suscipit aliquid cupiditate reiciendis sed architecto? Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore laudantium doloribus ullam quidem ipsa sed commodi sit quod ipsam, pariatur voluptatum minus fugit esse autem quibusdam tempore? Vel, autem inventore!",
      timestamp: "15:52",
      avatar: "my_avatar_url",
    },
    // Thêm tin nhắn khác nếu cần
  ];

  const [openPicker, setOpenPicker] = useState(false);

  return (
    <div className="h-screen w-full">
      <div className="h-[68px] w-full px-4">
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
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <a href="" className="p-1">
              <img
                src="/src/assets/group-user-plus.png"
                alt=""
                className="w-[22px] "
              />
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
      {/* -68 */}
      <div className="h-[calc(100vh-174px)] w-full flex-1 overflow-auto bg-[#A4BEEB] p-4 pr-3">
        {/* <Message sender="other" content="Xin chào!" timestamp="15:30" />
        <Message sender="me" content="Chào bạn!" timestamp="15:32" />
        Thêm tin nhắn khác ở đây */}
        {messages.map((message, index) => (
          <MessageDetail key={index} message={message} />
        ))}
      </div>
      <div className="border-t">
        <div className="flex h-[47px] flex-row justify-items-start bg-white">
          <div className="flex flex-row justify-items-start pl-2">
            <div className="mr-2 flex w-10 items-center justify-center">
              <a
                href="#"
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
              >
                <img
                  src="/chatbar-sticker.png"
                  alt=""
                  className="h-[24px] w-[24px] opacity-65"
                />
              </a>
            </div>
            <Box
              style={{
                zIndex: 10,
                position: "fixed",
                display: openPicker ? "inline" : "none",
                bottom: 110,
                // right: isMobile ? 20 : sideBar.open ? 420 : 100,
              }}
            >
              <Picker
                data={data}
                onEmojiSelect={(emoji) => {
                  console.log(emoji.native);
                  // handleEmojiClick(emoji.native);
                }}
              />
            </Box>
            <div className="mr-2 flex w-10 items-center justify-center">
              <a href="#">
                <img
                  src="/chatbar-photo.png"
                  alt=""
                  className="h-[24px] w-[24px] opacity-65"
                />
              </a>
            </div>
            <div className="mr-2 flex w-10 items-center justify-center">
              <a href="#">
                <img
                  src="/chatbar-attach.png"
                  alt=""
                  className="h-[24px] w-[24px] opacity-65"
                />
              </a>
            </div>
            <div className="mr-2 flex w-10 items-center justify-center">
              <a href="#">
                {/* prettier-ignore */}
                <img src="/chatbar-screenshotz.png"
                  alt=""
                  className="h-[24px] w-[24px] opacity-65"
                />
              </a>
            </div>
            <div className="mr-2 flex w-10 items-center justify-center">
              <a href="#">
                <img
                  src="/chatbar-reminder.png"
                  alt=""
                  className="h-[24px] w-[24px] opacity-65"
                />
              </a>
            </div>
            <div className="mr-2 flex w-10 items-center justify-center">
              <a href="#">
                <img
                  src="/chatbar-todo.png"
                  alt=""
                  className="h-[24px] w-[24px] opacity-65"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="h-[58.5px]">
          {/* Thêm phần nhập tin nhắn ở đây */}
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Conversation;
