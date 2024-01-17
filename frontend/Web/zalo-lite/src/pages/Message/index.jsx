import conversations from "../../data/conversations";
import ChatElement from "../../components/ChatElement";

function Message() {
  return (
    <div className="h-screen w-full overflow-auto">
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
        <ChatElement
          key={conversation.userID}
          id={conversation.userID}
          name={conversation.userName}
          {...conversation}
        />
      ))}
      <div className="h-[160px]">
        <p className="mt-5 text-center text-sm">
          Zalo chỉ hiển thị tin nhắn từ sau lần đăng nhập đầu tiên trên trình
          duyệt này.
        </p>
      </div>
    </div>
  );
}

export default Message;
