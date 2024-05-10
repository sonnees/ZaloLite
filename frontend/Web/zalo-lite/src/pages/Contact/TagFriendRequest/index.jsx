import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { message, Space } from "antd";
import { v4 as uuidv4 } from "uuid";
function TagFriendRequest() {
  const tokenFromCookies = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const [friendRequested, setFriendRequested] = useState([]);
  useEffect(() => {
    if (userID) {
      const newSocket = new WebSocket(`ws://localhost:8082/ws/user/${userID}`);
      newSocket.onopen = () => {
        console.warn(
          "WebSocket 'ws://localhost:8082/ws/user/' for UserID: ",
          userID,
          " OPENED",
        );
      };

      newSocket.onmessage = (event) => {
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
          console.log(
            "Message received InTagFriendRequest +++++++++++++++++++++:",
            jsonData,
          );
          console.log("senderName", jsonData.senderName);
          console.log("tum>>>>>>>>>", jsonData.tum);
          // Xử lý dữ liệu được gửi đến ở đây
          if (jsonData.tum === "TUM02") {
            setFriendRequest(
              friendRequest.filter((f) => f.userID !== jsonData.senderID),
            );
          }
          if (jsonData.tum === "TUM01") {
            const newFriendRequest = {
              userID: jsonData.id,
              userName: jsonData.senderName,
              userAvatar: jsonData.senderAvatar,
              description: jsonData.description,
              sendAt: Date.now(),
              isSender: false,
            };
            setFriendRequest([...friendRequest, newFriendRequest]);
          }
        } else {
          // console.error("Received data is not valid JSON:", data);
          // Xử lý dữ liệu không phải là JSON ở đây (nếu cần)
        }
      };

      setSocket(newSocket);
    }
  }, [userID]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8082/api/v1/user/info/${userID}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tokenFromCookies,
            },
          },
        );
        setFriendRequests(response.data.friendRequests); // Cập nhật state với dữ liệu từ API
        setFriendRequest(
          response.data.friendRequests.filter(
            (friendRequest) => !friendRequest.isSender,
          ),
        );
        setFriendRequested(
          response.data.friendRequests.filter(
            (friendRequest) => friendRequest.isSender,
          ),
        );
        //   localStorage.setItem(
        //     "conversations",
        //     JSON.stringify(response.data.friendRequests),
        //   );
      } catch (error) {
        console.error("Error fetching friendRequests:", error);
      }
    };

    // Chỉ fetch nếu userID và token đã được thiết lập
    if (userID && tokenFromCookies) {
      fetchConversations();
    }
  }, [userID, tokenFromCookies]);

  // Hàm để chuyển đổi chuỗi ngày tháng sang định dạng "dd/mm"
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate(); // Lấy ngày
    const month = date.getMonth() + 1; // Lấy tháng (lưu ý: tháng bắt đầu từ 0)
    // Đảm bảo định dạng 'dd/mm' cho ngày và tháng
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;
    // Trả về chuỗi ngày tháng đã được định dạng
    return formattedDay + "/" + formattedMonth;
  }

  const handleAcceptFriendRequest = (
    receiverID,
    receiverName,
    receiverAvatar,
  ) => {
    const message = {
      id: uuidv4(),
      tum: "TUM03",
      senderID: userID,
      senderName: localStorage.getItem("userName"),
      senderAvatar: localStorage.getItem("avatar"),
      receiverID: receiverID,
      receiverName: receiverName,
      receiverAvatar: receiverAvatar,
    };

    const newSocket = new WebSocket(
      `ws://localhost:8082/ws/user/${receiverID}`,
    );

    newSocket.onopen = () => {
      console.warn(
        "WebSocket 'ws://localhost:8082/ws/user/' for UserID: ",
        receiverID,
        " OPENED",
      );
      // Gửi tin nhắn khi kết nối thành công
      newSocket.send(JSON.stringify(message));
      console.log("Message sent:", message);
    };

    newSocket.onmessage = (event) => {
      console.log("Message received:", event.data);
      // Xử lý dữ liệu được gửi đến ở đây
    };

    newSocket.onclose = () => {
      console.warn(
        "WebSocket 'ws://localhost:8082/ws/user/' for UserID: ",
        receiverID,
        " CLOSED",
      );
    };
    setFriendRequest(friendRequest.filter((f) => f.userID !== receiverID));
  };

  const handleRemoveFriendRequest = (receiverID) => {
    const message = {
      id: uuidv4(),
      tum: "TUM02",
      senderID: userID,
      receiverID: receiverID,
    };

    const newSocket = new WebSocket(
      `ws://localhost:8082/ws/user/${receiverID}`,
    );

    newSocket.onopen = () => {
      console.warn(
        "WebSocket 'ws://localhost:8082/ws/user/' for UserID: ",
        receiverID,
        " OPENED",
      );
      // Gửi tin nhắn khi kết nối thành công
      newSocket.send(JSON.stringify(message));
      console.log("Message sent:", message);
    };

    newSocket.onmessage = (event) => {
      console.log("Message received:", event.data);
      // Xử lý dữ liệu được gửi đến ở đây
    };

    newSocket.onclose = () => {
      console.warn(
        "WebSocket 'ws://localhost:8082/ws/user/' for UserID: ",
        receiverID,
        " CLOSED",
      );
    };
    setFriendRequested(friendRequested.filter((f) => f.userID !== receiverID));
  };

  const [socket, setSocket] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const showMessage = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
      duration: 10,
    });
  };

  return (
    <div className="">
      <div className="flex h-[65px] items-center border-b border-[#BDC2C7] bg-white px-[19px]">
        <img src="/friend-request.png" alt="" className="h-[24px] w-[24px]" />
        <div className="ml-3">
          <span className=" text-base font-semibold text-tblack">
            Lời mời kết bạn
          </span>
        </div>
      </div>
      <div className="h-screen bg-[#F6F6F7] pl-4">
        <div>
          <div className="flex h-[64px] items-center">
            <span className="text-sm font-semibold">
              Lời mời đã nhận ({friendRequest.length})
            </span>
          </div>
          <div className="flex w-full flex-wrap">
            {friendRequest.map((friendRequest, index) => (
              <div
                key={index}
                className="mb-[10px] mr-[10px] h-[216px] rounded bg-white p-4 sm:w-[100%] md:w-[100%] lg:w-[48%] xl:w-[32%]"
              >
                <div>
                  <div
                    className={`group -mt-[10px] flex h-[70px] w-full items-center transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-100`}
                  >
                    <img
                      src={friendRequest.userAvatar}
                      alt="avatar"
                      className="aspect-w-1 aspect-h-1 h-12 w-12 rounded-full object-cover"
                    />
                    <div
                      className="flex grow justify-between pl-3 md:w-[342px]"
                      id="content"
                    >
                      <div className="">
                        <div className="grid gap-y-1">
                          <div>
                            <span className="text-base font-semibold text-[#081C36]">
                              {friendRequest.userName}
                            </span>
                          </div>
                          <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#081C36] duration-200  md:min-w-full">
                            <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap text-xs font-normal text-[#7589A3] md:w-[175px]">
                              {formatDate(friendRequest.sendAt) +
                                " - Từ số điện thoại"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-[-4px] grid items-center justify-center gap-y-1">
                        <div className="align-center flex-1 justify-center">
                          <div className="flex h-full items-center justify-center">
                            <img
                              src="/go-to-chat.png"
                              alt=""
                              className="w-[22px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex h-[63px] w-full rounded border bg-[#F6F6F7] p-2">
                  <span className="text-xs text-tblack">
                    {friendRequest.description}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <button
                    className="mr-2 h-10 w-[50%] rounded border bg-[#EAEDF0] text-base font-medium text-tblack"
                    onClick={() => {
                      //   handleOpenDialog3(setOpenDialog);
                    }}
                  >
                    Từ chối
                  </button>
                  <button
                    className="h-10 w-[50%] rounded border bg-[#E5EFFF] text-base font-medium text-[#005ae0]"
                    onClick={() =>
                      handleAcceptFriendRequest(
                        friendRequest.userID,
                        friendRequest.userName,
                        friendRequest.userAvatar,
                      )
                    }
                  >
                    Đồng ý
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Item lời mời đã nhận */}

          <div>
            <div className="flex h-[64px] items-center">
              <span className="text-sm font-semibold">
                Lời mời đã gửi ({friendRequested.length})
              </span>
            </div>
          </div>
          <div className="flex w-full flex-wrap">
            {friendRequested.map((friendRequest, index) => (
              <div
                key={index}
                className="mb-[10px] mr-[10px] h-[140px] rounded bg-white p-4 sm:w-[100%] md:w-[100%] lg:w-[48%] xl:w-[32%]"
              >
                <div>
                  <div
                    className={`group -mt-[10px] flex h-[70px] w-full items-center transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-100`}
                  >
                    <img
                      src={friendRequest.userAvatar}
                      alt="avatar"
                      className="aspect-w-1 aspect-h-1 h-12 w-12 rounded-full object-cover"
                    />
                    <div
                      className="flex grow justify-between pl-3 md:w-[342px]"
                      id="content"
                    >
                      <div className="">
                        <div className="grid gap-y-1">
                          <div>
                            <span className="text-base font-semibold text-[#081C36]">
                              {friendRequest.userName}
                            </span>
                          </div>
                          <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#081C36] duration-200  md:min-w-full">
                            <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap text-xs font-normal text-[#7589A3] md:w-[175px]">
                              {formatDate(friendRequest.sendAt) +
                                " - Bạn đã gửi lời mời"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-[-4px] grid items-center justify-center gap-y-1">
                        <div className="align-center flex-1 justify-center">
                          <div className="flex h-full items-center justify-center">
                            <img
                              src="/go-to-chat.png"
                              alt=""
                              className="w-[22px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <button
                    className="h-10 w-[100%] rounded border bg-[#EAEDF0] text-base font-medium text-tblack"
                    onClick={() => {
                      handleRemoveFriendRequest(friendRequest.userID);
                    }}
                  >
                    Thu hồi lời mời
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TagFriendRequest;
