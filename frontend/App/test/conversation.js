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
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { Tag } from "antd";
import { v4 as uuidv4 } from "uuid";
import { Cloudinary } from "@cloudinary/url-gen";
import { set } from "date-fns";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
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
    const chatName = searchParams.get("chatName");
    const chatAvatar = searchParams.get("chatAvatar");

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
                `http://localhost:8082/api/v1/chat/x-to-y?id=${id}&x=${x}&y=${y}&timestamp=${timestamp}`,
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
            console.log("MessagesNoHandle:", messagesNoHandle);
            setMessages(messagesNoHandle);
        };

        const newSocket = new WebSocket(`ws://localhost:8082/ws/chat/${id}`);
        newSocket.onopen = () => {
            // console.log("WebSocket connected >>>>>>>>HUy");
        };
        setSocket(newSocket);

        if (id && tokenFromCookies) fetchData();

        return () => {
            newSocket.close();
        };
    }, [reloadCounter, id, tokenFromCookies, message, startIndex, endIndex]);

    // useEffect để chạy lại fetchData khi id hoặc tokenFromCookies thay đổi
    useEffect(() => {
        if (id && tokenFromCookies) {
            setReloadCounter((prevCounter) => prevCounter + 1);
        }
    }, []);

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
    const [parentIdMsg, setParentIdMsg] = useState("");
    console.log("parentIdMsg:", parentIdMsg);

    const sendMessageWithTextViaSocket = (
        messageContent,
        contentType,
        socketNew,
        messageForward,
        parentID,
    ) => {
        console.log("SocketNew:", socketNew);
        console.log("parentID:", parentID);
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
                }
            }

            if (socketNew) {
                console.log("WebSocketNew connected");
                socketNew.send(JSON.stringify(message));
            } else {
                socket.send(JSON.stringify(message));
                console.log(message);
                setMessage(""); // Xóa nội dung của input message sau khi gửi
                setSentMessage(message); // Cập nhật state của sentMessage
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

    //Socket đẻ lắng nghe tin nhắn chỉ ở phía mình
    // useEffect(() => {
    //   console.log("messagesRef.current:", messagesRef.current);
    //   if (id) {
    //     const newSocket = new WebSocket(`ws://localhost:8082/ws/chat/${id}`);
    //     newSocket.onopen = () => {
    //       console.warn(
    //         "WebSocket in CHAT ELEMENT 'ws://localhost:8082/ws/chat/' for chatID: ",
    //         id,
    //         " OPENED",
    //       );
    //     };
    //     newSocket.onmessage = (event) => {
    //       const data = event.data;
    //       if (isJSON(data)) {
    //         const jsonData = JSON.parse(data);
    //         console.log(
    //           "Message received in CONSERVATION 22222222222222:",
    //           jsonData,
    //         );
    //         // Xử lý dữ liệu được gửi đến ở đây
    //         if (jsonData.tcm === "TCM04") {
    //           const messageIDToDelete = jsonData.messageID;
    //           // Lọc ra các tin nhắn mà không có messageIDToDelete
    //           const updatedMessages = messages.filter(
    //             (msg) => msg.messageID !== messageIDToDelete,
    //           );
    //           setMessages(updatedMessages);
    //           console.log("Updated messages after deleting:", updatedMessages);
    //         }
    //       } else {
    //         // console.error("Received data is not valid JSON:", data);
    //         // Xử lý dữ liệu không phải là JSON ở đây (nếu cần)
    //       }
    //     };
    //     function isJSON(data) {
    //       try {
    //         JSON.parse(data);
    //         return true;
    //       } catch (error) {
    //         return false;
    //       }
    //     }

    //     setSocket(newSocket);

    //     // return () => {
    //     //   newSocket.close(); // Đóng kết nối khi component unmount hoặc userID thay đổi
    //     // };
    //   }
    // }, [id, messages]);

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
                    `http://localhost:8082/api/v1/user/info/${userIDFromCookies}`,
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
                console.log("ChatID:", chatID);
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
                            className="mb-2 mr-2 w-9 h-9"
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
                    return "[Hình ảnh]"
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
                    `ws://localhost:8082/ws/chat/${obj.chatID}`,
                );
                newSocket.onopen = () => {
                    console.log("newSocket:", newSocket);
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
        }
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
                                className={`flex items-center ${true ? "border border-[#EBEDF0]" : "border"
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
                                className={`max-h-[490px] w-full overflow-y-auto ${selectedContactObjs.length > 0 ? " w-7/12 " : ""
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
                <div className="h-screen w-full">
                    <div className="h-[68px] w-full px-4">
                        <div className="flex h-full w-full flex-row items-center justify-between">
                            <div className="flex flex-row items-center gap-x-2">
                                <Link to="/app">
                                    <FontAwesomeIcon icon={faChevronLeft} className="pl-1 pr-3" />
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
                                <Link to="/videocall" className="p-2">
                                    <img
                                        src="/src/assets/video.png"
                                        alt=""
                                        className="m-1 h-5 w-5"
                                    />
                                </Link>
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
                        className={`${openCompReplyInput
                            ? "h-[calc(100vh-246.5px)]"
                            : "h-[calc(100vh-174px)]"
                            }  w-full flex-1 overflow-auto bg-[#A4BEEB] p-4 pr-3`}
                    // onScroll={handleScroll}
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
                                                <div className="h-full w-full flex border-l-2 border-[#4F87F7] pl-3">
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
                                                                    {chatName}
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
                                            className="border-l-none h-full w-full justify-center border-t-2 p-2 px-[14px] py-[16.5px] pt-[87px] text-[15px] text-tblack focus:border-t-2  focus:border-[#2B66F6] focus:outline-none"
                                            rows={1}
                                        />
                                    ) : (
                                        // <textarea
                                        //   autoFocus
                                        //   placeholder="Nhập tin nhắn..."
                                        //   value={message}
                                        //   onChange={handleInputChange}
                                        //   onKeyPress={handleKeyPress}
                                        //   className="h-full w-full p-2 text-[15px]"
                                        //   rows={2}
                                        // />
                                        // <TextField
                                        //   // ref={inputRef}
                                        //   focused={openCompReplyInput ? true : false}
                                        //   autoFocus
                                        //   fullWidth
                                        //   variant="outlined"
                                        //   placeholder="Nhập tin nhắn..."
                                        //   value={message}
                                        //   onChange={handleInputChange}
                                        //   onKeyPress={handleKeyPress}
                                        //   inputProps={{
                                        //     style: {
                                        //       fontSize: 15,
                                        //       marginTop: openCompReplyInput ? "72px" : "0",
                                        //     },
                                        //   }}
                                        //   sx={{
                                        //     // border: "1px solid grey",
                                        //     // paddingTop: "62px",
                                        //     "& .MuiOutlinedInput-root": {
                                        //       borderTop: "1px solid",
                                        //       borderBottom: "none",
                                        //       borderLeft: "none",
                                        //       borderRight: "none",
                                        //       borderColor: "#CFD6DC",
                                        //       borderRadius: 2,
                                        //     },
                                        //     "& .MuiOutlinedInput-root:hover": {
                                        //       borderTop: "1px solid",
                                        //       borderBottom: "none",
                                        //       borderLeft: "none",
                                        //       borderRight: "none",
                                        //       borderRadius: 2,
                                        //       borderColor: "blue",
                                        //     },
                                        //     "& .Mui-focused": {
                                        //       borderTop: "1px solid",
                                        //       borderBottom: "none",
                                        //       borderLeft: "none",
                                        //       borderRight: "none",
                                        //       borderRadius: 2,
                                        //     },
                                        //   }}
                                        // />
                                        <textarea
                                            autoFocus
                                            placeholder="Nhập tin nhắn..."
                                            value={message}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPressTextArea}
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
            </>
        </ThemeProvider>
    );
};

export default Conversation;