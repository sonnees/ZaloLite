import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import TabList from "@mui/lab/TabList";

import AddFriendDialog from "../../components/models/AddFriend";

function MessageFilterBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState("UuTien");

  //   const handleItemSelected = (value) => {
  //     onItemSelected(value);
  //   };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
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
          <img
            src="/src/assets/user-plus.png"
            alt=""
            className="cursor-pointer items-center justify-center"
          />
          <img
            src="/src/assets/group-user-plus.png"
            alt=""
            className="cursor-pointer items-center justify-center"
          />
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
            <AddFriendDialog />
        </div>
      </div>
      <div className="flex-1 pl-4 ">
        <Outlet />
      </div>
    </div>
  );
}

export default MessageFilterBar;
