import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Sidebar({ onItemSelected }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState("UuTien");

  const handleItemSelected = (value) => {
    onItemSelected(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex w-full flex-col border-b px-4">
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
        <span
          onClick={() => {
            {
              handleItemSelected("UuTien");
              setItem("UuTien");
            }
          }}
          className={`font-sans text-sm font-semibold text-[#7589A3] ${
            item == "UuTien"
              ? "mb-[-9px] border-b-2 border-[#005AE0] text-[#005AE1] transition duration-300 ease-in-out"
              : ""
          }`}
        >
          Ưu tiên
        </span>
        <span
          onClick={() => {
            {
              handleItemSelected("Khac");
              setItem("Khac");
            }
          }}
          className={`font-sans text-sm font-semibold text-[#7589A3] ${
            item == "Khac"
              ? "mb-[-9px] border-b-2 border-[#005AE0] text-[#005AE1] transition duration-300 ease-in-out"
              : ""
          }`}
        >
          Khác
        </span>
      </div>
    </div>
  );
}

export default Sidebar;
