import React from "react";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Cookies from "universal-cookie";
import { decryptData } from "../utils/cookies";
import axios from "axios";
import socketIOClient from "socket.io-client";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import MessageDetail from "./MessageDetail";
import MessageInput from "./MessageInput";
import TextField from "@mui/material/TextField";
import { v4 as uuidv4 } from "uuid";

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

// const sendMessageWithTextViaSocket = (textMessage) => {
//   const socket = socketIOClient(
//     "ws://localhost:8082/ws/chat/5b685d06-8fbe-4ab7-8053-7746760a8001",
//   );

//   socket.onopen = () => {
//     console.log("WebSocket connected successfully!");
//     socket.emit(
//       "message",
//       JSON.stringify({
//         id: "49a9768c-a2a8-0040-9653-5291b9718d11",
//         tcm: "TCM01",
//         userID: "26ce60d1-64b9-45d2-8053-7746760a8354",
//         userAvatar:
//           "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711636843/exftni5o9msptdxgukhk.png",
//         userName: "Tran Huy",
//         timestamp: new Date().toISOString(),
//         parentID: null,
//         contents: [
//           {
//             key: "text",
//             value: textMessage,
//           },
//         ],
//       }),
//     );
//   };

//   socket.onerror = (error) => {
//     console.error("WebSocket error:", error);
//   };

//   socket.onclose = () => {
//     console.log("WebSocket connection closed.");
//   };
// };

const Conversation = () => {
  const messagesEndRef = useRef(null);
  const cookies = new Cookies();
  const [tokenFromCookies, setTokenFromCookies] = useState("");
  // const params = useParams();
  // console.log("Params:", params);
  // const { id, type } = params;
  // console.log("ID:", id);
  // console.log("Type:", type);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { id } = queryString.parse(location.search);
  console.log("Chat ID:", id);
  const chatName = searchParams.get("chatName");
  const chatAvatar = searchParams.get("chatAvatar");
  // console.log("Chat Name:", chatName);
  // console.log("Chat Avatar:", chatAvatar);

  const [messages, setMessages] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(15);

  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [userIDFromCookies, setUserIDFromCookies] = useState("");
  const [flag, setFlag] = useState(false);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };
  console.log("Message:", message);

  // Hàm gửi tin nhắn qua WebSocket với nội dung là text từ input
  // const handleSendMessage = () => {
  //   if (message.trim() !== "") {
  //     console.log("Gửi tin nhắn:", message);
  //     sendMessageWithTextViaSocket(message);
  //     setMessage(""); // Xóa nội dung của input message sau khi gửi
  //   }
  // };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
      console.error("Enter key is pressed");
    }
  };

  // const handleSendMessage = (newMessage) => {
  //   // Xử lý logic gửi tin nhắn, có thể thêm tin nhắn mới vào danh sách messages
  //   // hoặc sử dụng một hàm callback để truyền tin nhắn lên component cha.
  //   console.log("Gửi tin nhắn:", newMessage);
  // };

  const fetchMessages = async (id, x, y, token) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/v1/chat/x-to-y?id=${id}&x=${x}&y=${y}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };

  // Hàm để lấy userID từ cookies và giải mã nó
  const getUserIDFromCookie = () => {
    // Lấy userID từ cookies
    const userIDFromCookie = cookies.get("userID");

    // Nếu có userID từ cookies, giải mã và trả về
    if (userIDFromCookie) {
      // const userIDDecrypted = decryptData(userIDFromCookie);
      return userIDFromCookie;
    }

    // Nếu không có userID từ cookies, trả về null
    return null;
  };

  useEffect(() => {
    // Gán giá trị lấy được từ cookies vào state userIDFromCookies
    const userID = getUserIDFromCookie();
    setUserIDFromCookies(userID);
    // Lấy token từ cookies và giải mã nó
    const tokenFromCookie = cookies.get("token");
    if (tokenFromCookie) {
      // const tokenDecrypted = decryptData(tokenFromCookie);
      setTokenFromCookies(tokenFromCookie);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMessages = await fetchMessages(
        id,
        startIndex,
        endIndex,
        tokenFromCookies,
      );
      setMessages(fetchedMessages);
    };
    const newSocket = new WebSocket(`ws://localhost:8082/ws/chat/${id}`);
    newSocket.onopen = () => {
      console.log("WebSocket connected >>>>>>>>HUy");
    };
    setSocket(newSocket);
    // return () => {
    //   newSocket.close();
    // };
    fetchData();
  }, [id, tokenFromCookies, message, flag]);

  const sendMessageWithTextViaSocket = (textMessage) => {
    if (socket) {
      const message = {
        id: uuidv4(),
        tcm: "TCM01",
        userID: userIDFromCookies || "26ce60d1-64b9-45d2-8053-7746760a8354",
        userAvatar:
          "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711636843/exftni5o9msptdxgukhk.png",
        userName: "Tran Huy",
        timestamp: new Date().toISOString(),
        parentID: null,
        contents: [
          {
            key: "text",
            value: textMessage,
          },
        ],
      };
      socket.send(JSON.stringify(message));
      setMessage(""); // Xóa nội dung của input message sau khi gửi
    } else {
      console.error("WebSocket is not initialized.");
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      console.log("Gửi tin nhắn:", message);
      sendMessageWithTextViaSocket(message);
      setMessage(""); // Xóa nội dung của input message sau khi gửi
    }
  };

  const loadMoreMessages = async () => {
    const newStartIndex = startIndex + 10;
    const newEndIndex = endIndex + 10;
    const moreMessages = await fetchMessages(
      id,
      newStartIndex,
      newEndIndex,
      tokenFromCookies,
    );
    setMessages((prevMessages) => [...moreMessages.reverse(), ...prevMessages]);
    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
  };

  // const loadOlderMessages = async () => {
  //   const newStartIndex = startIndex + 10;
  //   const newEndIndex = endIndex + 10;
  //   const moreMessages = await fetchMessages(
  //     id,
  //     newStartIndex,
  //     newEndIndex,
  //     tokenFromCookies,
  //   );
  //   // Đảo ngược danh sách tin nhắn mới và cập nhật state
  //   const reversedMoreMessages = moreMessages.reverse();
  //   setMessages((prevMessages) => [...reversedMoreMessages, ...prevMessages]);
  //   setStartIndex(newStartIndex);
  //   setEndIndex(newEndIndex);
  // };

  // const handleScroll = (e) => {
  //   const { scrollTop } = e.target;
  //   // Kiểm tra nếu người dùng cuộn đến đầu trang
  //   if (scrollTop === 0) {
  //     loadOlderMessages();
  //   }
  // };

  const [openPicker, setOpenPicker] = useState(false);

  // useEffect(() => {
  //   console.log("Socket:", socket);
  //   if (socket) {
  //     // Lắng nghe các tin nhắn mới từ socket
  //     socket.onmessage = async (event) => {
  //       const newMessage = JSON.parse(event.data);
  //       console.log("New message++++++++++++++++++++:", event);
  //       // Cập nhật tin nhắn mới vào state messages
  //       setMessages((messages) => [...messages, newMessage]);
  //     };

  //     // Ensure that the socket is closed when the component unmounts
  //     return () => {
  //       socket.onmessage = null;
  //     };
  //   }
  // }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = event.data;
        console.log("Received data:", data);
        try {
          const jsonData = JSON.parse(data);
          console.log("Received JSON data:", jsonData);
          // Kiểm tra xem tin nhắn không phải từ bạn
          const messageFromOtherUser = jsonData.userID !== userIDFromCookies;
          if (messageFromOtherUser) {
            // Kiểm tra xem tin nhắn đã tồn tại trong mảng messages chưa
            const messageExists = messages.some(
              (msg) => msg.id === jsonData.id,
            );
            if (!messageExists) {
              setMessages((prevMessages) => [...prevMessages, jsonData]);
            }
          }
        } catch (error) {
          console.error("Error parsing JSON data:", error);
        }
      };

      // Ensure that the socket is closed when the component unmounts
      return () => {
        socket.onmessage = null;
      };
    }
  }, [socket, messages, userIDFromCookies]);

  // Hàm cuộn xuống dưới cùng của khung chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Cuộn xuống dưới cùng mỗi khi danh sách tin nhắn thay đổi

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
                  src={chatAvatar}
                />
              </StyledBadge>
            </div>
            <div className="flex flex-col">
              <div className="text-lg font-medium text-[#081c36]">
                <span>{chatName}</span>
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
      <div
        className="h-[calc(100vh-174px)] w-full flex-1 overflow-auto bg-[#A4BEEB] p-4 pr-3"
        // onScroll={handleScroll}
      >
        {/* <Message sender="other" content="Xin chào!" timestamp="15:30" />
        <Message sender="me" content="Chào bạn!" timestamp="15:32" />
        Thêm tin nhắn khác ở đây */}
        {messages.map((message, index) => (
          <MessageDetail
            key={index}
            message={message}
            chatAvatar={chatAvatar}
          />
        ))}
        <div ref={messagesEndRef} />
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
          {/* <MessageInput
            onSendMessage={handleSendMessage}
            onKeySendMessage={handleKeyPress}
          /> */}
          <div
            className="flex w-full items-center bg-white"
            style={{ height: "58.5px" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              inputProps={{ style: { fontSize: 15 } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderTop: "1px solid",
                  borderBottom: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderColor: "#CFD6DC",
                  borderRadius: 2,
                },
                "& .MuiOutlinedInput-root:hover": {
                  borderTop: "1px solid",
                  borderBottom: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderRadius: 2,
                  borderColor: "blue",
                },
                "& .Mui-focused": {
                  borderTop: "1px solid",
                  borderBottom: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderRadius: 2,
                },
              }}
            />
            {/* <IconButton color="primary" onClick={handleSendMessage}>
        <SendIcon />
      </IconButton> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
