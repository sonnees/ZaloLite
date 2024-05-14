import React from "react";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
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
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import MessageDetail from "./MessageDetail";
import MessageInput from "./MessageInput";
import AvatarNameItemMessage from "./AvatarNameItemMessage";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { Tag } from "antd";
import { Select } from "antd";
import { v4 as uuidv4 } from "uuid";
import { Cloudinary } from "@cloudinary/url-gen";
import { set } from "date-fns";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import FileLinkInfor from "./FileLinkInfor";
import CreateGroup from "./models/CreateGroup";
import InforAccountdDialog from "./models/InfoAccountNew";
import CheckboxCss from "../assets/styles/checkbox.module.css";
import { check } from "prettier";
import {
  createTheme,
  ThemeProvider,
  alpha,
  getContrastRatio,
} from "@mui/material/styles";

// import {uploadFileToS3} from "../utils/savefiletoaws";

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

const theme = createTheme({
  palette: {
    silver: {
      main: "#eaedf0",
      light: "#F5EBFF",
      dark: "#eaedf0",
      contrastText: "#081c36",
    },
  },
});

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
  const [reloadCounter, setReloadCounter] = useState(0);
  const messagesEndRef = useRef(null);
  const cookies = new Cookies();

  const cld = new Cloudinary({ cloud: { cloudName: "djs0jhrpz" } });
  const [imageUrl, setImageUrl] = useState("");

  // Hàm xử lý khi chọn emoji từ picker
  const handleEmojiSelect = (emoji) => {
    // console.log("Emoji selected:", emoji);
    // Gửi emoji qua WebSocket
    sendMessageWithTextViaSocket(emoji, "emoji");
    // Đóng picker emoji sau khi chọn
    setOpenPicker(false);
  };

  const uploadFileToS3 = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.SERVICE_UPLOAD}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const responseData = await response.json();
      const fileUrl = responseData.fileUrl;

      console.log("File uploaded successfully. File URL:", fileUrl);

      // Tạo key cho file upload
      const fileExtension = file.name.split(".").pop(); // Lấy phần đuôi của file
      const fileSizeKB = Math.round(file.size / 1024); // Kích thước file tính bằng KB
      const key = `${fileExtension}|${file.name}|${fileSizeKB}KB`;

      // Gửi tin nhắn chứa link ảnh và key cho người nhận
      const imageMessage = {
        contents: [
          {
            key: key,
            value: fileUrl,
          },
        ],
      };
      sendMessageWithTextViaSocket(imageMessage, "file");
      console.log("Image message:", imageMessage);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Xử lý lỗi ở đây
      throw error;
    }
  };

  const uploadMultiImageToS3 = async (files) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${process.env.SERVICE_UPLOAD}`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Failed to upload file");
        }
        const responseData = await response.json();
        return responseData.fileUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);
      const imageMessageArray = imageUrls.map((url) => ({
        key: "image",
        value: url,
      }));

      console.log("Image message END:", typeof imageMessageArray);
      console.log("Image message END:", Array.isArray(imageMessageArray));
      console.log("Image message END:", imageMessageArray);
      sendMessageWithTextViaSocket(imageMessageArray, "multiImage");
    } catch (error) {
      console.error("Error uploading file:", error);
      // Xử lý lỗi ở đây
    }
  };

  const handleFileUpload = (file) => {
    const preset_key = "huydev09";
    const cloud_name = "djs0jhrpz";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset_key);
    console.log("Uploading file to Cloudinary...");

    axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData,
      )
      .then((response) => {
        console.log(
          "Upload Complete! | Uploaded image URL:",
          response.data.secure_url,
        );
        setImageUrl(response.data.secure_url);

        // Gửi tin nhắn chứa link ảnh và key cho người nhận
        const imageMessage = {
          contents: [
            {
              key: "image",
              value: response.data.secure_url,
            },
          ],
        };
        console.log("Image message:", imageMessage);
        sendMessageWithTextViaSocket(imageMessage, "file");
      })
      .catch((error) => {
        console.error("Error uploading file to Cloudinary:", error);
      });
  };

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageSelection2 = (e) => {
    const file = e.target.files;
    // if (file) {
    //   handleFileUpload(file);
    //   setContentType("image");
    // }
    const files = Array.from(file);
    if (files && files.length > 0) {
      console.log("Files:", files.toString());
    }
    uploadMultiImageToS3(files);
  };

  // // Hàm xử lý khi người dùng chọn file
  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   // console.log("Selected file:", selectedFile);
  //   if (selectedFile) {
  //     handleFileUpload(selectedFile);
  //   }
  // };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // handleFileUpload(selectedFile);
      uploadFileToS3(selectedFile);
      // Đặt loại nội dung là file
      setContentType("file");
    }
  };

  const handleVideoChange = (event) => {
    const selectedVideo = event.target.files[0];
    if (selectedVideo) {
      // handleFileUpload(selectedFile);
      uploadFileToS3(selectedVideo);
      // Đặt loại nội dung là file
      setContentType("mp4");
    }
  };

  const [tokenFromCookies, setTokenFromCookies] = useState("");
  // const params = useParams();
  // console.log("Params:", params);
  // const { id, type } = params;
  // console.log("ID:", id);
  // console.log("Type:", type);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { id } = queryString.parse(location.search);
  const chatName = searchParams.get("chatName");
  const chatAvatar = searchParams.get("chatAvatar");

  const [chatType, setChatType] = useState("");

  // const [conservation, setConservation] = useState(localStorage.getItem("conservations"));

  useEffect(() => {
    const conservation = JSON.parse(localStorage.getItem("conversations"));
    const filteredConversations = conservation.filter(
      (chat) => chat.chatName === chatName,
    );
    // console.log("filteredConversations", filteredConversations);
    // setConservationFriend(filteredConversations);
    if (filteredConversations.length > 0) {
      setChatType(filteredConversations[0].type);
    }
  }, [JSON.parse(localStorage.getItem("conversations"))]);

  const [messages, setMessages] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(50);

  const [message, setMessage] = useState("");
  const [contentType, setContentType] = useState("text"); // Mặc định là gửi tin nhắn text
  const [keyTypeMessage, setKeyTypeMessage] = useState("text");
  const [socket, setSocket] = useState(null);
  const [userIDFromCookies, setUserIDFromCookies] = useState("");
  const [flag, setFlag] = useState(false);

  const [sentMessage, setSentMessage] = useState(null);
  const [messageRecalledID, setMessageRecalledID] = useState(null);
  const [messageDeletedID, setMessageDeletedID] = useState(null);
  const [idA, setIdA] = useState(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setContentType("text");
    if (e.target.value === "") {
      setDisplayComposingMessage(false);
    }
  };
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
    }
  };

  const fetchMessages = async (id, x, y, token, timestamp) => {
    // console.table({ id, x, y, token });
    try {
      const response = await axios.get(
        `${process.env.HOST}/api/v1/chat/x-to-y?id=${id}&x=${x}&y=${y}&timestamp=${timestamp}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log("Data:", response.data);
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const fetchedMessages = await fetchMessages(
  //       id,
  //       startIndex,
  //       endIndex,
  //       tokenFromCookies,
  //     );
  //     setMessages(fetchedMessages);
  //   };
  //   const newSocket = new WebSocket(`ws://localhost:8082/ws/chat/${id}`);
  //   newSocket.onopen = () => {
  //     // console.log("WebSocket connected >>>>>>>>HUy");
  //   };
  //   setSocket(newSocket);
  //   // return () => {
  //   //   newSocket.close();
  //   // };
  //   if (id && tokenFromCookies) fetchData();
  // }, [id, tokenFromCookies, message, startIndex, endIndex]);
  useEffect(() => {
    const fetchData = async () => {
      const timestamp = Date.now();
      const fetchedMessages = await fetchMessages(
        id,
        startIndex,
        endIndex,
        tokenFromCookies,
        timestamp,
      );
      const messagesNoHandle = fetchedMessages;

      // Tạo một bản đồ (map) giữa messageID và object message
      const messageMap = new Map(
        messagesNoHandle.map((message) => [message.messageID, message]),
      );

      // Lặp qua mỗi message để thay thế parentID bằng object message tương ứng
      messagesNoHandle.forEach((message) => {
        if (message.parentID) {
          const parentMessage = messageMap.get(message.parentID);
          if (parentMessage) {
            message.parentID = parentMessage;
          }
        }
      });
      // console.log("MessagesNoHandle:", messagesNoHandle);
      setMessages(messagesNoHandle);
    };
    const newSocket = new WebSocket(`${process.env.SOCKET_CHAT}/ws/chat/${id}`);
    newSocket.onopen = () => {
      // console.log("WebSocket connected >>>>>>>>HUy");
    };
    setSocket(newSocket);

    if (id && tokenFromCookies) fetchData();

    // return () => {
    //   // if (newSocket.readyState === 1)
    //   newSocket.close();
    // };
  }, [reloadCounter, id, tokenFromCookies, startIndex, endIndex]);

  // useEffect để chạy lại fetchData khi id hoặc tokenFromCookies thay đổi
  useEffect(() => {
    if (id && tokenFromCookies) {
      setReloadCounter((prevCounter) => prevCounter + 1);
    }
  }, []);

  const [parentIdMsg, setParentIdMsg] = useState("");
  // console.log("parentIdMsg:", parentIdMsg);

  const sendMessageWithTextViaSocket = (
    messageContent,
    contentType,
    socketNew,
    messageForward,
    parentID,
  ) => {
    // console.log("Running")
    // console.log("SocketNew:", socketNew);
    // console.log("parentID:", parentID);
    const uuid = uuidv4();
    // Lấy thời gian hiện tại dưới dạng timestamp
    const currentTime = new Date().getTime();
    // Tạo UUID có định dạng mong muốn
    const formattedUUID = `${uuid.slice(0, 8)}-${uuid.slice(
      9,
      13,
    )}-${uuid.slice(14, 18)}-${uuid.slice(19, 23)}-${currentTime}`;
    if (socket) {
      const message = {
        id: uuidv4(formattedUUID),
        tcm: "TCM01",
        userID: userIDFromCookies,
        userAvatar: localStorage.getItem("avatar"),
        userName: localStorage.getItem("userName"),
        timestamp: new Date().toISOString(),
        parentID: null,
        contents: [],
      };
      if (parentID) {
        message.parentID = parentID;
        setOpenCompReplyInput(false);
      }
      if (messageForward) {
        message.contents = messageForward;
      } else {
        // Thêm nội dung tương ứng vào tin nhắn
        if (contentType === "text") {
          message.contents.push({
            key: "text",
            value: messageContent,
          });
        } else if (contentType === "file") {
          // Lấy phần tử đầu tiên trong mảng contents
          const fileContent = messageContent.contents[0];
          message.contents.push({
            key: fileContent.key,
            value: fileContent.value, // Đây là đường dẫn URL của file
          });
        } else if (contentType === "emoji") {
          message.contents.push({
            key: "emoji",
            value: messageContent,
          });
        } else if (contentType === "link") {
          message.contents.push({
            key: "link",
            value: messageContent,
          });
        } else if (contentType === "multiImage") {
          console.log("MessageContent>>>>>>>>>>>>>>:", messageContent);
          const clonedContent = messageContent.map((element) => ({
            ...element,
          }));
          clonedContent.forEach((element) => {
            message.contents.push({
              key: "image",
              value: element.value,
            });
          });
        }
      }
      console.log("Message:", message);

      if (socketNew) {
        console.log("WebSocketNew connected");
        if (message.contents.length > 0)
          socketNew.send(JSON.stringify(message));
        else console.log("No content to send");
      } else {
        // console.log("WebSocket connected");
        setMessage(""); // Xóa nội dung của input message sau khi gửi
        setSentMessage(message); // Cập nhật state của sentMessage
        if (message.contents.length > 0) socket.send(JSON.stringify(message));
        else console.log("No content to send");
        console.log(message);
      }
    } else {
      console.error("WebSocket is not initialized.");
    }
  };

  // const handleSendMessage = () => {
  //   if (message.trim() !== "") {
  //     console.log("Gửi tin nhắn:", message);
  //     sendMessageWithTextViaSocket(message);
  //     setMessage(""); // Xóa nội dung của input message sau khi gửi
  //   }
  // };

  const handleSendMessage = () => {
    if (message.startsWith("http://") || message.startsWith("https://")) {
      setKeyTypeMessage("link");
      sendMessageWithTextViaSocket(message, "link", null, null, parentIdMsg);
    } else if (contentType === "text" && message.trim() !== "") {
      console.log("Gửi tin nhắn:", message);
      sendMessageWithTextViaSocket(message, "text", null, null, parentIdMsg);
    } else if (contentType === "file" && imageUrl) {
      console.log("Gửi file:", imageUrl);
      sendMessageWithTextViaSocket(imageUrl, "file", null, null, parentIdMsg);
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

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = event.data;
        // console.log("Received data CONSERVATION:", data);
        // console.table({ messageDeletedID, messageRecalledID });
        try {
          if (data && data.startsWith("{")) {
            const jsonData = JSON.parse(data);
            console.log("Received JSON data CONSERVATION:", jsonData);
            // Kiểm tra xem tin nhắn không phải từ bạn
            const messageFromOtherUser = jsonData.userID !== userIDFromCookies;
            // console.log("Message from other user: ==========================================", messageFromOtherUser);
            if (
              jsonData.tcm === "TCM01" &&
              messageFromOtherUser &&
              jsonData.contents
            ) {
              // console.log("Message____________________:", messages);
              setIdA(jsonData.id);
              if (jsonData) {
                // Kiểm tra xem tin nhắn đã tồn tại trong mảng messages chưa
                const messageExists = messages.some(
                  (msg) => msg.id === jsonData.id,
                );
                if (!messageExists) {
                  // setMessages((prevMessages) => [...prevMessages, jsonData]);
                  // Tạo một bản đồ (map) giữa messageID và object message
                  const messageMap = new Map(
                    messages.map((message) => [message.messageID, message]),
                  );
                  const parentMessage = messageMap.get(jsonData.parentID);
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      messageID: jsonData.id,
                      userID: jsonData.userID,
                      userAvatar: jsonData.userAvatar,
                      userName: jsonData.userName,
                      timestamp: jsonData.timestamp,
                      contents: jsonData.contents,
                      parentID: parentMessage,
                      hiddens: [],
                      recall: false,
                    },
                  ]);
                  console.log("Run");
                  console.log("Message____________________:", messages);
                }
              }
            }
            if (jsonData.tcm === "TCM05") {
              const messageIDToRecall = jsonData.messageID;
              const updatedMessages = messages.map((msg) => {
                if (
                  msg.messageID === messageIDToRecall ||
                  msg.id === messageIDToRecall
                ) {
                  // Thay đổi nội dung của tin nhắn thành "Tin nhắn đã được thu hồi"
                  return {
                    ...msg,
                    contents: [
                      { key: "text", value: "Tin nhắn đã được thu hồi" },
                    ],
                    recall: true, // Có thể đánh dấu tin nhắn này đã được thu hồi
                  };
                }
                return msg;
              });
              setMessages(updatedMessages);
            }

            // Recall One Side
            if (
              jsonData.tcm === "TCM00" &&
              messageDeletedID &&
              jsonData.typeNotify === "SUCCESS"
            ) {
              const messageIDToDelete = messageDeletedID;
              // Lọc ra các tin nhắn mà không có messageIDToDelete
              const updatedMessages = messages.filter(
                (msg) => msg.messageID !== messageIDToDelete,
              );
              setMessageDeletedID("");
              setMessages(updatedMessages);
              console.log("Updated messages after deleting:", updatedMessages);
            }

            if (
              jsonData.tcm === "TCM00" &&
              messageRecalledID &&
              jsonData.typeNotify === "SUCCESS"
            ) {
              console.log(
                "Recall message successfully>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
              );
              // const messageIDToDelete = messageRecalledID;
              // // Lọc ra các tin nhắn mà không có messageIDToDelete
              // const updatedMessages = messages.filter(
              //   (msg) => msg.messageID !== messageIDToDelete,
              // );
              // // setMessageRecalledID("");
              // // setMessageDeletedID("");
              // setMessages(updatedMessages);
              // console.log("Updated messages after deleting:", updatedMessages);

              const messageIDToRecall = messageRecalledID;
              const updatedMessages = messages.map((msg) => {
                if (
                  msg.messageID === messageIDToRecall ||
                  msg.id === messageIDToRecall
                ) {
                  // Thay đổi nội dung của tin nhắn thành "Tin nhắn đã được thu hồi"
                  return {
                    ...msg,
                    contents: [
                      { key: "text", value: "Tin nhắn đã được thu hồi" },
                    ],
                    recall: true, // Có thể đánh dấu tin nhắn này đã được thu hồi
                  };
                }
                return msg;
              });
              setMessageRecalledID("");
              setMessages(updatedMessages);
            }
          }
          // console.log("Message ++++++++++", messages);
        } catch (error) {
          console.error("Error parsing JSON data:", error);
        }
      };

      // Ensure that the socket is closed when the component unmounts
      return () => {
        socket.onmessage = null;
      };
    }
  }, [
    socket,
    messages,
    userIDFromCookies,
    messageDeletedID,
    messageRecalledID,
  ]);

  // console.log("Messages:", messages);

  // Hàm cuộn xuống dưới cùng của khung chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Cuộn xuống dưới cùng mỗi khi danh sách tin nhắn thay đổi

  useEffect(() => {
    if (sentMessage) {
      scrollToBottom();
      // setMessages((prevMessages) => [...prevMessages, sentMessage]); huyy
      console.log("Sent message:", sentMessage);
      // Tạo một bản đồ (map) giữa messageID và object message
      const messageMap = new Map(
        messages.map((message) => [message.messageID, message]),
      );
      const parentMessage = messageMap.get(sentMessage.parentID);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          messageID: sentMessage.id,
          userID: sentMessage.userID,
          userAvatar: sentMessage.userAvatar,
          userName: sentMessage.userName,
          timestamp: sentMessage.timestamp,
          contents: sentMessage.contents,
          parentID: parentMessage,
          hiddens: [],
          recall: false,
        },
      ]);
      setSentMessage(null); // Đặt lại giá trị của sentMessage về null sau khi cập nhật tin nhắn
    }
  }, [sentMessage]);

  // console.log(messages);

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [contact, setContact] = useState([]);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(
          `${process.env.HOST}/api/v1/user/info/${userIDFromCookies}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tokenFromCookies,
            },
            method: "GET",
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        const contact = data.conversations;
        const chatID = searchParams.get("id");
        // console.log("ChatID:", chatID);
        setContact(contact.filter((c) => c.chatID !== chatID));
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    // Chỉ fetch nếu userID và token đã được thiết lập
    if (userIDFromCookies && tokenFromCookies) {
      fetchContact();
    }
  }, [userIDFromCookies, tokenFromCookies]);
  // console.log("Contact:", contact);

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedContactObjs, setSelectedContactObjs] = useState([]);
  const [shareContent, setShareContent] = useState("");
  const [typeShareContent, setTypeShareContent] = useState("text");
  const [inputValueShare, setInputValueShare] = useState("");
  const handleInputShareChange = (event) => {
    setInputValueShare(event.target.value);
  };

  const handleCheckboxChange = (event, id, name, obj) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedContacts((prevSelected) => [...prevSelected, id]);
      setSelectedContactObjs((prevNames) => [...prevNames, obj]);
    } else {
      setSelectedContacts((prevSelected) =>
        prevSelected.filter((contactId) => contactId !== id),
      );
      setSelectedContactObjs((prevNames) =>
        prevNames.filter((item) => item.chatID !== obj.chatID),
      );
    }
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

  const renderContent = (contents) => {
    if (contents && contents.length > 0) {
      return contents.map((content, index) => {
        // console.log("Content:", content);
        if (content.key === "image") {
          return "[Hình ảnh]";
        } else if (content.key === "text") {
          return content.value;
        } else if (content.key === "link") {
          return <span key={index}>{content.value}</span>;
        } else if (
          content.key.startsWith("zip") ||
          content.key.startsWith("pdf") ||
          content.key.startsWith("xlsx")
        ) {
          const [fileLabel, fileName, fileSize] = content.key.split("|");
          return <></>;
        } else if (content.key === "mp4") {
          return (
            <video key={index} controls className="h-auto max-w-[200px]">
              <source src={content.value} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        } else if (content.key === "emoji") {
          return <p key={index}>{content.value}</p>;
        }
        // return null;
      });
    }
  };
  // console.log("shareContent++++++++++++", shareContent.contents);
  // console.log("selectedContactObjs>>>>>>>>>>>>>>>", selectedContactObjs);

  const handleShareMessage = () => {
    if (shareContent && selectedContactObjs) {
      for (const obj of selectedContactObjs) {
        const newSocket = new WebSocket(
          `${process.env.SOCKET_CHAT}/ws/chat/${obj.chatID}`,
        );
        newSocket.onopen = () => {
          // console.log("newSocket:", newSocket);
          console.log("Gửi tin nhắn:", shareContent);
          sendMessageWithTextViaSocket(
            "",
            "",
            newSocket,
            shareContent.contents,
          );
          setInputValueShare("");
          setSelectedContacts([]);
          setSelectedContactObjs([]);
        };
      }
    }
  };

  const handleInputChangeInDialog = (e) => {
    // setShareContent(e.target.value);
    // setTypeShareContent("text");
  };

  const [openCompReplyInput, setOpenCompReplyInput] = useState(false);
  const [userIDReplyForCompReply, setUserIDReplyForCompReply] = useState("");
  const [openSearchMessage, setOpenSearchMessage] = useState(false);
  useEffect(() => {
    scrollToBottom();
  }, [openCompReplyInput]);

  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    if (openCompReplyInput) {
      focusInput();
    }
  }, [openCompReplyInput]);

  const handleKeyPressTextArea = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      // Gửi tin nhắn hoặc thực hiện logic của bạn khi Enter được nhấn
      handleSendMessage();
      // console.log("Enter pressed");
    }
  };

  const handleSearchMessage = (value) => {
    setOpenSearchMessage(value);
  };

  const [text1, setText1] = useState("Nhập nội dung cần tìm trong hội thoại");
  const [resultSearch, setResultSearch] = useState([]);

  const handleSearchMessageInConservation = (value) => {
    if (value.trim() === "") {
      setText1("Nhập nội dung cần tìm trong hội thoại");
    } else {
      setText1("Danh sách kết quả phù hợp trong hội thoại");

      const fetchSearchMsg = async () => {
        try {
          const response = await fetch(
            `${
              process.env.HOST
            }/api/v1/chat/search-bkw?chatID=${searchParams.get(
              "id",
            )}&y=20&key=${value}`,
            {
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenFromCookies,
              },
              method: "GET",
            },
          );
          if (!response.ok) {
            throw new Error("Failed to search message in conversations");
          }
          const data = await response.json();
          console.log("SearchMsg:", data);
          setResultSearch(data);
        } catch (error) {
          console.error(
            "Error fetching search message in conversations:",
            error,
          );
        }
      };
      if (value) fetchSearchMsg();
      console.log("Value:", value);
    }
  };
  const messageElementRef = useRef(null);
  const [messageIDRef, setMessageIDRef] = useState();

  // Sử dụng useEffect để cuộn đến phần tử tin nhắn khi danh sách được cập nhật
  useEffect(() => {
    // Kiểm tra xem messageID đã được xác định chưa
    if (messageIDRef) {
      // Tìm vị trí của tin nhắn với messageID trong danh sách
      const messageIndex = messages.findIndex(
        (message) => message.messageID === messageIDRef,
      );
      console.log("messageIDRef:", messageIDRef);
      messageElementRef.current = document.getElementById("messageIDRef");
      // Nếu tin nhắn được tìm thấy, cuộn đến vị trí của nó
      // if (messageIndex !== -1) {
      messageElementRef.current?.scrollIntoView({ behavior: "smooth" });
      // }
    }
  }, [messages, messageIDRef]);

  // console.log("Conversation:", messages)

  const [displayComposingMessage, setDisplayComposingMessage] = useState(false);
  const [socketSent, setSocketSent] = useState(false);

  useEffect(() => {
    const newSocket = new WebSocket(`${process.env.SOCKET_CHAT}/ws/chat/${id}`);
    newSocket.onopen = () => {
      // console.log("WebSocket connected >>>>>>>>HUy");
    };
    newSocket.onmessage = (event) => {
      if (event.data.startsWith("{")) {
        const jsonData = JSON.parse(event.data);
        // console.log("Received data CONSERVATION line 1015:", jsonData);
        // const data = event.data;
        // console.log("Received data CONSERVATION:", jsonData);
        // console.log("SenderName:", jsonData.senderName);
        // console.log("UserName:", localStorage.getItem("userName"));
        if (
          jsonData.tcm === "TCM06" &&
          jsonData.senderName !== localStorage.getItem("userName") &&
          jsonData.chatID === id
        ) {
          setDisplayComposingMessage(true);
        } else if (jsonData.tcm === "TCM06" && jsonData.chatID === "off") {
          setDisplayComposingMessage(false);
        }
      }
    };
  }, [id]);

  useEffect(() => {
    if (socket) {
      const messageSend = {
        id: uuidv4(),
        tcm: "TCM06",
        chatID: id,
        senderName: localStorage.getItem("userName"),
      };
      if (message !== "" && !socketSent) {
        socket.send(JSON.stringify(messageSend));
        setSocketSent(true);
      } else if (message == "") {
        setDisplayComposingMessage(false);
        setSocketSent(false);
        socket.send(
          JSON.stringify({
            id: uuidv4(),
            tcm: "TCM06",
            chatID: "off",
            senderName: localStorage.getItem("userName"),
          }),
        );
      }
    }
  }, [message, socketSent]);

  const handleKeyDown = (event) => {
    if (event.key === " ") {
      console.log("Space bar pressed.");
      // Your socket sending logic here
    }
  };

  const [openRightBar, setOpenRightBar] = useState(false);
  const [listImage, setListImage] = useState([]);
  const [listFile, setListFile] = useState([]);
  const [listLink, setListLink] = useState([]);

  const handleClickRightBar = () => {
    console.log("Click");
    setOpenRightBar(!openRightBar);
    const imageMessages = messages.filter(
      (message) =>
        message.contents.some((content) => content.key === "image") &&
        message.hidden.length === 0 &&
        message.recall === false,
    );
    setListImage(imageMessages);

    const linkMessages = messages.filter((message) => {
      return message.contents.some((content) => content.key === "link");
    });
    // Lọc ra các tin nhắn thỏa mãn các điều kiện
    // const filteredMessages = messages.filter((message) => {
    //   return (
    //     message.contents.some((content) => content.key === "link") && // có key là 'link'
    //     message.hidden.length === 0 && // hidden.length = 0
    //     message.recall === false // recall là false
    //   );
    // });

    setListLink(linkMessages);

    const fileMessages = messages.filter((message) => {
      return message.contents.some((content) => {
        // Kiểm tra xem khóa của nội dung có chứa ít nhất hai dấu "|" không
        return (content.key.match(/\|/g) || []).length >= 2;
      });
    });
    setListFile(fileMessages);
    console.log("linkMessages:", linkMessages);
    // console.log("ListImage:", imageMessages);
    console.log("ListImage:", messages);
  };

  // console.log("listLink:", listLink);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" : ""}${day}/${
      month < 10 ? "0" : ""
    }${month}/${year}`;
  }

  const [openNotification, setOpenNotification] = useState(false);
  const handleClickNotification = () => {
    setOpenNotification(!openNotification);
  };

  const [userIDGeust, setUserIDGuest] = useState("");
  const [forceRender, setForceRender] = useState(false);
  const handleSearchUserIDGuest = () => {
    const otherUserID = messages.find(
      (message) => message.userID !== userIDFromCookies && message.userID,
    )?.userID;
    setUserIDGuest(otherUserID);
    setForceRender((prevState) => !prevState);
    console.log("OtherUserID:", otherUserID);
  };

  const [statusF, setStatusF] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files && files.length > 0) {
      console.log("Files:", files.toString());
    }
    uploadMultiImageToS3(files);
  };

  const handleImageSelection = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // console.log("Files:", files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className="flex w-[580px] items-center justify-between border-[2px] p-2">
            <span className="pl-2 text-base font-medium text-tblack">
              Chia sẻ
            </span>
            <Button onClick={handleCloseDialog} style={{ color: "#000000" }}>
              <CloseIcon />
            </Button>
          </div>
          <div className="w-full px-4 pt-2">
            <div className="flex-col items-center border-b-[2px] pb-3">
              <div
                className={`flex items-center ${
                  true ? "border border-[#EBEDF0]" : "border"
                } m-2 rounded-full p-2`}
              >
                <FontAwesomeIcon
                  className="w-3 px-2 "
                  icon={faMagnifyingGlass}
                />
                {/* <img src="../assets/icons/search-dialog.png" alt="" className="border-2"  /> */}
                <input
                  // onFocus={handleFocusPhoneClick}
                  // onBlur={handleBlurPhoneClick}
                  onChange={(event) => {
                    // setTFPhoneNumber(event.target.value);
                  }}
                  className="w-full text-sm font-normal focus:outline-none"
                  type="text"
                  placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
                />
              </div>
              <Stack direction="row" spacing={1} className="m-2 mt-3">
                <Chip
                  label="Tất cả"
                  color="primary"
                  component="a"
                  href="#basic-chip"
                  clickable
                  sx={{ fontSize: "13px", height: "24px" }}
                />
                <Chip
                  label="Khách hàng"
                  component="a"
                  href="#basic-chip"
                  clickable
                  sx={{ fontSize: "13px", height: "24px" }}
                />
                <Chip
                  label="Gia đình"
                  component="a"
                  href="#basic-chip"
                  clickable
                  sx={{ fontSize: "13px", height: "24px" }}
                />
                <Chip
                  label="Công việc"
                  component="a"
                  href="#basic-chip"
                  clickable
                  sx={{ fontSize: "13px", height: "24px" }}
                />
                <Chip
                  label="Bạn bè"
                  component="a"
                  href="#basic-chip"
                  clickable
                  sx={{ fontSize: "13px", height: "24px" }}
                />
                <Chip
                  label="Trả lời sau"
                  component="a"
                  href="#basic-chip"
                  clickable
                  sx={{ fontSize: "13px", height: "24px" }}
                />
              </Stack>
            </div>
            <div className={`flex overflow-hidden`}>
              <div
                id="alert-dialog-description"
                className={`max-h-[490px] w-full overflow-y-auto ${
                  selectedContactObjs.length > 0 ? " w-7/12 " : ""
                }`}
              >
                <div className={`w-full `}>
                  {contact.map((item, index) => (
                    <div key={index} className="flex items-center p-2">
                      {/* Checkbox */}
                      {/* <input
                      type="checkbox"
                      value={item.chatID}
                      checked={selectedContacts.includes(item.chatID)}
                      onChange={(event) =>
                        handleCheckboxChange(event, item.chatID, item.chatName)
                      }
                      className="mr-2"
                    /> */}
                      <div className="mr-2">
                        <label className={CheckboxCss.checkboxcontainer}>
                          <input
                            type="checkbox"
                            value={item.chatID}
                            checked={selectedContacts.includes(item.chatID)}
                            onChange={(event) =>
                              handleCheckboxChange(
                                event,
                                item.chatID,
                                item.chatName,
                                item,
                              )
                            }
                            className={CheckboxCss.input}
                          />
                          <span className={CheckboxCss.checkmark}></span>
                        </label>
                      </div>
                      {/* Avatar */}
                      <Avatar
                        sx={{ width: 40, height: 40 }}
                        alt="Name"
                        src={item.chatAvatar}
                      />
                      {/* Tên */}
                      <div className="ml-2 flex flex-col">
                        <div className="text-lg font-medium text-[#081c36]">
                          <span className="text-sm">{item.chatName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Danh sách những mục đã được chọn */}
              {selectedContactObjs.length > 0 && (
                <div className="my-3 ml-3 mt-4 w-5/12 rounded-md border-2 pl-3 pt-3 transition-transform duration-300 ease-in-out">
                  <h2 className="text-sm font-semibold ">
                    Đã chọn:&nbsp;
                    <span className="rounded-md bg-[#E7EFFD] px-2 py-1 text-xs font-semibold text-[#406CD6]">
                      {selectedContactObjs.length}/100
                    </span>
                  </h2>
                  <div className="mt-2">
                    {selectedContactObjs.map((item, index) => (
                      <div
                        key={index}
                        className="mb-[6px] mr-3 flex h-[32px] items-center rounded-[30px] border bg-[#E7EFFD] p-1"
                      >
                        <Avatar
                          sx={{ width: 24, height: 24 }}
                          alt="Name"
                          src={item.chatAvatar}
                        />
                        <div className="ml-2 flex w-[115px] flex-col">
                          <div className="text-sm text-[#406CD6]">
                            <span className="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
                              {item.chatName}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full border-t-[2px] px-4">
            <div className="flex-col items-center  py-3">
              <div>
                <span className="text-sm text-tblack">Nội dung chia sẻ</span>
              </div>
              <div
                className={`mt-3 flex
                items-center border border-[#EBEDF0] bg-[#F9FAFB] p-2`}
              >
                {typeShareContent === "text" && (
                  <input
                    // value={inputValueShare}
                    onChange={handleInputChangeInDialog}
                    value={renderContent(shareContent.contents)}
                    className="w-full bg-[#F9FAFB] text-sm font-normal focus:outline-none"
                    type="text"
                    placeholder=""
                  />
                )}
              </div>
            </div>
          </div>
          <DialogActions className="border p-4">
            <div className="py-1">
              <Button
                onClick={handleCloseDialog}
                variant="contained"
                color="silver"
                style={{
                  textTransform: "none",
                  color: "#081c36",
                  fontSize: 16,
                  fontWeight: 500,
                  marginRight: 10,
                }}
              >
                Huỷ
              </Button>
              <Button
                onClick={() => {
                  handleShareMessage();
                  handleCloseDialog();
                }}
                variant="contained"
                color="primary"
                style={{
                  textTransform: "none",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 500,
                  marginRight: 10,
                }}
              >
                Chia sẻ
              </Button>
            </div>
          </DialogActions>
        </Dialog>
        {openSearchMessage && (
          <div className="absolute z-10 -ml-[345px] h-screen w-[345px] overflow-y-auto bg-white">
            <div className="flex h-screen w-full grid-flow-col">
              <div className="w-full flex-1 pb-[14px] ">
                <div className="w-full flex-1 ">
                  <div className="h-full w-full flex-1 flex-col ">
                    <div className="w-full flex-1 flex-col ">
                      {text1 === "Nhập nội dung cần tìm trong hội thoại" ? (
                        <>
                          <div className="w-full flex-1 px-3 pt-4 text-tblack">
                            <div>
                              <span className="text-base font-medium text-tblack">
                                Kết quả tìm kiếm
                              </span>
                            </div>
                            <div className="mt-1">
                              <span className="text-sm font-light">
                                {text1}
                              </span>
                            </div>
                          </div>
                          <div className="px-[80px] pb-8 pt-[80px]">
                            <img
                              src="/search-empty.a19dba60677c95d6539d26d2dc363e4e.png"
                              alt=""
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="fixed z-20 w-[336px] flex-1 bg-white px-3 pb-[14px] pt-[17px] text-tblack ">
                            <div>
                              <span className="text-base font-medium text-tblack">
                                Kết quả tìm kiếm
                              </span>
                            </div>
                            <div className="mt-1">
                              <span className="text-sm font-light">
                                {text1}
                              </span>
                            </div>
                          </div>
                          <div className="border pt-[71px]">
                            <div className="mt-[13px] pl-3">
                              <span className="text-sm font-medium text-[#7589A3]">
                                Tin nhắn
                              </span>
                            </div>
                            {resultSearch.map((item, index) => (
                              <AvatarNameItemMessage
                                key={index}
                                item={item}
                                chatName={chatName}
                                setConversation={setMessages}
                                setMessageIDRef={setMessageIDRef}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex h-screen w-full ">
          <div className="border-1 h-screen w-full border-blue-700">
            {/* huy1 */}
            <div className="h-[68px] w-full px-4">
              <div className="flex h-full w-full flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-x-2">
                  <Link to="/app" className="md:hidden">
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className="pl-1 pr-3"
                    />
                  </Link>

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
                      {chatType === "FRIEND" ? (
                        <span>Vừa truy cập</span>
                      ) : statusF === "Vừa đồng ý kết bạn với bạn" ? (
                        <span>Vừa truy cập</span>
                      ) : (
                        <div className="flex h-[18px] w-16 items-center justify-center rounded-xl bg-[#B1B5B9] text-[10px]">
                          <span className="text-white">NGƯỜI LẠ</span>
                        </div>
                      )}
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
                  <div
                    className="cursor-pointer p-2"
                    onClick={() => {
                      handleSearchMessage(!openSearchMessage);
                      // setOpenCompReplyInput(false);
                    }}
                  >
                    <img
                      src="/src/assets/mini-search.png"
                      alt=""
                      className="m-1 h-4 w-4"
                    />
                  </div>
                  <Link to="/videocall" className="p-2">
                    <img
                      src="/src/assets/video.png"
                      alt=""
                      className="m-1 h-5 w-5"
                    />
                  </Link>
                  <div
                    onClick={() => {
                      handleClickRightBar();
                    }}
                    className="cursor-pointer p-2"
                  >
                    <img
                      src="/src/assets/right-bar.png"
                      alt=""
                      className="m-1 h-4 w-4"
                    />
                  </div>
                </div>
              </div>
            </div>

            {openSearchMessage && (
              <div className="absolute z-10 h-[83px] w-[calc(100vw-410px)] border-t bg-white">
                <div className="bt-[6px] h-full w-full flex-1 px-4 pb-2 ">
                  <div className="flex w-full items-center">
                    <div
                      className={`flex items-center ${
                        true ? "border border-[#EAEDF0]" : "border"
                      } m-2 h-[25px] w-full rounded-full bg-[#EAEDF0] p-[2px]`}
                    >
                      <FontAwesomeIcon
                        className="w-3 px-2"
                        icon={faMagnifyingGlass}
                        style={{ color: "#7988A1" }}
                      />
                      {/* <img src="../assets/icons/search-dialog.png" alt="" className="border-2"  /> */}
                      <input
                        // onFocus={handleFocusPhoneClick}
                        // onBlur={handleBlurPhoneClick}
                        autoFocus
                        onChange={(event) => {
                          handleSearchMessageInConservation(event.target.value);
                        }}
                        className="w-full bg-[#EAEDF0] text-[14px] font-normal text-[##7988A1] focus:outline-none"
                        type="text"
                        placeholder="Tìm tin nhắn"
                      />
                    </div>
                    <div
                      className="m-2 ml-2 flex h-[32px] cursor-pointer items-center justify-center rounded-full px-4 hover:bg-[#E0E2E6]"
                      onClick={() => {
                        setOpenSearchMessage(false);
                        setText1("Nhập nội dung cần tìm trong hội thoại");
                      }}
                    >
                      <span className="text-base font-medium">Đóng</span>
                    </div>
                  </div>
                  <div className="flex h-6 w-full items-center">
                    <span className="text-xs font-semibold text-tblack">
                      Lọc theo:
                    </span>
                    <div className="ml-[9px] text-[10px]">
                      <Select
                        size="small"
                        placeholder="Người gửi"
                        variant="filled"
                        style={{
                          flex: 1,
                          height: 24,
                          backgroundColor: "#EAEDF0",
                          borderRadius: 30,
                          fontSize: 12,
                        }}
                        options={
                          [
                            // {
                            //   value: "jack",
                            //   label: <span style={{ color: "red" }}>Jack</span>,
                            // },
                            // {
                            //   value: "lucy",
                            //   label: "Lucy",
                            // },
                            // {
                            //   value: "Yiminghe",
                            //   label: "yiminghe",
                            // },
                          ]
                        }
                      />
                    </div>
                    <div className="text-xs] ml-[9px]">
                      <Select
                        size="small"
                        placeholder="Ngày gửi"
                        variant="filled"
                        style={{
                          flex: 1,
                          height: 24,
                          backgroundColor: "#EAEDF0",
                          borderRadius: 40,
                          fontSize: 12,
                        }}
                        options={
                          [
                            // {
                            //   value: "jack",
                            //   label: <span style={{ color: "red" }}>Jack</span>,
                            // },
                            // {
                            //   value: "lucy",
                            //   label: "Lucy",
                            // },
                            // {
                            //   value: "Yiminghe",
                            //   label: "yiminghe",
                            // },
                          ]
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* -68 */}
            <div
              className={`${
                openCompReplyInput
                  ? "h-[calc(100vh-250px)]"
                  : openSearchMessage && messages.length < 8
                    ? "h-[calc(100vh-176px)] pt-[90px]"
                    : "h-[calc(100vh-176px)]"
              }  w-full flex-1 overflow-auto bg-[#A4BEEB] p-4 pr-3 `}
              // onScroll={handleScroll}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {/* <Message sender="other" content="Xin chào!" timestamp="15:30" />
          <Message sender="me" content="Chào bạn!" timestamp="15:32" />
          Thêm tin nhắn khác ở đây */}
              {/* {messages.map((message, index) => ( */}
              {messages
                .filter(
                  (message) =>
                    !message.hidden ||
                    !message.hidden.includes(userIDFromCookies),
                )
                .map((message, index) => (
                  <MessageDetail
                    key={index}
                    message={message}
                    chatAvatar={chatAvatar}
                    chatName={chatName}
                    socketFromConservation={socket}
                    setSocketFromConservation={setSocket}
                    messagesF={messages}
                    setMessageDeletedID={setMessageDeletedID}
                    setMessageRecalledID={setMessageRecalledID}
                    idA={idA}
                    setOpenDialog={setOpenDialog}
                    setShareContent={setShareContent}
                    setOpenCompReplyInput={setOpenCompReplyInput}
                    setParentIdMsg={setParentIdMsg}
                    setUserIDReplyForCompReply={setUserIDReplyForCompReply}
                  />
                ))}
              {messageIDRef ? (
                <div ref={messageElementRef} />
              ) : (
                <div ref={messagesEndRef} />
              )}
            </div>
            {/* <div className="fixed z-30 -mt-[20px] flex w-full items-end justify-end bg-[#A4BEEB] ml-[850px] border pr-[1265px]"></div> */}
            {displayComposingMessage && (
              <div className="fixed z-30 -mt-[20px] flex w-full items-end justify-end bg-[#A4BEEB] pr-[415px]">
                {openCompReplyInput ? (
                  <span className="animate-wave text-sm text-white">
                    {chatName}&nbsp;đang soạn tin...
                  </span>
                ) : (
                  <span className="animate-wave text-sm text-white">
                    {chatName}&nbsp;đang soạn tin...
                  </span>
                )}
              </div>
            )}
            <div className="border-t">
              <div className="flex h-[47px] flex-row justify-items-start bg-white">
                <div className="flex flex-row justify-items-start pl-2">
                  <div className="mr-2 flex w-10 items-center justify-center">
                    <a
                      href="#"
                      onClick={() => {
                        setOpenPicker(!openPicker);
                        setContentType("emoji");
                      }}
                    >
                      <img
                        src="/chatbar-sticker.png"
                        alt=""
                        className="h-[24px] w-[24px] opacity-65  hover:opacity-100"
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
                        handleEmojiSelect(emoji.native);
                      }}
                    />
                  </Box>
                  <div
                    className="mr-2 flex w-10 items-center justify-center"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleImageSelection2}
                      id="fileInput2"
                    />
                    <label htmlFor="fileInput2">
                      <img
                        src="/chatbar-photo.png"
                        alt=""
                        className="h-[24px] w-[24px] cursor-pointer opacity-65 hover:opacity-100"
                      />
                    </label>
                  </div>
                  <div className="mr-2 flex w-10 items-center justify-center">
                    <label htmlFor="fileInput">
                      <img
                        src="/chatbar-attach.png"
                        alt=""
                        className="h-[24px] w-[24px] cursor-pointer opacity-65 hover:opacity-100"
                      />
                    </label>
                    <input
                      id="fileInput"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".txt, .pdf, .doc, .csv, .zip, .rar, .xlsx, .xls, .ppt, .pptx, .docx, .json"
                    />
                  </div>
                  <div className="mr-2 mt-1 flex w-10 items-center justify-center">
                    <label htmlFor="videoInput">
                      <img
                        src="/src/assets/icons/film.png"
                        alt=""
                        className="h-[26px] w-[24px] cursor-pointer opacity-80 hover:opacity-100"
                      />
                    </label>
                    <input
                      id="videoInput"
                      type="file"
                      onChange={handleVideoChange}
                      className="hidden"
                      accept=".mp4, .mov, .avi, .flv, .wmv, .mkv, .webm, .MP4"
                    />
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
              <div className={`h-${openCompReplyInput ? "120.5" : "58.5"}px`}>
                {/* Thêm phần nhập tin nhắn ở đây */}
                {/* <MessageInput
              onSendMessage={handleSendMessage}
              onKeySendMessage={handleKeyPress}
            /> */}
                <div
                  className="flex w-full items-center bg-white"
                  // style={{ height: "58.5px" }}
                >
                  <div className="mb-0 w-full pb-0">
                    {openCompReplyInput && (
                      <div className="w-full">
                        <Tag
                          bordered={false}
                          className="absolute z-10 mx-3 -mb-[62px] mt-[10px] flex h-[62px] w-[calc(100vw-438px)] items-center  justify-between bg-[#EEF0F1] p-0 py-2 pl-3 pr-2 text-lg"
                          closable
                          onClose={() => setOpenCompReplyInput(false)}
                        >
                          <div className="flex h-full w-full border-l-2 border-[#4F87F7] pl-3">
                            <div>
                              {renderImageInForwadMsg(shareContent.contents)}
                            </div>
                            <div className="h-full w-full flex-1 pl-1">
                              <div className="flex w-full items-center text-xs">
                                <div className="flex">
                                  <img
                                    src="/src/assets/icons/quotation.png"
                                    alt=""
                                    className="h-4 w-4"
                                  />
                                  <span className="pl-[6px] text-[13px] text-tblack">
                                    Trả lời
                                  </span>
                                  &nbsp;
                                  <span className="text-[13px] font-semibold">
                                    {userIDReplyForCompReply ===
                                    localStorage.getItem("userID")
                                      ? localStorage.getItem("userName")
                                      : chatName}
                                  </span>
                                </div>
                              </div>
                              <div className="w-full text-[13px] ">
                                <span className="items-center text-[13px] text-[#476285]">
                                  {renderContent(shareContent.contents)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Tag>
                      </div>
                    )}
                    {openCompReplyInput ? (
                      <textarea
                        ref={inputRef}
                        // focused={openCompReplyInput ? true : false}
                        autoFocus
                        // fullWidth
                        // variant="outlined"
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPressTextArea}
                        onKeyDown={handleKeyDown}
                        className="border-l-none h-full w-full justify-center border-t-2 p-2 px-[14px] py-[16.5px] pt-[87px] text-[15px] text-tblack focus:border-t-2  focus:border-[#2B66F6] focus:outline-none"
                        rows={1}
                      />
                    ) : (
                      <textarea
                        autoFocus
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChange={handleInputChange} //huy2
                        onKeyPress={handleKeyPressTextArea}
                        onKeyDown={handleKeyDown}
                        className="border-l-none -mt-1 h-full w-full justify-center border-t-2 p-2 px-[14px] py-[16.5px] text-[15px] text-tblack focus:border-t-2  focus:border-[#2B66F6] focus:outline-none"
                        rows={1}
                      />
                    )}
                  </div>
                  {/* <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton> */}
                </div>
              </div>
            </div>
          </div>
          {openRightBar && (
            <div className="w-[440px] overflow-y-auto bg-[#FFFFFF]">
              <div className=" w-full flex-col items-center ">
                <div className="fixed z-50 flex w-full items-center justify-center border bg-white text-center"></div>
                <h1 className="border-5 absolute z-50 h-[68px] w-[340px] justify-center border-b bg-white p-3 pt-5 text-center text-[18px] font-[500] text-tblack">
                  Thông tin hội thoại
                </h1>
                <div className="flex h-full flex-col justify-end bg-white pt-[68px] ">
                  <div className="my-4 flex w-full flex-wrap justify-center">
                    <div className="flex w-full  flex-col items-center justify-center">
                      <div
                        onClick={handleSearchUserIDGuest}
                        className="mb-2 mt-3"
                      >
                        <InforAccountdDialog
                          userIDGuest={userIDGeust}
                          chatIDToFind={searchParams.get("id")}
                          image={chatAvatar}
                          forceRender={forceRender}
                          setStatusF={setStatusF}
                        />
                      </div>
                      <h1 className="ttext-[18px] font-[600]">{chatName}</h1>
                    </div>
                  </div>

                  <div className="mb-4 flex justify-between border-b-8 border-[#EBEEEF] px-[34px]">
                    <button
                      className={`flex-col items-center justify-center rounded-lg text-xs ${
                        openNotification ? "text-gray-600" : "text-gray-800"
                      } p-2 `}
                      onClick={handleClickNotification}
                    >
                      <div className="flex w-full items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[50%] border bg-[#E7EAED] hover:bg-gray-300">
                          <img
                            src="/src/assets/icons/bell.png"
                            alt=""
                            className="w-5"
                          />
                        </div>
                      </div>
                      <div className="mt-2 flex w-full items-center justify-center">
                        <div className="h-[34px] w-[70px]">
                          <span className="w-full text-xs">
                            {openNotification
                              ? "Tắt thông báo"
                              : "Bật thông báo"}
                          </span>
                        </div>
                      </div>
                    </button>
                    <button
                      className={`flex-col items-center justify-center rounded-lg  text-xs ${
                        true ? "text-gray-600" : "text-gray-400"
                      } p-2 `}
                      // onClick={toggleNotification}
                    >
                      <div className="flex w-full items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[50%] border bg-[#E7EAED] hover:bg-gray-300">
                          <img
                            src="/src/assets/icons/push-pin.png"
                            alt=""
                            className="h-[18px] w-[18px]"
                          />
                        </div>
                      </div>
                      <div className="mt-2 flex w-full items-center justify-center">
                        <div className="h-[34px] w-[70px] ">
                          <span className="w-full text-xs">Ghim hội thoại</span>
                        </div>
                      </div>
                    </button>
                    <button
                      className={`flex-col items-center justify-center rounded-lg text-xs ${
                        true ? "text-gray-600" : "text-gray-400"
                      } p-2 `}
                      // onClick={toggleNotification}
                    >
                      <div className="flex w-full items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[50%] border bg-[#E7EAED] hover:bg-gray-300">
                          {/* <img src="" alt="" className="mt-1 w-5" /> */}
                          <div className="-ml-1 mt-2 rounded-[50%]">
                            <CreateGroup
                              image={"/src/assets/icons/people.png"}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex w-full items-center justify-center">
                        <div className="h-[34px] w-[70px] ">
                          <span className="w-full text-xs">
                            Tạo nhóm trò chuyện
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="mb-4 flex-auto border-b-8 border-[#EBEEEF] px-4">
                    <h2 className="mb-4 text-base font-[600] text-tblack">
                      Ảnh/Video
                    </h2>
                    <div className="-mx-2 flex flex-wrap pr-1">
                      {listImage.map((item, index) => (
                        <div key={index} className="mb-2 w-1/4 px-2">
                          <div
                            className="flex items-center justify-center"
                            style={{ width: "72px", height: "72px" }}
                          >
                            <a
                              href={item.contents[0].value}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={item.contents[0].value}
                                alt=""
                                className="h-[72px] w-[72px] object-cover"
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                              />
                            </a>
                          </div>
                        </div>
                      ))}
                      {listImage.length === 0 && (
                        <div className="mb-5 flex w-full items-center justify-center">
                          <span
                            data-translate-inner="Chưa có Ảnh/Video  được chia sẻ trong hội thoại này"
                            className="w-[193px] text-center text-[13px] text-[#7589A3]"
                          >
                            Chưa có Ảnh/Video được chia sẻ trong hội thoại này
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex-auto border-b-8 border-[#EBEEEF] px-4">
                    <h2 className="mb-2 text-base font-[600] text-tblack">
                      File
                    </h2>
                    <div className="-mx-1 flex flex-wrap pb-3">
                      {listFile.map((item, index) => {
                        const content = item.contents[0];
                        const keyParts = content.key.split("|");
                        if (keyParts.length >= 2) {
                          const [fileLabel, fileName, fileSize] = keyParts;
                          return (
                            <FileLinkInfor
                              key={index}
                              fileName={fileName}
                              fileSize={fileSize}
                              fileURL={content.value}
                              fileKey={content.key}
                              fileTime={item.timestamp}
                            />
                          );
                        } else {
                          return null;
                        }
                      })}
                      {listFile.length === 0 && (
                        <div className="mb-3 flex w-full items-center justify-center">
                          <span
                            data-translate-inner="Chưa có Ảnh/Video  được chia sẻ trong hội thoại này"
                            className="w-[193px] text-center text-[13px] text-[#7589A3]"
                          >
                            Chưa có File được chia sẻ trong hội thoại này
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-4 flex-auto border-b-8 border-[#EBEEEF] px-4">
                    <h2 className="mb-2 text-base font-[600] text-tblack">
                      Link
                    </h2>
                    <div className="-mx-1 flex flex-wrap pb-3 pr-1">
                      {listLink.map((item, index) => (
                        <div
                          className="flex w-full items-center  py-[10px] hover:bg-[#F1F3F4] "
                          key={index}
                        >
                          <a
                            href={item.contents[0].value}
                            target="_blank"
                            className="flex w-full items-center  hover:bg-[#F1F3F4]"
                          >
                            <div className="flex h-[42px] w-[42px] items-center justify-center rounded border">
                              <img
                                src="/src/assets/icons/link.png"
                                alt=""
                                className="h-4 w-4"
                              />
                            </div>
                            <div className="-mt-5 ml-2 w-[185px]">
                              <p className="w-[265px] truncate text-sm font-semibold text-tblack">
                                {item.contents[0].value}
                              </p>
                            </div>
                            <div className="ml-auto flex h-full flex-col">
                              <div className="mt-4 self-end">
                                <span className="text-[13px] text-[#7589A3]">
                                  {formatDate(item.timestamp)}
                                </span>
                              </div>
                            </div>
                          </a>
                        </div>
                      ))}
                      {listLink.length === 0 && (
                        <div className="mb-3 flex w-full items-center justify-center">
                          <span
                            data-translate-inner="Chưa có Ảnh/Video  được chia sẻ trong hội thoại này"
                            className="w-[193px] text-center text-[13px] text-[#7589A3]"
                          >
                            Chưa có Link được chia sẻ trong hội thoại này
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </ThemeProvider>
  );
};

export default Conversation;
