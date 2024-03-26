import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import React from "react";
import MessageDetail from "./MessageDetail";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons";
import { grey } from "@mui/material/colors";
import { Avatar } from "@mui/material";

export default function DetailContact() {
  const data = [
    {
      title: "Section 1",
      data: [
        {
          name: "Item1",
          avt: "https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg",
        },
        {
          name: "Item2",
          avt: "https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg",
        },
        {
          name: "Item3",
          avt: "https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg",
        },
      ],
    },
    {
      title: "Section 2",
      data: [
        {
          name: "Item1",
          avt: "https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg",
        },
        {
          name: "Item2",
          avt: "https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg",
        },
        {
          name: "Item3",
          avt: "https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg",
        },
      ],
    },
    // Thêm các phần tử section và data khác nếu cần
  ];

  const RenderItem = ({ data }) =>
    data.map((item, index) => (
      <div key={index} className="py-4">
        <div>{item.title}</div>
        <div>
          {data[index].data.map((item, subIndex) => (
            <div key={subIndex} className="flex flex-row items-center p-4">
              <Avatar alt={item.avt} src={item.avt} className="m-4" />
              <div className="w-full border-b p-4 py-5">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    ));

  return (
    <div className="h-screen w-full">
      <div className="h-[69px] w-full">
        <div className="flex h-full w-full flex-row items-center justify-between border-b">
          <div className="flex flex-row items-center gap-x-2 px-4">
            <FontAwesomeIcon icon={faAddressBook} className="pl-1 pr-3" />
            <div className="flex flex-col">
              <div className="text-lg font-medium text-[#081c36]">
                <span>Danh sách bạn bè</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[700px] w-full overflow-auto bg-neutral-100 p-4 pr-2">
          <div className="pb-4 font-medium">Bạn bè</div>

          <div className="rounded-l bg-white p-4 ">
            <RenderItem data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
