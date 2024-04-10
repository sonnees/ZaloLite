import React, { useState, useEffect } from "react";
import ChatElement from "../../components/ChatElement";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import { useUser } from "../../context/UserContext";

function Message() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [conversations, setConversations] = useState([]);
  const [userIDFromCookies, setUserIDFromCookies] = useState(null);
  const [tokenFromCookies, setTokenFromCookies] = useState(null);
  const [flag, setFlag] = useState(false);
  const { userID } = useUser();

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

  // Sử dụng useEffect để lưu conversations vào localStorage khi component unmount
  useEffect(() => {
    const conversations = localStorage.getItem("conversations");
    if (conversations) {
      console.log("conversations", JSON.parse(conversations));
      setConversations(JSON.parse(conversations));
    }
  }, []);

  // Sử dụng useEffect để lấy userID từ cookies khi component được mount
  useEffect(() => {
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
    console.log("chayyyyy");
    console.log("userIDFromCookies", userID);
    console.log("tokenFromCookies", tokenFromCookie);
  }, [flag]); // Sử dụng flag làm dependency của useEffect này

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/api/v1/user/info/${userID}`,
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
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    // Chỉ fetch nếu userID và token đã được thiết lập
    if (userID && tokenFromCookies) {
      fetchConversations();
    }
  }, [flag, userID]); // Sử dụng flag và userID làm dependency của useEffect này

  const handleConversationClick = (conversation) => {
    navigate(`chat?id=${conversation.userID}&type=individual-chat`);
  };
  console.log("chay render", conversations);
  return (
    <div className="h-[calc(100vh-95px)] w-full overflow-auto">
      {conversations.map((conversation) => (
        <Link
          key={conversation.chatID}
          to={{
            pathname: `chat`,
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
      <div className="h-[60px]">
        <p className="mt-5 text-center text-sm">
          Zalo chỉ hiển thị tin nhắn từ sau lần đăng nhập đầu tiên trên trình
          duyệt này.
        </p>
      </div>
    </div>
  );
}

export default Message;
