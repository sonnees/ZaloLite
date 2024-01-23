import React from "react";
import Button from "@mui/material/Button";

export default function AvatarNameItem({ name, avatar, phone, btnMakeFriend, suggest }) {
  return (
    <div className="flex h-[55px] w-full items-center">
      <img
        src={avatar}
        alt="avatar"
        className="aspect-w-1 aspect-h-1 h-10 w-10 rounded-full object-cover"
      />
      <div className="flex grow justify-between pl-3 md:w-[342px]" id="content">
        <div className="">
          <div className="grid gap-y-1">
            <div>
              <span className="text-tblack text-base font-normal">{name}</span>
            </div>
            <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium duration-200  md:min-w-full">
              <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap text-xs font-light text-[#7589a3] md:w-[175px]">
                {phone}
                {suggest}
              </span>
            </div>
          </div>
        </div>
        <div className="grid gap-y-1 items-center">{btnMakeFriend}</div>
      </div>
    </div>
  );
}
