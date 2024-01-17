// MessageDetail.js
import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";

const MessageDetail = ({ message }) => {
  const { sender, content, timestamp, avatar, hasEmotion } = message;
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
      className={`relative mb-2 flex ${isHovered ? "group" : ""} ${
        sender === "me" ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    >
      {sender === "other" && (
        <Avatar src={avatar} alt="Avatar" className="mr-2" />
      )}
      <div
        className={`${
          sender === "me" ? "bg-blue-500" : "bg-gray-300"
        } relative flex flex-col items-start rounded-md p-3 transition-all duration-300`}
      >
        <div className="flex items-center">
          <p className={`text-white ${sender === "other" ? "ml-2" : ""}`}>
            {content}
          </p>
          {isHovered && (
            <span className="ml-2 rounded-md bg-blue-500 px-2 py-1 text-white">
              Tùy chọn
            </span>
          )}
        </div>
        <span className="mt-1 text-xs text-gray-500">
          {sender === "other" && timestamp}
        </span>
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
    </div>
  );
};

export default MessageDetail;
