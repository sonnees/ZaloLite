import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import TabList from "@mui/lab/TabList";

import AddFriendDialog from "../components/models/AddFriend";
import Contact from "../pages/Contact";

function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  //   const [item, setItem] = useState("UuTien");

  //   const handleItemSelected = (value) => {
  //     onItemSelected(value);
  //   };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
            </div>
            <div className="flex-1 pl-4 ">
              {/* <Suspense fallback={<div>Loading...</div>}>
                <Component /> 
              </Suspense> */}
              <Contact />
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

export default SearchBox;
