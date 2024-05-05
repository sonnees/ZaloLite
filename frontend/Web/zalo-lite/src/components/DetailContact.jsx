import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import React from "react";
import MessageDetail from "./MessageDetail";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons";
import { grey } from "@mui/material/colors";
import { Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function DetailContact({isListFriend}) {
  const navigate = useNavigate();
  const storedData  = JSON.parse(localStorage.getItem("conversations"));
  const data = isListFriend ? storedData.filter(conversation => conversation.type !== "GROUP") : storedData.filter(conversation => conversation.type === "GROUP")

  const RenderItem = ({ data }) =>
    data.map((item, index) => (
      <div key={index} className="py-4">
        <Link key={item.chatID} to={{ pathname: item.type === 'GROUP' ? 'chatGroup' : 'chat', search: `?id=${item.chatID}&type=individual-chat&chatName=${item.chatName}&chatAvatar=${item.chatAvatar}`, state: { prevPath: 'contact' },}} className="block cursor-pointer hover:bg-slate-50">
          <div className="flex flex-row items-center p-4">
            <Avatar alt={item.chatAvatar} src={item.chatAvatar} className="m-4" />
            <div className="w-full border-b p-4 py-5">{item.chatName}</div>
          </div>
        </Link>
      </div>
    ));

  return (
    <div className="h-screen w-full">
      <div className="h-[69px] w-full">
        <div className="flex h-full w-full flex-row items-center justify-between border-b">
          <div className="flex flex-row items-center gap-x-2 px-4">
            <FontAwesomeIcon icon={faAddressBook} className="pl-1 pr-3" />
            <div className="flex flex-col">
              <div className="text-lg font-medium text-[#081c36]">
                {isListFriend?(<span>Danh sách bạn bè</span>):(<span>Danh sách nhóm và cộng đồng</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="h-[700px] w-full overflow-auto bg-neutral-100 p-4 pr-2">
          <div className="pb-4 font-medium">Bạn bè</div>

          <div className="rounded-l bg-white p-4 ">
            <RenderItem data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
