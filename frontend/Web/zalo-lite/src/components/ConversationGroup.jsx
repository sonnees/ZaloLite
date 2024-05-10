import React from "react";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBell, faChevronLeft, faGear, faMagnifyingGlass, faScrewdriverWrench, faThumbtack, faTrashCan, faUserMinus, faUserPlus, faUserXmark, faUsers } from "@fortawesome/free-solid-svg-icons";
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
import { Cloudinary } from "@cloudinary/url-gen";
import { set } from "date-fns";
import { useUser } from "../context/UserContext";
import MessageDetailGroup from "./MessageDetailGroup";

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

const ConversationGroup = () => {
  const messagesEndRef = useRef(null);
  const cookies = new Cookies();

  const cld = new Cloudinary({ cloud: { cloudName: "djs0jhrpz" } });
  const [imageUrl, setImageUrl] = useState("");



  // const handleFileUpload = async (file) => {
  //   try {
  //     // URL của Cloudinary để tải lên file
  //     const cloudinaryUrl = `https://api.cloudinary.com/v1_1/djs0jhrpz/upload`;

  //     // Tạo formData để chứa file
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("upload_preset", "huydev"); // Thay YOUR_UPLOAD_PRESET bằng upload preset của bạn

  //     // Gửi request lên Cloudinary để tải lên file
  //     const response = await axios.post(cloudinaryUrl, formData);

  //     // Lấy đường link của file từ Cloudinary và sử dụng nó cho mục đích gửi đi hoặc lưu trữ
  //     const imageUrl = response.data.secure_url;
  //     setImageUrl(imageUrl);
  //     console.log("Uploaded image URL:", imageUrl);
  //   } catch (error) {
  //     console.error("Error uploading file to Cloudinary:", error);
  //   }
  // };

  // function handleFileUpload(file) {
  //   const preset_key = "huydev09";
  //   const cloud_name = "djs0jhrpz";
  //   const file2 = file;
  //   const formData = new FormData();
  //   formData.append("file", file2);
  //   formData.append("upload_preset", preset_key);
  //   console.log("Uploading file to Cloudinary...")
  //   axios
  //     .post(
  //       `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
  //       formData,
  //     )
  //     .then((response) => {
  //       console.log("Upload Complete! | Uploaded image URL:", response.data.secure_url);
  //       setImageUrl(response.data.secure_url);
  //     })
  //     .catch((error) => {
  //       console.error("Error uploading file to Cloudinary:", error);
  //     });
  // }

  // Hàm xử lý khi chọn emoji từ picker
  const handleEmojiSelect = (emoji) => {
    console.log("Emoji selected:", emoji);
    // Gửi emoji qua WebSocket
    sendMessageWithTextViaSocket(emoji, "emoji");
    // Đóng picker emoji sau khi chọn
    setOpenPicker(false);
  };

  const uploadFileToS3 = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:4000/upload", {
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

  // const handleFileUpload = (file) => {
  //   const preset_key = "huydev09";
  //   const cloud_name = "djs0jhrpz";
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", preset_key);
  //   console.log("Uploading file to Cloudinary...");

  //   axios
  //     .post(
  //       `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
  //       formData,
  //     )
  //     .then((response) => {
  //       console.log(
  //         "Upload Complete! | Uploaded image URL:",
  //         response.data.secure_url,
  //       );
  //       setImageUrl(response.data.secure_url);

  //       // Tạo key cho file upload
  //       const fileExtension = file.name.split(".").pop(); // Lấy phần đuôi của file
  //       const fileSizeKB = Math.round(file.size / 1024); // Kích thước file tính bằng KB
  //       const key = `${fileExtension}|${file.name}|${fileSizeKB}KB`;

  //       // Gửi tin nhắn chứa link ảnh và key cho người nhận
  //       const imageMessage = {
  //         contents: [
  //           {
  //             key: key,
  //             value: response.data.secure_url,
  //           },
  //         ],
  //       };
  //       console.log("Image message:", imageMessage);
  //       sendMessageWithTextViaSocket(imageMessage, "file");
  //     })
  //     .catch((error) => {
  //       console.error("Error uploading file to Cloudinary:", error);
  //     });
  // };

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

  // const handleFileUpload = (file) => {
  //   const preset_key = "huydev09";
  //   const cloud_name = "djs0jhrpz";
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", preset_key);

  //   axios
  //     .post(
  //       `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
  //       formData,
  //     )
  //     .then((response) => {
  //       console.log(
  //         "Upload Complete! | Uploaded image URL:",
  //         response.data.secure_url,
  //       );

  //       // Tạo tin nhắn chứa link ảnh theo định dạng mong muốn
  //       const imageMessage = {
  //         key: "image",
  //         value: response.data.secure_url,
  //       };

  //       console.log("Image message:", imageMessage);
  //       // Gửi tin nhắn qua WebSocket
  //       sendMessageWithTextViaSocket(imageMessage, "image");
  //     })
  //     .catch((error) => {
  //       console.error("Error uploading file to Cloudinary:", error);
  //     });
  // };

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
      setContentType("image");
    }
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

  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(15);
  const {cons, setCons} = useUser();

  const [message, setMessage] = useState("");
  const [contentType, setContentType] = useState("text"); // Mặc định là gửi tin nhắn text
  const [keyTypeMessage, setKeyTypeMessage] = useState("text");
  const [socket, setSocket] = useState(null);
  const [socketGroup, setSocketGroup] = useState(null);
  const [userIDFromCookies, setUserIDFromCookies] = useState("");
  const [flag, setFlag] = useState(false);

  const inputFileRef = useRef(null);
  const { loadDefaultAvt, setLoadDefaultAvt } = useUser();
  const [loadAvt, setLoadAvt] = useState(chatAvatar);

  const [sentMessage, setSentMessage] = useState(null);
  const [consGroup, setConsGroup] = useState(JSON.parse(localStorage.getItem("conversations")).find(item => item.chatID === id) );
  const [group, setGroup] = useState(null);
  const storedData  = JSON.parse(localStorage.getItem("conversations"));
  const conversations = storedData ? storedData.filter(conversation => conversation.type !== "GROUP") : null

  const [messageRecalledID, setMessageRecalledID] = useState(null);
  const [messageDeletedID, setMessageDeletedID] = useState(null);
  const [idA, setIdA] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);

  const togglePopup = () => {
    setPopupIsOpen(!popupIsOpen);
  };

  const [nameGroup, setNameGroup] = useState("");
  const [tfPhoneNumber, setTFPhoneNumber] = useState("");
  const [nameGroupClick, setNameGroupClick] = useState(false);
  const [tfPhoneNumberClick, setTFPhoneNumberClick] = useState(false);
  const [check, setCheck] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionToggle = (optionId) => {
    const isSelected = selectedOptions.includes(optionId);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const getSelectedItems = () => {
    return conversations.filter((conversations) => selectedOptions.includes(conversations.chatID));
  };

  const handleFocusNameGroup = () => {
    setNameGroupClick(true);
  };

  const handleBlurNameGroup = () => {
    setNameGroupClick(false);
  };

  const handleFocusPhoneClick = () => {
    setTFPhoneNumberClick(true);
  };

  const handleBlurPhoneClick = () => {
    setTFPhoneNumberClick(false);
  };
  

  useEffect(()=> {
    fetchGroup()
    // console.log(group);
  },[])


  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setContentType("text");
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
        `${process.env.HOST}/api/v1/chat/x-to-y?id=${id}&x=${x}&y=${y}`,
        {
          headers: {
            "Content-Type": "application/json",
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

  const fetchGroup = async() => {
    try {
      const response = await axios.get(
        `${process.env.HOST}/api/v1/group/info?idGroup=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log("Data:", response.data);
      setGroup(response.data)
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

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
    const newSocket = new WebSocket(`${process.env.SOCKET_CHAT}/ws/chat/${id}`);
    newSocket.onopen = async () => {
      console.log("WebSocket connected >>>>>>>>HUy");
    };

    const newSocketGroup = new WebSocket(`${process.env.SOCKET_CHAT}/ws/group`);
    newSocketGroup.onopen = async () => {
      console.log("WebSocket connected");
    };

    setSocket(newSocket);

    setSocketGroup(newSocketGroup);
    // return () => {
    //   newSocket.close();
    // };
    fetchData();
  }, [id, tokenFromCookies, message, flag, cons]);

  //==============Đang chạy ổn
  // const sendMessageWithTextViaSocket = (textMessage) => {
  //   if (socket) {
  //     const message = {
  //       id: uuidv4(),
  //       tcm: "TCM01",
  //       userID: userIDFromCookies || "26ce60d1-64b9-45d2-8053-7746760a8354",
  //       userAvatar:
  //         "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711636843/exftni5o9msptdxgukhk.png",
  //       userName: "Tran Huy",
  //       timestamp: new Date().toISOString(),
  //       parentID: null,
  //       contents: [
  //         {
  //           key: keyTypeMessage,
  //           value: textMessage,
  //         },
  //       ],
  //     };
  //     socket.send(JSON.stringify(message));
  //     setMessage(""); // Xóa nội dung của input message sau khi gửi
  //   } else {
  //     console.error("WebSocket is not initialized.");
  //   }
  // };

  const sendMessageWithTextViaSocket = async (messageContent, contentType) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (socket) {
      const message = {
        id: uuidv4(),
        tcm: "TCM01",
        userID: user.userID,
        userAvatar: user.avatar,
        userName: user.userName,
        timestamp: new Date().toISOString(),
        parentID: null,
        contents: [],
      };

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
      } else if (contentType === "notify") {
        message.contents.push({
          key: "notify",
          value: messageContent,
        });
      }
      socket.send(JSON.stringify(message));
      console.log(message);
      setMessage(""); // Xóa nội dung của input message sau khi gửi
      setSentMessage(message); // Cập nhật state của sentMessage
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
      sendMessageWithTextViaSocket(message, "link");
    } else if (contentType === "text" && message.trim() !== "") {
      console.log("Gửi tin nhắn:", message);
      sendMessageWithTextViaSocket(message, "text");
    } else if (contentType === "file" && imageUrl) {
      console.log("Gửi file:", imageUrl);
      sendMessageWithTextViaSocket(imageUrl, "file");
    } else if (contentType === "notify") {
      console.log("Gửi notify:");
      sendMessageWithTextViaSocket(message, "notify");
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
  const [click, setClick] = useState(false);

  const handleClickRightBar = () => {
    setClick(!click);
  }

  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  // useEffect(() => {
  //   if (socket) {
  //     socket.onmessage = (event) => {
  //       const data = event.data;
  //       // console.log("Received data:", data);
  //       try {
  //         const jsonData = JSON.parse(data);
  //         console.log("Received JSON data:", jsonData);
  //         // Kiểm tra xem tin nhắn không phải từ bạn
  //         if (jsonData.tcm === "TCM01") {
  //           const messageFromOtherUser = jsonData.userID !== userIDFromCookies;
  //           if (messageFromOtherUser) {
  //             // Kiểm tra xem tin nhắn đã tồn tại trong mảng messages chưa
  //             const messageExists = messages.some(
  //               (msg) => msg.id === jsonData.id,
  //             );

  //             if (!messageExists) {
  //               setMessages((prevMessages) => [...prevMessages, jsonData]);
  //               console.log(messages);
  //             }
  //           }
  //         }

  //         // const messageFromOtherUser = jsonData.userID !== userIDFromCookies;
  //         // if (messageFromOtherUser) {
  //         //   // Kiểm tra xem tin nhắn đã tồn tại trong mảng messages chưa
  //         //   const messageExists = messages.some(
  //         //     (msg) => msg.id === jsonData.id,
  //         //   );
  //           // if (!messageExists) {
  //           //   setMessages((prevMessages) => [...prevMessages, jsonData]);
  //           //   console.log(messages);
  //           // }
  //         // }
  //       } catch (error) {
  //         console.error("Error parsing JSON data:", error);
  //       }
  //     };

  //     // Ensure that the socket is closed when the component unmounts
  //     return () => {
  //       socket.onmessage = null;
  //     };
  //   }
  // }, [socket, messages, userIDFromCookies]);


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
              console.log("Message____________________:", messages);
              setIdA(jsonData.id);
              if (jsonData) {
                // Kiểm tra xem tin nhắn đã tồn tại trong mảng messages chưa
                const messageExists = messages.some(
                  (msg) => msg.id === jsonData.id,
                );
                if (!messageExists) {
                  setMessages((prevMessages) => [...prevMessages, jsonData]);
                }
              }
            }
            if (jsonData.tcm === "TCM05") {
              console.log("Runnnnnn");
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
            if (
              jsonData.tcm === "TCM00" &&
              jsonData.id === messageRecalledID &&
              jsonData.typeNotify === "SUCCESS"
            ) {
              const messageIDToDelete = messageDeletedID;
              // Lọc ra các tin nhắn mà không có messageIDToDelete
              const updatedMessages = messages.filter(
                (msg) => msg.messageID !== messageIDToDelete,
              );
              setMessages(updatedMessages);
              console.log("Updated messages after deleting:", updatedMessages);
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
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setSentMessage(null); // Đặt lại giá trị của sentMessage về null sau khi cập nhật tin nhắn
    }
  }, [sentMessage]);

  // console.log(messages);

  const handleDeleteGroup = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    // let newSocket = new WebSocket(`ws://localhost:8082/ws/group`);
    // newSocket.onopen = async () => {
    //   console.log("WebSocket connected");
    // };
    if (socketGroup && user) {
      const create = {
        id: uuidv4(),
        tgm: "TGM02",
        idChat: id,
      };

      socketGroup.send(JSON.stringify(create));
      // console.log(create);
      reloadCons();
      fetchGroup();
      navigate("/App")
    } else {
      console.error("WebSocket is not initialized.");
    }
  }

  const handleOutGroup = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    // let newSocket = new WebSocket(`ws://localhost:8082/ws/group`);
    // newSocket.onopen = async () => {
    //   console.log("WebSocket connected");
    // };
    if (socketGroup && user) {
      const outGroup = {
        id: uuidv4(),
        tgm: "TGM06",
        idChat: id,
        userID: user.userID,
        userName: user.userName,
        userAvatar: user.avatar,
      };

      socketGroup.send(JSON.stringify(outGroup));
      // console.log(create);
      reloadCons();
      fetchGroup();
      navigate("/App")
    } else {
      console.error("WebSocket is not initialized.");
    }
  }

  const handleAddMemberToGroup = () => {
    let mem = getSelectedItems();
    // console.log(mem);
    mem.map(item=> {
      if (socketGroup && socket) {
        let addMem = {
          id: uuidv4(),
          tgm: "TGM03",
          idChat: id,
          userID: item.id_UserOrGroup,
          userName: item.chatName,
          userAvatar: item.chatAvatar,
        };
  
        socketGroup.send(JSON.stringify(addMem));
        sendMessageWithTextViaSocket(item.chatName + " đã được thêm vào nhóm", "notify");
        // console.log(create);
        fetchGroup();
        // navigate("/App");
      } else {
        console.error("WebSocket is not initialized.");
      }
    })
    
    togglePopup();
    fetchGroup();
    reloadCons();
  }

  const setAdmin = (member) => {
    // let newSocket = new WebSocket(`ws://localhost:8082/ws/group`);
    // newSocket.onopen = async () => {
    //   console.log("WebSocket connected");
    // };
    sendMessageWithTextViaSocket(member.userName + " đã được bổ nhiệm thành phó nhóm", "notify");
    if (socketGroup) {
      const setAd = {
        id: uuidv4(),
        tgm: "TGM04",
        idChat: id,
        userID: member.userID,
        userName: member.userName,
        userAvatar: member.userAvatar,
      };
      console.log(setAd);
      socketGroup.send(JSON.stringify(setAd));
      fetchGroup();
      reloadCons();
      
    } else {
      console.error("WebSocket is not initialized.");
    }
  }

  const removeAdmin = (admin) => {
    sendMessageWithTextViaSocket(admin.userName + " đã không còn là phó nhóm", "notify");
    if (socketGroup) {
      const rmAdmin = {
        id: uuidv4(),
        tgm: "TGM05",
        idChat: id,
        userID: admin.userID,
        userName: admin.userName,
        userAvatar: admin.userAvatar,
      };

      socketGroup.send(JSON.stringify(rmAdmin));
      // console.log(create);
      
      fetchGroup();
      reloadCons();
    } else {
      console.error("WebSocket is not initialized.");
    }
  }


  const deleteMember = async (member) => {
    // let newSocket = new WebSocket(`ws://localhost:8082/ws/group`);
    // newSocket.onopen = async () => {
    //   console.log("WebSocket connected");
    // };
    await sendMessageWithTextViaSocket(member.userName + " đã rời khỏi nhóm", "notify");

    if (socketGroup) {
      const outGroup = {
        id: uuidv4(),
        tgm: "TGM06",
        idChat: id,
        userID: member.userID,
        userName: member.userName,
        userAvatar: member.userAvatar,
      };

      

      socketGroup.send(JSON.stringify(outGroup));
      // console.log(create);
      
      fetchGroup();
      reloadCons();
    } else {
      console.error("WebSocket is not initialized.");
    }
  }

  const reloadCons = async () => {
    try {
      const response = await fetch(
        `${process.env.HOST}/api/v1/user/info/${localStorage.getItem("userID")}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          method: "GET",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      const data = await response.json();
      // console.log(data);
      localStorage.setItem(
        "conversations",
        JSON.stringify(data.conversations),
      );
      setCons(JSON.parse(localStorage.getItem("conversations")))
      console.log(cons);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }

  const handleAvatarClick = () => {
    inputFileRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'bsqsytxl');
    try {
      let newAvatar = '';
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/du73a0oen/image/upload",
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: formData,
        },
      )
      .then(response=>response.json())
      .then(data=>newAvatar=data.secure_url);

      console.log(newAvatar);
      setLoadAvt(newAvatar)

      let user = JSON.parse(localStorage.getItem("user"));
      if (socketGroup && user) {
        const updateImageChatGroup = {
          id: uuidv4(),
          tgm: "TGM09",
          idChat: id,
          avatar: newAvatar
        };
  
        socketGroup.send(JSON.stringify(updateImageChatGroup));
        // console.log(create);
        reloadCons();
      } else {
        console.error("WebSocket is not initialized.");
      }

      

      // socketGroup.send
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-full">
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
              
              <img onClick={handleClickRightBar} src="/src/assets/right-bar.png" alt="" className="m-1 h-4 w-4"/>

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
            <MessageDetailGroup
              key={index}
              message={message}
              chatAvatar={message.userAvatar}
              socketFromConservation={socket}
              setSocketFromConservation={setSocket}
              messagesF={messages}
              setMessageDeletedID={setMessageDeletedID}
              setMessageRecalledID={setMessageRecalledID}
              idA={idA}
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
                    setContentType("emoji");
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
                    handleEmojiSelect(emoji.native);
                  }}
                />
              </Box>
              <div className="mr-2 flex w-10 items-center justify-center">
                {/* Input file ẩn để chọn ảnh */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageSelection}
                  id="fileInput2"
                />
                {/* Hình ảnh để mở cửa sổ chọn tệp ảnh */}
                <label htmlFor="fileInput2">
                  <img
                    src="/chatbar-photo.png"
                    alt=""
                    className="h-[24px] w-[24px] cursor-pointer opacity-65"
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




      {click && <div className="w-[500px]"> 
        <div className="flex flex-col items-center h-screen">
          
          <div className="h-[68px] w-full flex items-center justify-center text-center border"> 
            <h1 className="font-semibold text-lg p-3 m-2">Thông tin nhóm</h1>
          </div>

          <div className="flex flex-col justify-end h-full bg-white ">
            <div className="flex justify-center items-center my-4">
              <input ref={inputFileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }}/>
              <img onClick={handleAvatarClick} src={loadAvt} alt="ZaloLite Logo" className="w-12 h-12 mr-2 rounded-full" />
              <h1 className="text-xl font-bold">{chatName}</h1>
            </div>
            <div className="flex justify-between mb-4 border-b-4 border-gray-200">
              <button disabled="true" className="flex-col items-center text-xs px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200">
                <FontAwesomeIcon className="w-5 h-5 rounded-full" icon={faBell}/> <br/>Tắt thông báo
              </button>
              <button disabled="true" className="flex-col items-center text-xs px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200">
                <FontAwesomeIcon className="w-5 h-5 rounded-full" icon={faThumbtack}/> <br/>Ghim hội thoại
              </button>
              <button onClick={togglePopup} className="flex-col items-center text-xs px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200">
                <FontAwesomeIcon className="w-5 h-5 rounded-full" icon={faUserPlus}/> <br/>Thêm thành viên
              </button>
              <button disabled="true" className="flex-col items-center text-xs px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200">
                <FontAwesomeIcon className="w-5 h-5 rounded-full" icon={faGear}/> <br/>Quản lý nhóm
              </button>
            </div>

            <div>
              {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={togglePopup}>Mở Popup</button> */}
              {popupIsOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                  <div className="w-[400px] bg-white p-6 rounded-lg shadow-xl">
                    {/* <h2 className="text-2xl font-bold mb-4">Popup</h2>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={togglePopup}>Đóng</button> */}

                    <div className="flex items-center justify-between border-b p-2">
                      <span className="text-base font-medium text-tblack pl-4">Thêm thành viên nhóm</span>
                      <button onClick={togglePopup} style={{ color: "#000000" }}> X </button>
                    </div>

                    <div className="flex-col items-center border-b">
                      {/* <div className="flex items-center">
                        <input ref={inputFileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }}/>
                        <img onClick={handleAvatarClick} className="w-12 h-12 rounded-full border" src={loadAvt} alt="Avatar" />
                        <input onFocus={handleFocusNameGroup} onBlur={handleBlurNameGroup} onChange={(event) => {setNameGroup(event.target.value);}} className={`w-full mx-3 focus:outline-none ${nameGroupClick?'border-b border-b-blue-600':'border-b'} p-2`} type="text" placeholder="Nhập tên nhóm..."/>
                      </div> */}

                      <div className={`flex items-center ${tfPhoneNumberClick?'border border-blue-600':'border'} rounded-full p-2 m-2`}>
                        <FontAwesomeIcon className="px-2" icon={faMagnifyingGlass} />
                        <input onFocus={handleFocusPhoneClick} onBlur={handleBlurPhoneClick} onChange={(event) => {setTFPhoneNumber(event.target.value);}}  className="w-full focus:outline-none font-normal text-sm" type="text" placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"/>
                      </div>
                      
                    </div>

                    <div className="h-[calc(65vh-70px)] w-full overflow-auto">
                      <h6 className="p-2 text-sm font-semibold">Danh sách bạn bè</h6>

                      <ul>
                        {conversations?conversations.map((conversation) => {
                          // console.log("lò"+group.members);
                          if (!((group.owner.userID === conversation.id_UserOrGroup)
                          || (group.admin.some(item => item["userID"] === conversation.id_UserOrGroup)) || (group.members.some(item => item["userID"] === conversation.id_UserOrGroup)))) {
                            
                            return (
                              <li
                                key={conversation.chatID}
                                className="flex items-center px-4 py-3"
                                onClick={() => handleOptionToggle(conversation.chatID)}
                              >
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-4 w-4 mr-2"
                                  checked={selectedOptions.includes(conversation.chatID)}
                                  onChange={() => {}}
                                />
                                <img src={conversation.chatAvatar} alt={conversation.chatName} className="h-8 w-8 rounded-full mr-2" />
                                <span>{conversation.chatName}</span>
                              </li>
                            )
                          }
                        }):null}
                      </ul>



                    </div>
                  
                    <button
                      onClick={handleAddMemberToGroup}
                      variant="contained"
                      className="ml-60 text-xs px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-blue-400"
                    >
                      Thêm thành viên
                    </button>
                  
                  </div>
                </div>
              )}
            </div>


            <div className="mb-4 flex-auto border-b-4 border-gray-200 px-4">
              <h2 className="text-lg font-semibold mb-2">Thành viên nhóm</h2>
              <p className="text-gray-600"><FontAwesomeIcon icon={faUsers} /> {group.members.length+1} thành viên</p>

              <div className="h-[320px] w-full overflow-auto">
                {/* <h6 className="p-2 text-sm font-semibold">Danh sách bạn bè</h6> */}
                <ul>
                    <li
                      key={group.owner.userID}
                      className="flex items-center px-4 py-3"
                      // onClick={() => handleOptionToggle(conversation.chatID)}
                    >
                      <img src={group.owner.userAvatar} alt={group.owner.userName} className="h-8 w-8 rounded-full mr-2" />
                      <span>{group.owner.userName}   (Quản lý)</span>
                    </li>

                    {/* {group.admin == null && <li
                      key={group.admin.userID}
                      className="flex items-center px-4 py-3"
                      // onClick={() => handleOptionToggle(conversation.chatID)}
                    >
                      <img src={group.admin.userAvatar} alt={group.admin.userName} className="h-8 w-8 rounded-full mr-2" />
                      <span>{group.admin.userName}   (Phó nhóm)</span>
                    </li>} */}
                  { group.admin.map((admin) => (
                    <li
                    key={admin.userID}
                    className="flex items-center px-4 py-3"
                    // onClick={() => handleOptionToggle(conversation.chatID)}
                  >
                      <img src={admin.userAvatar} alt={admin.userName} className="h-8 w-8 rounded-full mr-2" />
                      <span>{admin.userName}   (Phó nhóm)</span>
                      {group.owner.userID==localStorage.getItem("userID") && 
                        <div className="ml-auto">
                          {/* <button onClick={()=> {setAdmin(member)}} className=" hover:bg-gray-200 px-2"><FontAwesomeIcon icon={faScrewdriverWrench}/></button> */}
                          <button onClick={()=> {removeAdmin(admin)}} className=" hover:bg-gray-200 px-2"><FontAwesomeIcon icon={faUserXmark} /></button>
                        </div>
                      }
                    </li>
                  ))}


                  {group.members.map((member) => (
                    <li
                      key={member.userID}
                      className="flex items-center px-4 py-3"
                      // onClick={() => handleOptionToggle(conversation.chatID)}
                    >
                      <img src={member.userAvatar} alt={member.userName} className="h-8 w-8 rounded-full mr-2" />
                      <span>{member.userName}</span> {(group.owner.userID==localStorage.getItem("userID")) && 
                        <div className="ml-auto">
                           <button onClick={()=> {setAdmin(member)}} className=" hover:bg-gray-200 px-2"><FontAwesomeIcon icon={faScrewdriverWrench}/></button>
                          <button onClick={()=> {deleteMember(member)}} className=" hover:bg-gray-200 px-2"><FontAwesomeIcon icon={faUserMinus} /></button>
                        </div>
                      }
                    </li>
                  ))}
                </ul>
              </div>

            </div>


            <div className="justify-items-end px-4">
              <button className="flex w-full items-center p-2 text-red-600 rounded-lg hover:bg-gray-200">
                <FontAwesomeIcon className="mr-2" icon={faTrashCan}/> Xóa lịch sử cuộc trò chuyện
              </button>

              {(group.owner.userID==localStorage.getItem("userID") || group.admin.some(item => item["userID"] === localStorage.getItem("userID"))) && <button onClick={handleDeleteGroup} className="flex w-full items-center p-2 text-red-600 rounded-lg hover:bg-gray-200">
                <FontAwesomeIcon className="mr-2" icon={faArrowRightFromBracket}/> Giải tán nhóm
              </button>}

              {!(group.owner.userID==localStorage.getItem("userID") || group.admin.some(item => item["userID"] === localStorage.getItem("userID"))) && <button onClick={handleOutGroup} className="flex w-full items-center p-2 text-red-600 rounded-lg hover:bg-gray-200">
                <FontAwesomeIcon className="mr-2" icon={faArrowRightFromBracket}/> Rời nhóm
              </button>}
            </div>




          </div>
        </div>
      </div>}
    </div>
  );
};

export default ConversationGroup;

// const dataCons = {
//   "_id": "d8b5f538-9a4a-4e18-8442-62217dbaf1e5",
//   "chatName": "Nhom Ca Canh",
//   "owner": {
//     "userID": "26ce60d1-64b9-45d2-8053-7746760a8354",
//     "userName": "Tran Huy",
//     "userAvatar": "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711636843/exftni5o9msptdxgukhk.png"
//   },
//   "admin": [],
//   "members": [
//     {
//       "userID": "f1cee7b8-7712-4042-9e94-17bd21209a62",
//       "userName": "Lê Hữu Bằng",
//       "userAvatar": "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711638195/yaelqfegjxfkbjdmwyef.png"
//     },
//     {
//       "userID": "0a2f80df-655f-47f7-9202-7a01b0f9ba74",
//       "userName": "Thúy An",
//       "userAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-27.jpg"
//     },
//     {
//       "userID": "5b685d06-8fbe-4ab7-a18b-b713b2ba4daa",
//       "userName": "Ánh Tina",
//       "userAvatar": "https://upanh123.com/wp-content/uploads/2020/10/Anh-gai-xinh-lam-anh-dai-dien-facebook1.jpg"
//     },
//     {
//       "userID": "b95ad4f4-68b0-4dd8-a4db-59b5874c4bdf",
//       "userName": "Nguyễn Thị Việt Chi",
//       "userAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-2-600x750.jpg"
//     },
//     {
//       "userID": "79feacfd-507b-4721-b7b0-92869f06cf20",
//       "userName": "Haley Neith",
//       "userAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-4-600x750.jpg"
//     },
//     {
//       "userID": "f31a6af5-e633-44f0-895d-26f0eafd6262",
//       "userName": "Nguyễn Châu",
//       "userAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-12.jpg"
//     },
//     {
//       "userID": "0a67357b-9a70-431f-be90-39fa9fc7e3e2",
//       "userName": "Quỳnh Trinh",
//       "userAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-9-600x749.jpg"
//     }
//   ],
//   "createAt": {
//     "$date": "2024-04-14T19:02:47.930Z"
//   },
//   "avatar": "https://res.cloudinary.com/du73a0oen/image/upload/v1713020468/Zalo-Lite/juqqm5zgxjaamjw41lvz.png",
//   "setting": {
//     "changeChatNameAndAvatar": true,
//     "pinMessages": true,
//     "sendMessages": true,
//     "membershipApproval": true,
//     "createNewPolls": true
//   },
//   "_class": "com.zalolite.chatservice.entity.Group"
// }


