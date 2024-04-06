// import React from "react";
// import conversations from "../../data/conversations";
// import ChatElement from "../../components/ChatElement";
// import { useSearchParams } from "react-router-dom";
// import { Scrollbars } from "react-custom-scrollbars-2";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// function Message() {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const selectedChatId = searchParams.get("id");

//   const handleConversationClick = (conversation) => {
//     // Di chuyển đến route Conversation với các query parameters tương ứng
//     navigate(`chat?id=${conversation.userID}&type=individual-chat`);
//   };

//   return (
//     <div className="h-[calc(100vh-95px)] w-full overflow-auto">
//       {/* <div className="flex h-[74px] w-full items-center border border-black ">
//         <img
//           src="https://zpsocial-f51-org.zadn.vn/c20081221b9ef5c0ac8f.jpg"
//           alt=""
//           className="h-12 w-12 rounded-full"
//         />
//         <div className="flex grow justify-between pl-3" id="content">
//           <div className="">
//             <div className="grid gap-y-1">
//               <div>
//                 <span className="text-base text-[#081C36]">Hà Anh Thảo</span>
//               </div>
//               <div className="text-sm text-[#7589A3]">
//                 <span>Bạn: </span>
//                 <span className="">oke ông kkk</span>
//               </div>
//             </div>
//           </div>
//           <div className="mt-[-4px] grid gap-y-1">
//             <div>
//               <span className="text-xs">7 Ngày</span>
//             </div>
//             <div className="flex h-4 w-4 flex-grow items-center justify-center place-self-end rounded-full bg-[#C81A1F] text-white">
//               <span className="text-xs">3</span>
//             </div>
//           </div>
//         </div>
//       </div> */}
//       {conversations.map((conversation) => (
//         <div
//           key={conversation.userID}
//           className="cursor-pointer hover:bg-slate-50"
//           onClick={() => handleConversationClick(conversation)}
//         >
//           {/* <Link to="/auth/login"> */}
//           <ChatElement
//             id={conversation.userID}
//             key={conversation.userID}
//             name={conversation.userName}
//             {...conversation}
//           />
//           {/* </Link> */}
//         </div>
//       ))}
//       <div className="h-[60px]">
//         <p className="mt-5 text-center text-sm">
//           Zalo chỉ hiển thị tin nhắn từ sau lần đăng nhập đầu tiên trên trình
//           duyệt này.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Message;

import React, { useState, useEffect } from "react";
// import conversations from "../../data/conversations";
import ChatElement from "../../components/ChatElement";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import { decryptData } from "../../utils/cookies";

function Message() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [conversations, setConversations] = useState([]);

  // Kiểm tra xem state có tồn tại không trước khi truy cập
  if (state) {
    const { token, phoneNumber } = state;
    // Bây giờ bạn có thể sử dụng token và phoneNumber ở đây
    // console.log(">>>>>>>TOKEn in message>>>>>>>>>>",token);
    // console.log(">>>>>>>PHONENUMBER in message>>>>>>>>",phoneNumber);
  }

  const [userIDFromCookies, setUserIDFromCookies] = useState("");
  const [tokenFromCookies, setTokenFromCookies] = useState("");

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

  // Sử dụng useEffect để lấy userID từ cookies khi component được mount
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

    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/api/v1/user/info/${userID}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tokenFromCookie,
            },
            method: "GET",
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        console.table(data.conversations);
        setConversations(data.conversations); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    console.log("userID>>>>>>>>>>", userID);
    console.log("tokenFromCookie?????????????", tokenFromCookie);
    if (userID && tokenFromCookie) {
      fetchConversations();
    }
  }, []); // Rỗng để chỉ chạy một lần sau khi component được mount

  console.log("userIDFromCookies", userIDFromCookies);

  // useEffect(() => {
    
  // }, [userIDFromCookies, tokenFromCookies]);

  const handleConversationClick = (conversation) => {
    // Di chuyển đến route Conversation với các query parameters tương ứng
    navigate(`chat?id=${conversation.userID}&type=individual-chat`);
  };

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
