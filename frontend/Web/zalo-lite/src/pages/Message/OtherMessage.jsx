import Avatar from "@mui/material/Avatar";
function OtherMessage() {
  const otherMessage = [
    {
      id: 1,
      chatName: "Nhà Thuốc Long Châu",
      chatAvatar:
        "https://yt3.googleusercontent.com/SrsBKv7Ukw0_ISKiMq9hGkrnok0APAB2EXvcJZd_r5awsGJhD2jMaaMWY3mNADWqrgrX1zDX=s900-c-k-c0x00ffffff-no-rj",
      lastMessage:
        "HÈ KHOẺ KHOẮN BẤT TẬN - ƯU ĐÃI BẤT NGỜ HÀNG ANH, NHẬT, ÚC GIẢM ĐẾN 30%",
      lastMessageTime: "3 ngày",
    },
    {
      id: 2,
      chatName: "Điện Máy Xanh",
      chatAvatar:
        "https://mms.img.susercontent.com/930b1db64ce0c65543d9a23d89a07e07",
      lastMessage: "ĐIỆN MÁY XANH - MUA SẮM ONLINE AN TOÀN - GIAO HÀNG TẬN NƠI",
      lastMessageTime: "7 ngày",
    },
  ];

  return (
    <div className="h-screen w-full overflow-auto">
      <div className="flex w-full items-center pr-2">
        <div className="h-[calc(100vh-95px)] w-full overflow-auto">
          {otherMessage &&
            otherMessage.map((conversation) => (
              <div className="flex h-[74px] w-full items-center">
                <Avatar
                  src={conversation.chatAvatar}
                  sx={{ width: 48, height: 48 }}
                />
                <div
                  className="flex grow justify-between pl-3 md:w-[342px]"
                  id="content"
                >
                  <div className="">
                    <div className="grid gap-y-1">
                      <div>
                        <span className="text-base font-semibold text-[#081C36]">
                          {conversation.chatName}
                        </span>
                      </div>
                      <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#7589A3] duration-200 md:w-[175px] md:min-w-full">
                        <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
                          {conversation.lastMessage}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[-4px] grid gap-y-1 ">
                    <div>
                      <span className="truncate text-xs">
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default OtherMessage;
