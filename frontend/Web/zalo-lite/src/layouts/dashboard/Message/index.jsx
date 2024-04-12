import React, {useEffect, useState} from 'react'
import { Outlet } from 'react-router-dom'

const MessageLayout = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:8082/ws/chat/${id}`);
    newSocket.onopen = () => {
      console.log("WebSocket connected >>>>>>>>HUy");
    };
    setSocket(newSocket);
  }, [socket]);
  return (
    // <div className="flex h-screen w-full grid-flow-col ">
    //   <div className="ml-16 w-full max-w-fit flex-1 border-r md:w-[345px]">
    //     <div className="flex-1 text-gray-500 ">
    //       <Outlet />
    //     </div>
    //   </div>
    //   <div className="hidden w-full overflow-hidden md:flex ">
    //     <div className="h-fit w-max flex-1">
    //       {/* <div className="text-gray-500">
    //             This is content Lorem ipsum dolor sit amet consectetur
    //             adipisicing elit. Nam consequuntur quae modi, quia adipisci hic
    //             iure dolor dicta, dolores repellendus molestias suscipit, ipsum
    //             totam. Culpa cupiditate dolor unde ipsam nobis!
    //           </div> */}
    //       {/* {children} */}
    //     </div>
    //   </div>
    // </div>

    <div className="h-full w-full flex-1 flex-col">
      <div className="w-full flex-1 flex-col border-b px-4">
        <div className="mb-4 flex items-center py-4 pb-3">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="sm"
            className="absolute pl-3"
            style={{ color: "RGB(71, 85, 100)" }}
          />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-8 w-full rounded-md border bg-[#EAEDF0] p-2 pl-[30px] text-sm focus:outline-none"
          />

          <AddFriendDialog />

          <div className="relative inline-block p-1">
            <img
              src="/src/assets/group-user-plus.png"
              alt=""
              className="w-8 cursor-pointer items-center justify-center"
            />
            <div className="absolute inset-0 rounded-md bg-black bg-opacity-0 transition-opacity duration-300 hover:bg-opacity-10"></div>
          </div>
        </div>
        <div className="mt-[-10px] flex flex-row gap-x-2 pb-2">
          <NavLink
            to=""
            onClick={() => {
              {
                //   handleItemSelected("UuTien");
                setItem("UuTien");
              }
            }}
            className={`font-sans text-sm font-semibold  ${
              item == "UuTien"
                ? "mb-[-9px] border-b-2 border-[#005AE0] text-[#005AE0] transition duration-300 ease-in-out"
                : "text-[#7589A3]"
            }`}
          >
            Ưu tiên
          </NavLink>
          <NavLink
            to="other-message"
            onClick={() => {
              {
                //   handleItemSelected("Khac");
                setItem("Khac");
              }
            }}
            className={`font-sans text-sm font-semibold  ${
              item == "Khac"
                ? "mb-[-9px] border-b-2 border-[#005AE0] text-[#005AE0] transition duration-300 ease-in-out"
                : "text-[#7589A3]"
            }`}
          >
            Khác
          </NavLink>
        </div>
      </div>
      <div className="flex-1 pl-4 ">
        <Outlet />
      </div>
    </div>
  );
}

export default MessageLayout;