import React from "react";
import { Link } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import Carousel from "../../components/Carousel";

const Welcome = () => {
  const dataSlider = [
    {
      id: 1,
      img: "/public/slider1.png",
      caption: "Nhắn tin nhiều hơn, soạn thảo ít hơn",
      detail:
        "Sử dụng <strong>Tin Nhắn Nhanh</strong> để lưu sẵn các tin nhắn thường dùng và gửi nhanh trong hội thoại bất kỳ.",
    },
    {
      id: 2,
      img: "/public/slider2.png",
      caption: "Tin nhắn tự xóa",
      detail:
        "Từ giờ tin nhắn đã có thể tự động tự xóa sau khoảng thời gian nhất định.",
    },
    {
      id: 3,
      img: "/public/slider3.svg",
      caption: "Mã hóa đầu cuối",
      detail: "Nội dung tin nhăn được mã hóa trong suốt quá trình gửi và nhận",
      other: "Tìm hiểu thêm",
    },
    {
      id: 4,
      img: "/public/slider4.jpg",
      caption: "Gọi nhóm và làm việc hiệu quả với Zalo Group Call",
      detail: "Trao đổi công việc mọi lúc mọi nơi",
    },
    {
      id: 5,
      img: "/public/slider5.jpg",
      caption: "Trải nghiệm xuyên suốt",
      detail:
        "Kết nối và giải quyết công việc trên mọi thiết bị với dữ liệu luôn được đồng bộ",
    },
    {
      id: 6,
      img: "/public/slider6.jpg",
      caption: "Gửi File nặng?",
      detail: 'Đã có Zalo PC "xử" hết',
    },
    {
      id: 7,
      img: "/public/slider7.jpg",
      caption: "Chat nhóm với đồng nghiệp",
      detail: "Tiện lợi hơn, nhờ các công cụ hỗ trợ chat trên máy tính",
    },
  ];

  let slides = [
    "/public/slider1.png",
    "/public/slider2.png",
    "/public/slider3.svg",
    "/public/slider4.jpg",
    "/public/slider5.jpg",
    "/public/slider6.jpg",
    "/public/slider7.jpg",
    // "https://wallpaperaccess.com/full/809523.jpg",
    // "https://getwallpapers.com/wallpaper/full/5/c/0/606489.jpg",
  ];
  return (
    // <Stack
    //   spacing={2}
    //   sx={{ height: "100%", width: "100%" }}
    //   alignItems="center"
    //   justifyContent={"center"}
    // >
    //   {/* <NoChat /> */}
    //   <Typography variant="subtitle2">
    //     Select a conversation or start a{" "}
    //     <Link
    //       style={{
    //         // color: theme.palette.primary.main,
    //         textDecoration: "none",
    //       }}
    //       to="/"
    //     >
    //       new one
    //     </Link>
    //   </Typography>
    // </Stack>
    <div className="flex h-screen flex-col items-center justify-center "> 
    {/* border border-red-500 */}
      <div id="header" className="mb-4 text-2xl font-light text-tblack">
        <span className="">Chào mừng đến với </span>
        <span className="font-medium">Zalo Lite!</span>
      </div>
      <div className="text-center text-sm leading-normal text-tblack mb-[50px]">
        <span className="">
          Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng <br />
          người thân, bạn bè được tối ưu hoá cho máy tính của bạn.
        </span>
      </div>
      <div className="">
        <div className="m-auto w-full">
          <Carousel slides={dataSlider} />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
