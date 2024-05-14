import { formatDistanceToNow, set } from "date-fns";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import axios from "axios";
import Cookies from "universal-cookie";

import notificationSound from "../assets/sounds/message-notification.mp3";
function ChatElement({
  id,
  chatAvatar,
  chatName,
  topChatActivity,
  lastUpdateAt,
}) {
  const cookies = new Cookies();
  const [tokenFromCookies, setTokenFromCookies] = useState("");
  const [userIDFromCookies, setUserIDFromCookies] = useState("");
  useEffect(() => {
    // Gán giá trị lấy được từ cookies vào state userIDFromCookies
    // const userID = getUserIDFromCookie();
    // setUserIDFromCookies(userID);
    // Lấy token từ cookies và giải mã nó

    const userIDFromCookie = cookies.get("userID");
    if (userIDFromCookie) {
      // const tokenDecrypted = decryptData(tokenFromCookie);
      setUserIDFromCookies(userIDFromCookie);
    }

    const tokenFromCookie = cookies.get("token");
    if (tokenFromCookie) {
      // const tokenDecrypted = decryptData(tokenFromCookie);
      setTokenFromCookies(tokenFromCookie);
    }
  }, []);
  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [topChat, setTopChat] = useState([]);
  const [topChatToShow, setTopChatToShow] = useState("");

  const [messageContent, setMessageContent] = useState("");
  const unreadCount = 0;

  useEffect(() => {
    if (id) {
      const newSocket = new WebSocket(
        `${process.env.SOCKET_CHAT}/ws/chat/${id}`,
      );
      newSocket.onopen = () => {
        console.warn(
          `WebSocket in CHAT ELEMENT: '${process.env.SOCKET_CHAT}/ws/chat/' for chatID: `,
          id,
          " OPENED",
          newSocket.readyState,
        );
      };
      newSocket.onmessage = (event) => {
        // console.log("Socket", newSocket);
        const data = event.data;
        function isJSON(data) {
          try {
            JSON.parse(data);
            return true;
          } catch (error) {
            return false;
          }
        }
        if (isJSON(data)) {
          const jsonData = JSON.parse(data);
          // console.log("Message received in CHAT ELEMENT:", jsonData);
          if (jsonData.tcm === "TCM01") {
            // console.log(
            //   "Message received in CHAT ELEMENT:",
            //   jsonData.contents[0].value,
            // );
            setTimestamp(jsonData.timestamp);

            if (jsonData.userID === localStorage.getItem("userID")) {
              const topChatToShow = (topChat2) => {
                const contents = topChat2.contents;
                const lastContent = contents[contents.length - 1];
                if (lastContent.key === "text") {
                  return lastContent.value;
                } else if (lastContent.key === "image") {
                  return "Hình ảnh";
                } else if (
                  lastContent.key.startsWith("zip") ||
                  lastContent.key.startsWith("pdf") ||
                  lastContent.key.startsWith("xlsx") ||
                  lastContent.key.startsWith("doc") ||
                  lastContent.key.startsWith("docx") ||
                  lastContent.key.startsWith("rar")
                ) {
                  return "File";
                } else if (lastContent.key === "emoji") {
                  return lastContent.value;
                } else {
                  return "Tin nhắn mới";
                }
              };
              setNewMessage("Bạn: " + topChatToShow(jsonData) + "t!@#%&*()_+");
            } else {
              setNewMessage(jsonData.contents[0].value);
            }
            if (
              jsonData.tcm === "TCM01" &&
              jsonData.userID !== localStorage.getItem("userID")
            ) {
              playNotificationSound();
              console.log(">>>>>playNotificationSound>>>>>>>>>");
            }
          }
          // Xử lý dữ liệu được gửi đến ở đây
          // if (jsonData.tcm === "TCM04") {
          //   const messageIDToDelete = jsonData.messageID;
          //   // Lọc ra các tin nhắn mà không có messageIDToDelete
          //   const updatedMessages = conversationsIndex.filter(
          //     (msg) => msg.messageID !== messageIDToDelete,
          //   );
          //   setConversationsIndex(updatedMessages);
          //   console.log("Updated messages after deleting:", updatedMessages);
          // }
        } else {
          // console.error("Received data is not valid JSON:", data);
          // Xử lý dữ liệu không phải là JSON ở đây (nếu cần)
        }
      };
      setSocket(newSocket);
      return () => {
        if (newSocket.readyState === 1) {
          newSocket.close(); // Đóng kết nối khi component unmount hoặc userID thay đổi
        }
      };
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const timestamp = Date.now();
      const fetchedMessages = await fetchMessages(
        id,
        0,
        2,
        tokenFromCookies,
        timestamp,
      );
      // console.log(`>>>>>${chatName}>>>>>>>>`, fetchedMessages);
      setTopChat(fetchedMessages[fetchedMessages.length - 1]);
      const topChat2 = fetchedMessages[fetchedMessages.length - 1];
      const topChatToShow = () => {
        const contents = topChat2.contents;
        const lastContent = contents[contents.length - 1];
        if (lastContent.key === "text") {
          return lastContent.value;
        } else if (lastContent.key === "image") {
          return (
            <span className="flex items-center">
              <img
                src="/src/assets/icons/image.png"
                alt=""
                className="h-[14px] w-[14px]"
              />
              &nbsp;Hình ảnh
            </span>
          );
        } else if (
          lastContent.key.startsWith("zip") ||
          lastContent.key.startsWith("pdf") ||
          lastContent.key.startsWith("xlsx") ||
          lastContent.key.startsWith("doc") ||
          lastContent.key.startsWith("docx") ||
          lastContent.key.startsWith("rar")
        ) {
          return (
            <span className="flex items-center">
              <img
                src="/src/assets/icons/file-default.png"
                alt=""
                className="h-[14px] w-[14px]"
              />
              &nbsp;File
            </span>
          );
        } else if (lastContent.key === "emoji") {
          return lastContent.value;
        } else {
          return "Tin nhắn mới";
        }
      };
      if (topChat2) setTopChatToShow(topChatToShow());
    };
    if (id && tokenFromCookies) fetchData();
  }, [id, tokenFromCookies]);
  // console.log(">>>>>TOPCHAT>>>>>>>>>", topChat);

  // console.log(">>>>>TOPCHATTOHOW>>>>>>>>>", topChatToShow());

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // Tăng thời gian timestamp lên 1 giây
  //     setTimeOrginal((prevTimestamp) => {
  //       const newTimestamp = new Date(prevTimestamp);
  //       newTimestamp.setSeconds(newTimestamp.getSeconds() + 1);
  //       return newTimestamp;
  //     });
  //   }, 1000);

  //   // Xóa interval khi component unmount
  //   return () => clearInterval(interval);
  // }, []);

  //Tính số lượng tin nhắn chưa đọc
  // function countUnreadMessages(data) {
  //   let unreadCount = 0;

  //   data.forEach((chat) => {
  //     chat.chatActivity.forEach((message) => {
  //       if (message.userID !== "1" && message.status.read.length === 0) {
  //         unreadCount++;
  //       }
  //     });
  //   });

  //   return unreadCount;
  // }
  // Sử dụng hàm với dữ liệu của bạn
  // const unreadCount = countUnreadMessages(topChatActivity);
  // console.log("Số tin nhắn chưa đọc:", unreadCount);
  // const statusRead = topChatActivity[a].chatActivity[b].status.read.length;
  // console.log(">>>>>>>>>>>>>>", statusRead);

  function formatTimeDifference(timestamp) {
    const currentDate = new Date();
    // console.log(currentDate);
    const parsedTimestamp = new Date(timestamp);
    // console.log(parsedTimestamp);

    const minutesDifference = differenceInMinutes(currentDate, parsedTimestamp);

    if (minutesDifference < 1) {
      return `${Math.floor(minutesDifference * 60)} giây`;
    }

    const hoursDifference = differenceInHours(currentDate, parsedTimestamp);

    if (hoursDifference < 1) {
      return `${Math.floor(minutesDifference)} phút`;
    }

    const daysDifference = differenceInDays(currentDate, parsedTimestamp);

    if (daysDifference < 1) {
      return `${Math.floor(hoursDifference)} giờ`;
    }

    const monthsDifference = differenceInMonths(currentDate, parsedTimestamp);

    if (monthsDifference < 1) {
      return `${Math.floor(daysDifference)} ngày`;
    }

    const yearsDifference = differenceInYears(currentDate, parsedTimestamp);

    return `${Math.floor(monthsDifference)} tháng`;
  }

  const [timestamp, setTimestamp] = useState(lastUpdateAt);
  // const [timeOrginal, setTimeOrginal] = useState(new Date(timestamp));
  const [timeDifference, setTimeDifference] = useState("");
  // console.log("timestamp", timestamp);
  // const timestamp = lastUpdateAt;
  // const timestamp = topChatActivity[a].chatActivity[b].timetamp;

  const originalDate = new Date(timestamp);
  const adjustedDate = new Date(originalDate.getTime());
  useEffect(() => {
    setTimeDifference(formatTimeDifference(adjustedDate));
  }, [timestamp]);
  // console.log(timeDifference);

  // useEffect(() => {
  //   const originalDate = new Date(timestamp);
  //   const adjustedDate = new Date(timeOrginal.getTime());
  //   setTimeDifference(formatTimeDifference(adjustedDate));
  // }, [timeOrginal]);
  // console.log(timeDifference);

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

  const [readByOnClick, setReadByOnClick] = useState(false);
  const handOnClick = () => {
    setReadByOnClick(true);
    // console.log(">>>>>CHATNAME>>>>>>>>>", chatName);
    // console.log(">>>>>CHATID>>>>>>>>>", id);
    sessionStorage.setItem("chatID", id);
  };

  useEffect(() => {
    setReadByOnClick(false);
  }, [id]);
  return (
    <div
      onClick={() => {
        handOnClick();
      }}
      className={`${
        readByOnClick && id === sessionStorage.getItem("chatID")
          ? "bg-[#E1EDFE]"
          : ""
      }  z-50 pl-4 pr-1`}
    >
      {topChatActivity.length >= 0 ? (
        <div
          className={`flex h-[74px] w-full items-center pr-2 ${
            // countTopChatActivity <= 10 ? "pr-1" : ""
            "pr-1"
          }`}
        >
          {/* <img
            src={chatAvatar}
            alt="avatar"
            className="aspect-w-1 aspect-h-1 h-12 w-12 rounded-full object-cover"
          /> */}
          <Avatar
            // alt="avatar"
            src={chatAvatar}
            sx={{ width: 48, height: 48 }}
          />
          <div
            className="flex grow justify-between pl-3 md:w-[342px]"
            id="content"
          >
            <div className="">
              {newMessage ? (
                newMessage.includes("t!@#%&*()_+") ? (
                  <div className="grid gap-y-1">
                    <div>
                      <span className="text-base font-semibold text-[#081C36]">
                        {chatName}
                      </span>
                    </div>
                    <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#7589A3] duration-200  md:min-w-full">
                      <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
                        {/* {messageContent}
                        {newMessage} */}
                        {newMessage.includes("Hình ảnh") && (
                          <>
                            <span className="flex items-center">
                              Bạn:&nbsp;
                              <img
                                src="/src/assets/icons/image.png"
                                alt=""
                                className="h-[14px] w-[14px]"
                              />
                              &nbsp;Hình ảnh
                            </span>
                          </>
                        )}
                        {newMessage.includes("File") && (
                          <>
                            <span className="flex items-center">
                              Bạn:&nbsp;
                              <img
                                src="/src/assets/icons/file-default.png"
                                alt=""
                                className="h-[14px] w-[14px]"
                              />
                              &nbsp;File
                            </span>
                          </>
                        )}
                        {!newMessage.includes("Hình ảnh") &&
                          !newMessage.includes("File") &&
                          newMessage.replace("t!@#%&*()_+", "")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-y-1">
                    <div>
                      <span className="text-base font-semibold text-[#081C36]">
                        {chatName}
                      </span>
                    </div>
                    <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#081C36] duration-200  md:min-w-full">
                      <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
                        {/* {messageContent} */}
                        {newMessage}
                      </span>
                    </div>
                  </div>
                )
              ) : topChat && topChat.userID === userIDFromCookies ? (
                <>
                  <div className="grid gap-y-1">
                    <div>
                      <span className="text-base font-semibold text-[#081C36]">
                        {chatName}
                      </span>
                    </div>
                    <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#7589A3] duration-200 md:w-[175px] md:min-w-full">
                      <span>Bạn:&nbsp;</span>
                      <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
                        {topChatToShow}
                        {/* {messageContentInTopChatActivity} */}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-y-1">
                    <div>
                      <span className="text-base font-semibold text-[#081C36]">
                        {chatName}
                      </span>
                    </div>
                    <div
                      className={`transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm ${
                        readByOnClick
                          ? "font-medium text-[#7589A3]"
                          : "font-bold text-[#081C36] "
                      }  duration-200  md:min-w-full`}
                    >
                      <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
                        {topChatToShow}
                        {/* {messageContentInTopChatActivity} */}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-[-4px] grid gap-y-1 ">
              <div>
                <span className="truncate text-xs">{timeDifference}</span>
              </div>
              {unreadCount != 0 ? (
                <>
                  <div className="flex h-4 w-4 flex-grow items-center justify-center place-self-end rounded-full bg-[#C81A1F] text-white">
                  <span className="text-xs">{unreadCount}</span>
                </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ChatElement;