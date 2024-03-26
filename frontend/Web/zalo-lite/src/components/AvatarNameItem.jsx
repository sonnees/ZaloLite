import React from "react";

export default function AvatarNameItem({ data, type }) {
  return (
    <div
      className={`flex h-[74px] w-full items-center pr-2 ${
        9 <= 10 ? "pr-1" : ""
      }`}
    >
      <img
        src={data.avatar}
        alt="avatar"
        className="aspect-w-1 aspect-h-1 h-12 w-12 rounded-full object-cover"
      />
      <div className="flex grow justify-between pl-3 md:w-[342px]" id="content">
        <div className="">
          {1 != 0 ? (
            <>
              <div className="grid gap-y-1">
                <div>
                  {type == "AF" && (
                    <span className="text-base text-[#081C36]">
                      {data.name}
                    </span>
                  )}
                  {type == "MS" && (
                    <span className="text-base font-semibold text-[#081C36]">
                      {data.name}
                    </span>
                  )}
                </div>
                <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#081C36] duration-200  md:min-w-full">
                  {type == "AF" && (
                    <span className="text-xs font-light text-[#7589A3]">
                      {data.phoneNumber}
                    </span>
                  )}
                  {type == "MS" && (
                    <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
                      Xin Chào
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-y-1">
                <div>
                  <span className="text-base font-semibold text-[#081C36]">
                    Trần Quàng Huy
                  </span>
                </div>
                <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#7589A3] duration-200 md:w-[175px] md:min-w-full">
                  <span>Bạn:&nbsp;</span>
                  <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
                    Xin chào
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mt-[-4px] grid gap-y-1 ">
          <div className="border">
            {type == "AF" && (
              <span className="truncate text-lg" style={{ cursor: "pointer" }} >
                &times;
              </span>
            )}
            {type == "MS" && <span className="truncate text-xs">1</span>}
          </div>
          {/* {1 != 0 ? (
            <>
              <div className="flex h-4 w-4 flex-grow items-center justify-center place-self-end rounded-full bg-[#C81A1F] text-white">
                <span className="text-xs">1</span>
              </div>
            </>
          ) : (
            <></>
          )} */}
        </div>
      </div>
    </div>
  );
}
