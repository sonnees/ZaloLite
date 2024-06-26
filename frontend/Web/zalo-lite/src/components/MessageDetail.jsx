import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Cookies from "universal-cookie";
import { useEffect } from "react";
import { format, parseISO, set } from "date-fns";
import LinkPreview from "./LinkPreview";
import FileLink from "./FileLink";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Fade from "@mui/material/Fade";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useUser } from "../context/UserContext";

// Hàm để sao chép nội dung vào clipboard
const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Copied to clipboard:", text);
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
};

const MessageDetail = ({
  message,
  chatAvatar,
  chatName,
  socketFromConservation,
  setSocketFromConservation,
  setMessageDeletedID,
  setMessageRecalledID,
  idA,
  setOpenDialog,
  setShareContent,
  setOpenCompReplyInput,
  setParentIdMsg,
  setUserIDReplyForCompReply,
}) => {
  const cookies = new Cookies();
  const [userIDFromCookies, setUserIDFromCookies] = useState("");
  const { userID, contents, timestamp, hasEmotion } = message;
  const [socket, setSocket] = useState(socketFromConservation);
  const { cons, setCons } = useUser();

  const [isRecalled, setIsRecalled] = useState(false);
  // const location = useLocation();
  // const { id } = queryString.parse(location.search);
  // console.log("Chat ID:", id);

  const formattedTime = (timestamp) => {
    if (timestamp) {
      const parsedTimestamp = parseISO(timestamp);
      return format(parsedTimestamp, "HH:mm");
    } else {
      return ""; // Trả về chuỗi rỗng nếu timestamp không tồn tại
    }
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsRecalled(false);
  };

  useEffect(() => {
    const userID = cookies.get("userID");
    setUserIDFromCookies(userID);
  }, [cons]);

  // Function to send recall message to WebSocket
  const sendRecallMessage = (messageID) => {
    const recallMessage = {
      id: uuidv4(),
      tcm: "TCM05",
      userID: userIDFromCookies,
      messageID: messageID,
    };

    // Replace this line with your WebSocket send function

    socket.send(JSON.stringify(recallMessage));
    // setMessageDeletedID(recallMessage.id);
    console.log("Sending recall message:", recallMessage);
  };

  const hidenMessage = (messageID) => {
    const id = uuidv4();
    const hiddenMessage = {
      id: id,
      tcm: "TCM04",
      userID: userIDFromCookies,
      messageID: messageID || idA,
    };

    // Replace this line with your WebSocket send function
    console.log("Sending hidden message:", hiddenMessage);
    socket.send(JSON.stringify(hiddenMessage));
    setSocketFromConservation(socket);
  };

  const handleHidenMessage = (messageID) => {
    hidenMessage(messageID);
    handleClose();
  };

  const handleRecall = (messageID) => {
    sendRecallMessage(messageID);
    setIsRecalled(true);
    handleClose();
  };

  const renderContent = () => {
    if (isRecalled) {
      return (
        <div className="text-[15px] text-[#98A1AC]">
          Tin nhắn đã được thu hồi
        </div>
      );
    } else if (contents && contents.length == 1) {
      return contents.map((content, index) => {
        if (content.key === "image") {
          return (
            <div key={index}>
              <div className="absolute ml-3 mt-1 flex items-center justify-center rounded bg-[#787B7C] p-[1px] px-[2px]">
                <span className="text-[10px] text-white">FHD</span>
              </div>
              <a href={content.value} target="_blank" rel="noopener noreferrer">
                <img
                  src={content.value}
                  alt="Image"
                  className="-mr-3 h-auto max-w-[500px] rounded-md"
                />
              </a>
            </div>
          );
        } else if (content.key === "text") {
          return (
            <p
              key={index}
              className={`text-[#081c36] ${
                userID !== userIDFromCookies ? "" : ""
              }`}
            >
              {content.value}
            </p>
          );
        } else if (content.key === "link") {
          return <LinkPreview key={index} url={content.value} />;
        } else if (
          content.key.startsWith("zip") ||
          content.key.startsWith("pdf") ||
          content.key.startsWith("xlsx") ||
          content.key.startsWith("doc") ||
          content.key.startsWith("docx") ||
          content.key.startsWith("rar")
        ) {
          const [fileLabel, fileName, fileSize] = content.key.split("|");
          return (
            <FileLink
              key={index}
              fileName={fileName}
              fileSize={fileSize}
              fileURL={content.value}
              fileKey={content.key}
            />
          );
        } else if (
          content.key.startsWith("mp4") ||
          content.key.startsWith("MP4")
        ) {
          return (
            <video key={index} controls className="h-auto max-w-[300px]">
              <source src={content.value} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        } else if (content.key === "emoji") {
          return <p key={index}>{content.value}</p>;
        }
        // return null;
      });
    } else if (contents && contents.length == 2) {
      return contents.map((content, index) => {
        if (content.key === "image") {
          return (
            <div key={index}>
              <div className="absolute ml-3 mt-1 flex items-center justify-center rounded bg-[#787B7C] p-[1px] px-[2px]">
                <span className="text-[10px] text-white">FHD</span>
              </div>
              <a href={content.value} target="_blank" rel="noopener noreferrer">
                <img
                  src={content.value}
                  alt="Image"
                  // className="-mr-3 h-auto max-w-[200px] rounded-md"
                  className="ml-2 h-[305px] w-[305px] rounded-md object-cover"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </a>
            </div>
          );
        }
      });
    } else if (contents && contents.length > 1) {
      return contents.map((content, index) => {
        if (content.key === "image") {
          return (
            <div key={index}>
              <div className="absolute ml-3 mt-1 flex items-center justify-center rounded bg-[#787B7C] p-[1px] px-[2px]">
                <span className="text-[10px] text-white">FHD</span>
              </div>
              <a href={content.value} target="_blank" rel="noopener noreferrer">
                <img
                  src={content.value}
                  alt="Image"
                  // className="-mr-3 h-auto max-w-[200px] rounded-md"
                  className="mb-2 ml-2 h-[200px] w-[200px] rounded-md object-cover"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </a>
            </div>
          );
        }
      });
    }
  };

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

  const renderImageInForwadMsg = (contents) => {
    if (contents && contents.length > 0) {
      return contents.map((content, index) => {
        if (content.key === "image") {
          return (
            <img
              key={index}
              src={content.value}
              alt="Image"
              className="mb-2 mr-2 h-9 w-9"
            />
          );
        }
      });
    }
  };

  const token = cookies.get("token");

  const [ownerMessage, setOwnerMessage] = useState("");
  const identifyOwnerOfMessage = () => {
    if (message.userID === userIDFromCookies) {
      setOwnerMessage(localStorage.getItem("userName"));
    } else {
      // console.log("message.parentID", message.parentID);
      if (message.parentID != null) {
        const fetchInfoAccount = async () => {
          const response = await fetch(
            `${process.env.HOST}/api/v1/account/profile/userID/${message.parentID.userID}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data = await response.json();
          setOwnerMessage(data.userName);
        };
        fetchInfoAccount();
      }
    }
  };

  useEffect(() => {
    identifyOwnerOfMessage();
  }, []);

  const handleCopyMessage = () => {
    if (message.contents[0].key) {
      copyToClipboard(message.contents[0].value);
    }
    handleClose();
  };

  return (
    <div
      ref={messageRef}
      id={message.messageID}
      className={`relative mb-3 flex border ${isHovered ? "group" : ""} ${
        userID === userIDFromCookies ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    >
      {userID === userIDFromCookies && (
        <div className="flex w-[155px] items-end">
          {isHovered ? (
            <div className="">
              <div
                className={`mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg bg-[#DDDBDB] p-1 px-2 `}
              >
                <div
                  className="cursor-pointer  opacity-80 hover:opacity-100"
                  onClick={() => {
                    setOpenCompReplyInput(true);
                    setShareContent(message);
                    // console.log("messageID", message.messageID);
                    setParentIdMsg(message.messageID);
                    setUserIDReplyForCompReply(message.userID);
                  }}
                >
                  <img
                    src="/src/assets/icons/quotation-right-mark.png"
                    alt=""
                    className="mt-[2px] h-[13px] w-[13px]"
                  />
                </div>

                <div
                  onClick={() => {
                    setOpenDialog(true);
                    setShareContent(message);
                    // setParentIdMsg(message.messageID);
                  }}
                  className="cursor-pointer px-[2px] opacity-80 hover:opacity-100"
                >
                  <img src="/src/assets/reply.png" alt="" className="h-4 w-4" />
                </div>
                <a href="#" className=" opacity-80 hover:opacity-100">
                  <img src="/src/assets/todos.png" alt="" className="h-4 w-4" />
                </a>
                <div
                  onClick={handleClick}
                  className="cursor-pointer px-[2px]  opacity-70 hover:opacity-100"
                >
                  <img
                    src="/src/assets/option.png"
                    alt=""
                    className="h-4 w-4"
                  />
                </div>
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  className="rounded-lg"
                >
                  <MenuItem
                    onClick={() => {
                      handleCopyMessage();
                      handleClose();
                    }}
                  >
                    <img
                      src="/src/assets/icons/copy.png"
                      alt=""
                      className="mr-3 h-4 w-4"
                    />
                    <span className="text-tblack">Copy tin nhắn</span>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <img
                      src="/src/assets/icons/push-pin.png"
                      alt=""
                      className="mr-3 h-4 w-4"
                    />
                    <span className="text-tblack">Ghim tin nhắn</span>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleRecall(message.messageID);
                      setMessageRecalledID(message.messageID);

                      console.log("messageID thu hồi", message.messageID);
                    }}
                  >
                    <img
                      src="/src/assets/icons/refresh.png"
                      alt=""
                      className="mr-3 h-4 w-4"
                    />
                    <span className=" text-red-600">Thu hồi</span>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      console.log("messageID thu hồi chỉ phía tôi là", message);
                      handleHidenMessage(message.messageID);
                      setMessageDeletedID(message.messageID);
                    }}
                  >
                    <img
                      src="/src/assets/icons/delete.png"
                      alt=""
                      className="mr-3 h-4 w-4"
                    />
                    <span className=" text-red-600">Xoá chỉ ở phía tôi</span>
                  </MenuItem>
                </Menu>
              </div>
              {message.contents[0].key === "image" &&
                message.contents.length > 1 && <div className="h-[40px]"></div>}
              {message.contents[0].key === "image" &&
                message.contents.length == 1 && (
                  <div className="h-[40px]"></div>
                )}
            </div>
          ) : // <div className="mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg p-1 px-2"></div>
          null}
        </div>
      )}

      {/* Content Hiển thị tin nhắn HuyDev */}
      {message &&
      message.hidden &&
      message.hidden.includes(localStorage.getItem("userID")) ? null : (
        <>
          {userID !== userIDFromCookies && (
            <Avatar src={chatAvatar} alt="Avatar" className="mr-3" />
          )}
          <div
            className={`${
              userID === userIDFromCookies ? "bg-[#E5EFFF]" : "bg-[#FFFFFF]"
            } ${
              message.contents[0].key === "image" &&
              message.recall === true &&
              userID === userIDFromCookies
                ? "bg-[#E5EFFF]"
                : message.contents[0].key === "image" &&
                    message.recall === false
                  ? "max-w-[500px] bg-[rgb(164,190,235)]"
                  : "bg-[#E5EFFF]"
            } relative flex max-w-screen-sm flex-col items-start rounded-md p-3 transition-all duration-300`}
          >
            <div className="flex-1 items-center">
              {message.parentID && message.parentID.contents ? (
                <div className="mb-2 bg-[#CCDFFC] py-[10px] pl-3 pr-[9px]">
                  <div className="flex w-full border-l-2 border-[#4F87F7] pl-3">
                    <div className="h-9">
                      {renderImageInForwadMsg(message.parentID.contents)}
                    </div>
                    <div className="h-full w-full flex-1 pl-1">
                      <div className="flex w-full items-center text-xs">
                        <div className="flex">
                          <img
                            src="/src/assets/icons/quotation.png"
                            alt=""
                            className="h-4 w-4"
                          />
                          &nbsp;
                          <span className="text-[13px] font-semibold">
                            {/* {message.userID === userIDFromCookies &&
                            message.parentID.userID === userIDFromCookies
                              ? localStorage.getItem("userName")
                              : chatName} */}
                            {ownerMessage}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 w-full text-[13px]">
                        <span className="items-center text-[13px] text-[#476285]">
                          {message.parentID.contents[0].key === "image"
                            ? "[Hình ảnh]"
                            : message.parentID.contents[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {message.recall === true ? (
                <div className="text-[15px] text-[#98A1AC] ">
                  Tin nhắn đã được thu hồi
                </div>
              ) : message.contents[0].key === "image" &&
                message.contents.length == 2 ? (
                <>
                  <div
                    className={`${message.parentID ? "mt-2" : ""} ${
                      userID !== userIDFromCookies ? "-ml-6" : ""
                    } ${userID === userIDFromCookies ? "-mr-3" : ""} flex`}
                  >
                    {renderContent()}
                  </div>
                </>
              ) : message.contents[0].key === "image" &&
                message.contents.length > 1 ? (
                <>
                  <div
                    className={`${
                      message.parentID ? "mt-2" : ""
                    } -mr-3 flex flex-wrap ${
                      userID !== userIDFromCookies ? "-ml-5" : ""
                    }`}
                  >
                    {renderContent()}
                  </div>
                </>
              ) : message.contents[0].key === "image" &&
                message.contents.length == 1 ? (
                <>
                  <div
                    className={`${
                      message.parentID ? "mt-2" : ""
                    }  flex flex-wrap ${
                      userID !== userIDFromCookies ? "-ml-3" : ""
                    }`}
                  >
                    {renderContent()}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`${message.parentID ? "mt-2" : ""} ${
                      userID !== userIDFromCookies ? "" : ""
                    }`}
                  >
                    {renderContent()}
                  </div>
                </>
              )}
            </div>
            {userID !== userIDFromCookies ? (
              <span
                className={`mt-3 text-xs text-gray-500 ${
                  message.contents[0].key === "image" &&
                  message.recall === false
                    ? "-mr-3 mt-[4px] rounded-lg bg-slate-400 px-2 py-1 text-white"
                    : ""
                }`}
              >
                {formattedTime(timestamp)}
              </span>
            ) : (
              <span
                className={`mt-3 text-xs text-gray-500 ${
                  message.contents[0].key === "image" &&
                  message.recall === false
                    ? "-mr-3 ml-auto mt-[4px] rounded-lg bg-slate-400 px-2 py-1 text-white"
                    : ""
                }`}
              >
                {formattedTime(timestamp)}
              </span>
            )}
            {hasEmotion && isHovered && isMyMessage && (
              <div className="absolute bottom-0 right-0 mb-1 mr-1">
                <img
                  src="/path/to/emotion-icon.png"
                  alt="Emotion Icon"
                  className="h-4 w-4"
                />
              </div> //huy2
            )}
          </div>
        </>
      )}

      {/* Kết thúc Content Hiển thị tin nhắn HuyDev */}

      {userID !== userIDFromCookies && (
        <div className="flex w-[155px] items-end">
          {isHovered &&
          !(
            message &&
            message.hidden &&
            message.hidden.includes(localStorage.getItem("userID"))
          ) ? (
            <div>
              <div className="mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg bg-[#DDDBDB] p-1 px-2">
                <div
                  className="cursor-pointer  opacity-80 hover:opacity-100"
                  onClick={() => {
                    setOpenCompReplyInput(true);
                    setShareContent(message);
                    setParentIdMsg(message.messageID);
                    setUserIDReplyForCompReply(message.userID);
                  }}
                >
                  <img
                    src="/src/assets/icons/quotation-right-mark.png"
                    alt=""
                    className="mt-[2px] h-[13px] w-[13px]"
                  />
                </div>
                <div
                  onClick={() => {
                    setOpenDialog(true);
                    setShareContent(message);
                  }}
                  className="cursor-pointer px-[2px]  opacity-80 hover:opacity-100"
                >
                  <img src="/src/assets/reply.png" alt="" className="h-4 w-4" />
                </div>
                <a href="#" className=" opacity-80 hover:opacity-100">
                  <img src="/src/assets/todos.png" alt="" className="h-4 w-4" />
                </a>
                <div
                  onClick={handleClick}
                  className="cursor-pointer px-[2px]  opacity-80 hover:opacity-100"
                >
                  <img
                    src="/src/assets/option.png"
                    alt=""
                    className="h-4 w-4"
                  />
                </div>

                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  className="rounded-lg"
                >
                  <MenuItem
                    onClick={() => {
                      handleCopyMessage();
                      handleClose();
                    }}
                  >
                    <img
                      src="/src/assets/icons/copy.png"
                      alt=""
                      className="mr-3 h-4 w-4"
                    />
                    <span className="text-tblack">Copy tin nhắn</span>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <img
                      src="/src/assets/icons/push-pin.png"
                      alt=""
                      className="mr-3 h-4 w-4"
                    />
                    <span className="text-tblack">Ghim tin nhắn</span>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleHidenMessage(message.messageID);
                      setMessageDeletedID(message.messageID);
                    }}
                  >
                    <img
                      src="/src/assets/icons/delete.png"
                      alt=""
                      className="mr-3 h-4 w-4"
                    />
                    <span className=" text-red-600">Xoá chỉ ở phía tôi</span>
                  </MenuItem>
                </Menu>
              </div>
              {/* //huy5 */}
              {message.contents[0].key === "image" &&
                message.contents.length > 1 && <div className="h-[40px]"></div>}
              {message.contents[0].key === "image" &&
                message.contents.length == 1 && (
                  <div className="h-[40px]"></div>
                )}
            </div>
          ) : // <div className="mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg p-1 px-2"></div>
          null}
        </div>
      )}
    </div>
  );
};

export default MessageDetail;