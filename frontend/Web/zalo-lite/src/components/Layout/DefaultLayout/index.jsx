import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DefaultLayout({ children }) {
  const [selectedItem, setSelectedItem] = useState("UuTien");

  const handleItemSelected = (value) => {
    setSelectedItem(value);
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex h-screen w-full">
        <Navbar />
        <div className="ml-16 flex w-full flex-col border md:w-[345px]">
          <Sidebar onItemSelected={handleItemSelected} />
          <div className="flex-1 overflow-y-auto text-gray-500">
            {selectedItem === "UuTien" ? (
              <div className="flex-1 overflow-y-auto text-gray-500">
                {children}
              </div>
            ) : (
              <div className="text-gray-500">This is content for Khac</div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden w-full md:flex">
        <div className="text-gray-500">This is content</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
