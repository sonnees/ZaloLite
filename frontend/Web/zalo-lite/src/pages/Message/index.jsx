import React from "react";
import conversations from "../../data/conversations";
import ChatElement from "../../components/ChatElement";
import { useSearchParams } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2";

function Message() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedChatId = searchParams.get("id");

  return (
    <div className="h-[calc(100vh-95px)] w-full overflow-auto">
      {/* <div className="flex h-[74px] w-full items-center border border-black ">
        <img
          src="https://zpsocial-f51-org.zadn.vn/c20081221b9ef5c0ac8f.jpg"
          alt=""
          className="h-12 w-12 rounded-full"
        />
        <div className="flex grow justify-between pl-3" id="content">
          <div className="">
            <div className="grid gap-y-1">
              <div>
                <span className="text-base text-[#081C36]">Hà Anh Thảo</span>
              </div>
              <div className="text-sm text-[#7589A3]">
                <span>Bạn: </span>
                <span className="">oke ông kkk</span>
              </div>
            </div>
          </div>
          <div className="mt-[-4px] grid gap-y-1">
            <div>
              <span className="text-xs">7 Ngày</span>
            </div>
            <div className="flex h-4 w-4 flex-grow items-center justify-center place-self-end rounded-full bg-[#C81A1F] text-white">
              <span className="text-xs">3</span>
            </div>
          </div>
        </div>
      </div> */}
      {conversations.map((conversation) => (
        <div
          key={conversation.userID}
          className="cursor-pointer hover:bg-slate-50"
          onClick={() => {
            searchParams.set("id", conversation.userID);
            searchParams.set("type", "individual-chat");
            setSearchParams(searchParams);
            console.log(searchParams);
          }}
        >
          <ChatElement
            id={conversation.userID}
            key={conversation.userID}
            name={conversation.userName}
            {...conversation}
          />
        </div>
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
