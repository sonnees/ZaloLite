// import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { NavLink, Outlet } from "react-router-dom";
// import TabList from "@mui/lab/TabList";
// import Message from ".";

// import AddFriendDialog from "../../components/models/AddFriend";

// function MessageFilterBar() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [item, setItem] = useState("UuTien");

//   //   const handleItemSelected = (value) => {
//   //     onItemSelected(value);
//   //   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   return (
//     <div className="flex h-screen w-full grid-flow-col ">
//       <div className="ml-16 w-full max-w-fit flex-1 border-r md:w-[345px]">
//         <div className="flex-1 text-gray-500 ">
//           <div className="h-full w-full flex-1 flex-col">
//             <div className="w-full flex-1 flex-col border-b px-4">
//               <div className="mb-4 flex items-center py-4 pb-3">
//                 <FontAwesomeIcon
//                   icon={faMagnifyingGlass}
//                   size="sm"
//                   className="absolute pl-3"
//                   style={{ color: "RGB(71, 85, 100)" }}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Tìm kiếm"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                   className="h-8 w-full rounded-md border bg-[#EAEDF0] p-2 pl-[30px] text-sm focus:outline-none"
//                 />

//                 <AddFriendDialog />

//                 <div className="relative inline-block p-1">
//                   <img
//                     src="/src/assets/group-user-plus.png"
//                     alt=""
//                     className="w-8 cursor-pointer items-center justify-center"
//                   />
//                   <div className="absolute inset-0 rounded-md bg-black bg-opacity-0 transition-opacity duration-300 hover:bg-opacity-10"></div>
//                 </div>
//               </div>
//               <div className="mt-[-10px] flex flex-row gap-x-2 pb-2">
//                 <NavLink
//                   to=""
//                   onClick={() => {
//                     {
//                       //   handleItemSelected("UuTien");
//                       setItem("UuTien");
//                     }
//                   }}
//                   className={`font-sans text-sm font-semibold  ${
//                     item == "UuTien"
//                       ? "mb-[-9px] border-b-2 border-[#005AE0] text-[#005AE0] transition duration-300 ease-in-out"
//                       : "text-[#7589A3]"
//                   }`}
//                 >
//                   Ưu tiên
//                 </NavLink>
//                 <NavLink
//                   to="other-message"
//                   onClick={() => {
//                     {
//                       //   handleItemSelected("Khac");
//                       setItem("Khac");
//                     }
//                   }}
//                   className={`font-sans text-sm font-semibold  ${
//                     item == "Khac"
//                       ? "mb-[-9px] border-b-2 border-[#005AE0] text-[#005AE0] transition duration-300 ease-in-out"
//                       : "text-[#7589A3]"
//                   }`}
//                 >
//                   Khác
//                 </NavLink>
//               </div>
//             </div>
//             <div className="flex-1 pl-4 ">
//               <Message />
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="hidden w-full overflow-hidden md:flex ">
//         <div className="h-fit w-max flex-1">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MessageFilterBar;

import React, { useState, useEffect, Suspense, lazy } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import TabList from "@mui/lab/TabList";
import { useLocation } from 'react-router-dom';

import AddFriendDialog from "../../components/models/AddFriend";
import CreateGroup from "../../components/models/CreateGroup";

const Message = lazy(() => import(".")); // Lazy load Message component
const OtherMessage = lazy(() => import("./OtherMessage")); // Lazy load OtherMessage component

function MessageFilterBar() {
  const location = useLocation();
  const { state } = location;

  // Kiểm tra xem state có tồn tại không trước khi truy cập
  if (state) {
    const { token, phoneNumber, data } = state;
    // Bây giờ bạn có thể sử dụng token và phoneNumber ở đây
    // console.log(">>>>>>>TOKEN>>>>>>>>>>", token);
    // console.log(">>>>>>>PHONENUMBER>>>>>>>>", phoneNumber);
    console.log("data", data);
  }

  // const { data } = location.state;
  


  // console.log(">>>>STATE>>>>>>>>>",state);
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState("UuTien");
  const [Component, setComponent] = useState(() => Message); // Use uppercase Component


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    // Set default component when the component mounts
    setComponent(() => Message);
  }, []);

  const handleItemClick = (item) => {
    setItem(item);
    if (item === "UuTien") {
      setComponent(() => Message);
    } else if (item === "Khac") {
      setComponent(() => OtherMessage);
    }
  };



  return (
    <div className="flex h-screen w-full grid-flow-col ">
      <div className="ml-16 w-full max-w-fit flex-1 border-r md:w-[345px]">
        <div className="flex-1 text-gray-500 ">
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

                <AddFriendDialog/>

                <CreateGroup/>

                {/* <div className="relative inline-block p-1">
                  <img
                    src="/src/assets/group-user-plus.png"
                    alt=""
                    className="w-8 cursor-pointer items-center justify-center"
                  />
                  <div className="absolute inset-0 rounded-md bg-black bg-opacity-0 transition-opacity duration-300 hover:bg-opacity-10"></div>
                </div> */}
              </div>
              <div className="mt-[-10px] flex flex-row gap-x-2 pb-2">
                <NavLink
                  to=""
                  onClick={() => handleItemClick("UuTien")}
                  className={`font-sans text-sm font-semibold  ${
                    item === "UuTien"
                      ? "mb-[-9px] border-b-2 border-[#005AE0] text-[#005AE0] transition duration-300 ease-in-out"
                      : "text-[#7589A3]"
                  }`}
                >
                  Ưu tiên
                </NavLink>
                <NavLink
                  // to="other-message"
                  onClick={() => handleItemClick("Khac")}
                  className={`font-sans text-sm font-semibold  ${
                    item === "Khac"
                      ? "mb-[-9px] border-b-2 border-[#005AE0] text-[#005AE0] transition duration-300 ease-in-out"
                      : "text-[#7589A3]"
                  }`}
                >
                  Khác
                </NavLink>
              </div>
            </div>
            <div className="flex-1 pl-4 ">
              <Suspense fallback={<div>Loading...</div>}>
                <Component /> {/* Use uppercase Component here */}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden w-full overflow-hidden md:flex ">
        <div className="h-fit w-max flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MessageFilterBar;
