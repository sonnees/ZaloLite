import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import ChatElement from "../../components/ChatElement";
import Alert from "@mui/material/Alert";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { message, Space } from "antd";
import Cookies from "universal-cookie";
import { useUser } from "../../context/UserContext";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function Message() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [conversations, setConversations] = useState([]);
  const [userIDFromCookies, setUserIDFromCookies] = useState(null);
  const [tokenFromCookies, setTokenFromCookies] = useState(null);
  const [flag, setFlag] = useState(false);
  const { cons, setCons, userID } = useUser();

  const [loadCons, setLoadCons] = useState(false);

  const [socket, setSocket] = useState(null);
  const [socketGroup, setSocketGroup] = useState(null);
  const [stateNotification, setStateNotification] = React.useState({
    open: false,
    Transition: Fade,
    name: "",
  });

  const [messageApi, contextHolder] = message.useMessage();
  const showMessage = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
      duration: 10,
    });
  };

  const handleClick = (Transition) => () => {
    console.log("click");
    setStateNotification({
      open: true,
      Transition,
    });
  };

  function isJSON(data) {
    try {
      JSON.parse(data);
      return true;
    } catch (error) {
      return false;
    }
  }

  useEffect(() => {
    if (userID) {
      const newSocket = new WebSocket(`${process.env.SOCKET_CHAT}/ws/group`);
      newSocket.onopen = () => {
        console.warn(
          `WebSocket '${process.env.SOCKET_CHAT}/ws/group' for UserID: `,
          userID,
          " OPENED",
        );
      };

      newSocket.onmessage = (event) => {
        const data = event.data;
        if (isJSON(data)) {
          const jsonData = JSON.parse(data);
          console.log("Message received:", jsonData);
          // Xử lý dữ liệu được gửi đến ở đây
          if (jsonData.tgm === "TGM01") {
            setLoadCons(true);
          }
        } else {
          // console.error("Received data is not valid JSON:", data);
          // Xử lý dữ liệu không phải là JSON ở đây (nếu cần)
        }
      };

      setSocketGroup(newSocket);

      return () => {
        newSocket.close(); // Đóng kết nối khi component unmount hoặc userID thay đổi
      };
    }
  }, [userID]);

  useEffect(() => {
    if (userID) {
      const newSocket = new WebSocket(
        `${process.env.SOCKET_CHAT}/ws/user/${userID}`,
      );
      newSocket.onopen = () => {
        console.warn(
          `WebSocket '${process.env.SOCKET_CHAT}/ws/user/' for UserID: `,
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
          console.log("Message received:", jsonData);
          console.log("senderName", jsonData.senderName);
          console.log("tum>>>>>>>>>", jsonData.tum);
          // Xử lý dữ liệu được gửi đến ở đây
          if (jsonData && jsonData.tum === "TUM03") {
            const content = `${jsonData.senderName} đã chấp nhận lời mời kết bạn!`;
            console.log("content", content);
            showMessage("success", content);
            console.log("Runnn");
          } else if (jsonData) {
            setStateNotification({
              open: true,
              SlideTransition,
              name: jsonData.senderName,
            });
          }
        } else {
          // console.error("Received data is not valid JSON:", data);
          // Xử lý dữ liệu không phải là JSON ở đây (nếu cần)
        }
      };

      setSocket(newSocket);
    }
  }, [userID]);

  const handleClose = () => {
    setStateNotification({
      ...state,
      open: false,
    });
  };

  // Hàm để lấy userID từ cookies và giải mã nó
  const getUserIDFromCookie = () => {
    // Lấy userID từ cookies
    const userIDFromCookie = cookies.get("userID");

    // Nếu có userID từ cookies, giải mã và trả về
    if (userIDFromCookie) {
      return userIDFromCookie;
    }

    // Nếu không có userID từ cookies, trả về null
    return null;
  };

  useEffect(() => {
    const conversations = localStorage.getItem("conversations");
    if (conversations) {
      // console.log("conversations", JSON.parse(conversations));
      setConversations(JSON.parse(conversations));
    }
  }, []);

  // Sử dụng useEffect để lưu conversations vào localStorage khi component unmount
  useEffect(() => {
    if (loadCons) {
      const conversations = localStorage.getItem("conversations");
      if (conversations) {
        // console.log("conversations", JSON.parse(conversations));
        setConversations(JSON.parse(conversations));
      }
      setLoadCons(false);
    }
  }, [loadCons]);

  // Sử dụng useEffect để lấy userID từ cookies khi component được mount
  useEffect(() => {
    if (!flag) {
      // Gán giá trị lấy được từ cookies vào state userIDFromCookies
      const userID = getUserIDFromCookie() || localStorage.getItem("userID");
      setUserIDFromCookies(userID);

      // Lấy token từ cookies và giải mã nó
      const tokenFromCookie =
        cookies.get("token") || localStorage.getItem("token");
      if (tokenFromCookie) {
        setTokenFromCookies(tokenFromCookie);
      }
      setFlag(true);
      // console.log("chayyyyy");
      // console.log("userIDFromCookies", userID);
      // console.log("tokenFromCookies", tokenFromCookie);
    }
    /*     console.log("userIDFromCookies", userID);
    console.log("tokenFromCookies", tokenFromCookie); */
  }, [flag]); // Sử dụng flag làm dependency của useEffect này

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `${process.env.HOST}/api/v1/user/info/${userID}`,
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
        setConversations(data.conversations); // Cập nhật state với dữ liệu từ API
        localStorage.setItem(
          "conversations",
          JSON.stringify(data.conversations),
        );
        console.log(cons);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    // Chỉ fetch nếu userID và token đã được thiết lập
    if (userID && tokenFromCookies) {
      fetchConversations();
    }
  }, [flag, userID, tokenFromCookies]); // Sử dụng flag và userID làm dependency của useEffect này

  useEffect(() => {
    setConversations(JSON.parse(localStorage.getItem("conversations")));
  }, [cons]);

  // const openFullSocketForChar = (chatID) => {
  //   console.log("chatID", chatID);
  //   if (chatID) {
  //     const newSocket = new WebSocket(`ws://localhost:8082/ws/chat/${chatID}`);
  //     newSocket.onopen = () => {
  //       console.warn(
  //         "WebSocket 'ws://localhost:8082/ws/chat/' for UserID: ",
  //         chatID,
  //         " OPENED",
  //       );
  //     };

  //     newSocket.onmessage = (event) => {
  //       function isJSON(data) {
  //         try {
  //           JSON.parse(data);
  //           return true;
  //         } catch (error) {
  //           return false;
  //         }
  //       }
  //       const data = event.data;
  //       if (isJSON(data)) {
  //         const jsonData = JSON.parse(data);
  //         console.log("Message received:", jsonData);
  //         // Xử lý dữ liệu được gửi đến ở đây
  //         // if (jsonData) {

  //         // }
  //       } else {
  //         // console.error("Received data is not valid JSON:", data);
  //         // Xử lý dữ liệu không phải là JSON ở đây (nếu cần)
  //       }
  //     };

  //     setSocket(newSocket);

  //     return () => {
  //       newSocket.close(); // Đóng kết nối khi component unmount hoặc userID thay đổi
  //     };
  //   }
  // };

  // console.log("chay render", conversations);

  const openFullSocketForChar = (chatID) => {
    console.log("chatID", chatID);
    if (chatID) {
      const newSocket = new WebSocket(
        `${process.env.SOCKET_CHAT}/ws/chat/${chatID}`,
      );
      newSocket.onopen = () => {
        console.warn(
          `WebSocket '${process.env.SOCKET_CHAT}/ws/chat/' for UserID: `,
          chatID,
          " OPENED",
        );
      };

      newSocket.onmessage = (event) => {
        function isJSON(data) {
          try {
            JSON.parse(data);
            return true;
          } catch (error) {
            return false;
          }
        }
        const data = event.data;
        if (isJSON(data)) {
          const jsonData = JSON.parse(data);
          console.log("Message received:", jsonData);
          // Xử lý dữ liệu được gửi đến ở đây
          // if (jsonData) {

          // }
        } else {
          // console.error("Received data is not valid JSON:", data);
          // Xử lý dữ liệu không phải là JSON ở đây (nếu cần)
        }
      };

      setSocket(newSocket);

      return () => {
        newSocket.close(); // Đóng kết nối khi component unmount hoặc userID thay đổi
      };
    }
  };

  return (
    <>
      {contextHolder}
      <div className="h-[calc(100vh-95px)] w-full overflow-auto">
        {conversations &&
          conversations.map((conversation) => (
            <Link
              key={conversation.chatID}
              to={{
                pathname: conversation.type === "GROUP" ? "chatGroup" : "chat",
                search: `?id=${conversation.chatID}&type=individual-chat&chatName=${conversation.chatName}&chatAvatar=${conversation.chatAvatar}`,
              }}
              className="block cursor-pointer hover:bg-slate-50"
            >
              <ChatElement
                id={conversation.chatID}
                key={conversation.chatID}
                chatName={conversation.chatName}
                chatAvatar={conversation.chatAvatar}
                {...conversation}
              />
            </Link>
          ))}
        <div className="h-[60px] w-full ">
          {/* md:w-[342px] */}
          <p className="mt-5 pr-5 text-center text-sm">
            Zalo chỉ hiển thị tin nhắn từ sau lần đăng nhập đầu tiên trên trình
            duyệt này.
          </p>
        </div>
        <Snackbar
          open={stateNotification.open}
          onClose={handleClose}
          TransitionComponent={stateNotification.Transition}
          message="Bạn có lời mời kết bạn mới!"
          key={stateNotification.Transition}
          autoHideDuration={4000}
          style={{ bottom: 20, left: 65, paddingX: 0, marginX: 0 }}
        >
          <Alert
            onClose={handleClose}
            severity="info"
            variant="filled"
            sx={{ width: "100%", paddingX: 1, marginX: 0, marginLeft: 0 }}
          >
            Bạn có lời mời kết bạn từ <strong>{stateNotification.name}</strong>
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default Message;
