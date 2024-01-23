// MessageDetail.js
import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";

const MessageDetail = ({ message }) => {
  const { sender, content, timestamp, avatar, hasEmotion } = message;
  // avatar = "https://avatars.githubusercontent.com/u/81128952?v=4";
  const messageRef = useRef(null);
  const [isMyMessage, setIsMyMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    setIsMyMessage(!isMyMessage);
    setIsHovered(true);
  };

  return (
    <div
      ref={messageRef}
      className={`relative mb-3 flex ${isHovered ? "group" : ""} ${
        sender === "me" ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    >
      {sender === "me" && (
        <div className="flex w-[155px] items-end">
          {isHovered ? (
            <div className="mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg bg-[#DDDBDB] p-1 px-2">
              <a href="">
                <img
                  src="/src/assets/reply-arrow.png"
                  alt=""
                  className="h-4 w-4"
                />
              </a>
              <a href="">
                <img
                  src="/src/assets/reply.png"
                  alt=""
                  className="h-4 w-4"
                />
              </a>
              <a href="">
                <img
                  src="/src/assets/todos.png"
                  alt=""
                  className="h-4 w-4"
                />
              </a>
              <a href="">
                <img
                  src="/src/assets/option.png"
                  alt=""
                  className="h-4 w-4"
                />
              </a>
            </div>
          ) : (
            <div className="mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg p-1 px-2"></div>
          )}
        </div>
      )}
      {sender === "other" && (
        <Avatar
          src={"https://zpsocial-f50-org.zadn.vn/b460c9d113d8fd86a4c9.jpg"}
          alt="Avatar"
          className="mr-3"
        />
      )}
      <div
        className={`${
          sender === "me" ? "bg-[#E5EFFF]" : "bg-[#FFFFFF]"
        } relative flex flex-col items-start rounded-md p-3 transition-all duration-300`}
      >
        <div className="flex items-center">
          <p className={`text-[#081c36] ${sender === "other" ? "" : ""}`}>
            {content}
          </p>
          {/* {isHovered && (
            <span className="ml-2 rounded-md bg-blue-500 px-2 py-1 text-white">
              Tùy chọn
            </span>
          )} */}
        </div>
        <span className="mt-3 text-xs text-gray-500">{timestamp}</span>
        {hasEmotion && isHovered && isMyMessage && (
          <div className="absolute bottom-0 right-0 mb-1 mr-1">
            {/* Thêm icon cảm xúc ở đây */}
            <img
              src="/path/to/emotion-icon.png"
              alt="Emotion Icon"
              className="h-4 w-4"
            />
          </div>
        )}
      </div>
      {isHovered && sender === "other" && (
        <div className="flex w-[155px] items-end">
          <div className="mb-3 ml-3 mr-7 flex w-[116px] justify-between rounded-lg bg-[#DDDBDB] p-1 px-2">
            <a href="">
              <img
                src="/src/assets/reply-arrow.png"
                alt=""
                className="h-4 w-4"
              />
            </a>
            <a href="">
              <img src="/src/assets/reply.png" alt="" className="h-4 w-4" />
            </a>
            <a href="">
              <img src="/src/assets/todos.png" alt="" className="h-4 w-4" />
            </a>
            <a href="">
              <img src="/src/assets/option.png" alt="" className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDetail;
