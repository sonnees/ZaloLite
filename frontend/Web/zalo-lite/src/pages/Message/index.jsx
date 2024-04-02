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
import conversations from "../../data/conversations";
import ChatElement from "../../components/ChatElement";
import { Link, useNavigate } from "react-router-dom";

function Message() {
  const navigate = useNavigate();
  // const [conversations, setConversations] = useState([]);
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          "http://localhost:8082/api/v1/user/info/3000f6da-e5c7-43eb-9733-f772672779e1",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6IjAwMDAwMDAwMDAiLCJpYXQiOjE3MTE2MTg0NjcsImV4cCI6MTcxMTcyNjQ2N30.kZkUgVoIYj_97LgkWHMPhmVHmalSR1IH88oBr0DCvD8",
            },
            method: "GET",
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        // setConversations(data); // Cập nhật state với dữ liệu từ API
        console.log('====================================');
        console.log(data);
        console.log('====================================');
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []); // Sử dụng dependency array rỗng để fetch dữ liệu chỉ một lần khi component được render

  const handleConversationClick = (conversation) => {
    // Di chuyển đến route Conversation với các query parameters tương ứng
    navigate(`chat?id=${conversation.userID}&type=individual-chat`);
  };

  return (
    <div className="h-[calc(100vh-95px)] w-full overflow-auto">
      {conversations.map((conversation) => (
        <Link
          key={conversation.userID}
          to={`chat?id=${conversation.userID}&type=individual-chat`}
          className="block cursor-pointer hover:bg-slate-50"
        >
          <ChatElement
            id={conversation.userID}
            key={conversation.userID}
            name={conversation.userName}
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
