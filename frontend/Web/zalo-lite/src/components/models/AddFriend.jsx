import * as React from "react";
import { Fragment, useState, useEffect} from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import {
  createTheme,
  ThemeProvider,
  alpha,
  getContrastRatio,
} from "@mui/material/styles";
import axios from "axios";
import Cookies from "js-cookie";
import Switch from "@mui/material/Switch";

import AvatarNameItem from "../AvatarNameItem";

import countries from "../../data/countries";
import { Axios } from "axios";

const theme = createTheme({
  palette: {
    silver: {
      main: "#eaedf0",
      light: "#F5EBFF",
      dark: "#eaedf0",
      contrastText: "#081c36",
    },
  },
});

const recentSearchesData = [
  {
    id: 1,
    name: "John Doe",
    avatar:
      "https://eliteprschool.edu.vn/wp-content/uploads/2017/08/xay-dung-hinh-anh-doanh-nha-1.jpg",
    phoneNumber: "(+84) 0987665148", // Số điện thoại bắt đầu bằng (+84)
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar:
      "https://cdn-i.vtcnews.vn/resize/th/upload/2023/10/13/anh-bao-chi--2-11095058.jpg",
    phoneNumber: "(+84) 0987654321", // Số điện thoại bắt đầu bằng (+84)
  },
  // {
  //   id: 3,
  //   name: "Bob Johnson",
  //   avatar: "https://i-ngoisao.vnecdn.net/2019/02/03/2-8472-1549155527.jpg",
  //   phoneNumber: "(+84) 0876543210", // Số điện thoại bắt đầu bằng (+84)
  // },
];

const suggestedFriendsData = [
  {
    id: 4,
    name: "Alice Brown",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_DjKMi_7kzPt42YrBCbvzm49EF6XXiXcBcpMmbb5LDQ&s",
  },
  {
    id: 5,
    name: "Charlie Green",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGs2PdOdWFS33PmZco92XsZspbwRYRwrJRGup4QRq7cg&s",
  },
  {
    id: 6,
    name: "David White",
    avatar:
      "https://gcs.tripi.vn/public-tripi/tripi-feed/img/474014Zdb/anh-gai-xinh-cute-de-thuong-hot-girl-3.jpg",
  },
  // {
  //   id: 7,
  //   name: "Eva Black",
  //   avatar:
  //     "https://img.pikbest.com/png-images/qiantu/anime-character-avatar-cute-beautiful-girl-second-element-free-button_2652661.png!w700wp",
  // },
];

// Function to open AddFriendDialog3
function handleOpenDialog3(setOpenDialog) {
  setOpenDialog("dialog3");
}

const AddFriendDialog2 = ({ data, setOpenDialog }) => {
  const dateTime = new Date(data.birthday);
  return (
    <div className="h-[551.5px] w-[400px]">
      <div className="flex h-full">
        <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl ">
          {/* Content of the popup */}
          <div
            className="relative mb-[125px] h-[171px] bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: `url(${data.background})` }}
          >
            <div className="absolute left-4 top-48 -translate-y-1/2 transform">
              <img
                className="h-20 w-20 rounded-full border-4 border-white"
                src={data.avatar}
                alt="Avatar"
              />
            </div>
            <div className="absolute left-4 top-52 -translate-y-1/2 transform pl-28 text-tblack">
              <h2 className=" text-lg font-semibold">{data.userName}</h2>

              {/* <p className=" text-sm">Lorem ipsum dolor sit amet</p> */}
            </div>
            <div className="flex flex-1 items-center justify-center pt-[227px]">
              <button
                className="mr-4 h-8 w-[178px] rounded border bg-[#EAEDF0] text-base font-medium text-tblack"
                onClick={() => {
                  handleOpenDialog3(setOpenDialog);
                }}
              >
                Kết bạn
              </button>
              <button className="h-8 w-[178px] rounded border bg-[#E5EFFF] text-base font-medium text-[#005ae0]">
                Nhắn tin
              </button>
            </div>
          </div>

          <hr className="h-1.5 bg-slate-200" />

          <div className="m-3">
            <p className="text-base font-semibold">Thông tin cá nhân</p>

            <div className="">
              {/* <div className="flex p-3">
                <p className="flex-grow text-gray-700">Bio</p>
                <p className="w-72 text-left text-gray-700">{data.userName}</p>
              </div> */}
              <div className="flex pt-3">
                <p className="w-[100px] flex-grow text-sm text-gray-700">
                  Giới tính
                </p>
                <p className="w-72 text-left text-sm text-tblack">
                  {data.gender ? "Nam" : "Nữ"}
                </p>
              </div>
              <div className="flex pb-1 pt-3">
                <p className="w-[100px] flex-grow text-sm text-gray-700">
                  Ngày sinh
                </p>
                <p className="w-72 text-left text-sm text-tblack">
                  {" "}
                  {dateTime.getDate()} tháng {dateTime.getMonth() + 1},{" "}
                  {dateTime.getFullYear()}
                </p>
              </div>
            </div>
          </div>
          <hr className="h-1.5 bg-slate-200" />
          <div className="m-3  h-full items-center justify-center">
            <div className="flex items-center py-2 opacity-50">
              <img src="/id-card.png" alt="" className="w-[20px]" />
              <span className="ml-[10px] text-sm">Chia sẻ danh thiếp</span>
            </div>
            <div className="flex items-center py-2">
              <img src="/blocked.png" alt="" className="w-[18px]" />
              <span className="ml-3 text-sm ">Chặn tin nhắn và cuột gọi</span>
            </div>
            <div className="flex items-center py-2">
              <img src="/alert.png" alt="" className="w-[18px]" />
              <span className=" ml-3 text-sm ">Báo xấu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddFriendDialog3 = ({ data }) => {
  const dateTime = new Date(data.birthday);
  const defaultText = `Xin chào, mình là ${data.userName}. Mình tìm thấy bạn bằng số điện thoại. Kết bạn với mình nhé!`;
  const maxLength = 150;

  const [text, setText] = useState(defaultText);

  const handleChange = (event) => {
    const newText = event.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
    }
  };
  return (
    <div className="h-[485.5px] w-[400px]">
      <div className="flex h-full">
        <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl ">
          {/* Content of the popup */}
          <div
            className="relative mb-[80px] h-[171px] bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: `url(${data.background})` }}
          >
            <div className="absolute left-4 top-48 -translate-y-1/2 transform">
              <img
                className="h-20 w-20 rounded-full border-4 border-white"
                src={data.avatar}
                alt="Avatar"
              />
            </div>
            <div className="absolute left-4 top-52 -translate-y-1/2 transform pl-28 text-tblack">
              <h2 className=" text-lg font-semibold">{data.userName}</h2>

              {/* <p className=" text-sm">Lorem ipsum dolor sit amet</p> */}
            </div>
          </div>
          <div className="m-3">
            <textarea
              value={text}
              onChange={handleChange}
              rows={6} // Số dòng hiển thị
              cols={47} // Số cột hiển thị
              maxLength={maxLength} // Giới hạn số ký tự
              style={{
                fontSize: "14px", // Cỡ chữ
                border: "1px solid #ccc", // Border
                padding: "8px", // Padding
                borderRadius: "4px", // Bo góc
              }}
            />
            <div className="absolute ml-[-35px] mt-[-30px] w-full text-right text-xs text-[#7589A3]">
              {text.length}/{maxLength} ký tự
            </div>
          </div>
          <div className="m-3 pl-3 flex h-11 items-center justify-between bg-[#F3F5F6] text-tblack rounded">
            <p className="text-sm">Chặn người này xem nhật ký của tôi</p>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Main */
export default function AddFriendDialog() {
  const [userID, setUserID] = useState("");
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [friendsList, setFriendsList] = useState([]);

  const [userFound, setUserFound] = useState({});
  const [openDialog, setOpenDialog] = useState("");

  const [selectedCountry, setSelectedCountry] = useState({
    name: "Vietnam",
    flag: "🇻🇳",
    code: "VN",
    dial_code: "+84",
  });

  // Hàm để lấy userID từ cookies và giải mã nó
  const getUserIDFromCookie = () => {
    // Lấy userID từ cookies
    const userIDFromCookie = Cookies.get("userID");

    // Nếu có userID từ cookies, giải mã và trả về
    if (userIDFromCookie) {
      return userIDFromCookie;
    }

    // Nếu không có userID từ cookies, trả về null
    return null;
  };



  useEffect(() => {
    if (userID) {
      const newSocket = new WebSocket(`ws://localhost:8082/ws/user/${userID}`);
      newSocket.onopen = () => {
        console.warn(
          "WebSocket 'ws://localhost:8082/ws/user/' for UserID: ",
          userID,
          " OPENED",
        );
      };
      newSocket.onmessage = (event) => {
        console.log("Message received:", event.data);
        // Xử lý dữ liệu được gửi đến ở đây
      };
      setSocket(newSocket);

      return () => {
        newSocket.close(); // Đóng kết nối khi component unmount hoặc userID thay đổi
      };
    }
  }, [userID]);

  const [recentSearches, setRecentSearches] = useState(recentSearchesData);
  const [suggestedFriends, setSuggestedFriends] =
    useState(suggestedFriendsData);

  const [selectedCountryValue, setSelectedCountryValue] =
    useState(selectedCountry);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setUserFound({});
    setOpenDialog("");
    setOpen(false);
  };

  const handleAddFriend = () => {
    console.log(
      `Add friend with prefix: ${prefix}, phone number: ${phoneNumber}`,
    );
    setFriendsList((prevList) => [...prevList, { prefix, phoneNumber }]);
    handleClose();
  };

  const handleAddSuggestedFriend = (friend) => {
    console.log(`Add suggested friend: ${friend.name}`);
    // Thực hiện xử lý thêm bạn bè từ danh sách người có thể quen biết ở đây
  };

  const handleSelectCountry = (e) => {
    const selectedCountryCode = e.target.value;
    const selectedCountry = countries.find(
      (country) => country.code === selectedCountryCode,
    );
    setSelectedCountry(selectedCountry);
    console.log(selectedCountry);
  };

  const handleFindUserByPhoneNumber = () => {
    // Lấy token từ cookies
    const token = Cookies.get("token");

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      console.error("Token not found in cookies.");
      return; // Không thể gửi yêu cầu nếu không có token
    }

    axios
      .get(`http://localhost:8081/api/v1/account/profile/${phoneNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUserFound(response.data);
        // Kiểm tra nếu tìm thấy người dùng
        if (response.data) {
          setOpenDialog("dialog2"); // Mở dialog khác
        } else {
          // Hiển thị thông báo hoặc xử lý khác khi không tìm thấy người dùng
        }
      })
      .catch((error) => {
        console.error("Error searching user by phone number:", error);
      });
  };

  const sendMessage = () => {
    const message = {
      id: "7d011a36-3bfb-4cb7-aa26-205e3d4a8288",
      tum: "TUM01",
      senderID: "f1cee7b8-7712-4042-9e94-17bd21209a62",
      senderName: "Lê Hữu Bằng",
      senderAvatar:
        "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711638195/yaelqfegjxfkbjdmwyef.png",
      receiverID: "26ce60d1-64b9-45d2-8053-7746760a8354",
      receiverName: "Tran Huy",
      receiverAvatar:
        "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711636843/exftni5o9msptdxgukhk.png",
      description: "Tôi muốn được kết bạn với pro!",
    };

    if (socket) {
      socket.send(JSON.stringify(message));
      console.log("Message sent:", message);
    } else {
      console.error("Socket is not initialized!");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="relative ml-1 inline-block py-1">
        <Fragment>
          <div className="w-8 px-1 hover:bg-gray-200">
            <img
              src="/src/assets/user-plus.png"
              alt=""
              // className="w-[22px] cursor-pointer items-center justify-center"
              className="cursor-pointer items-center justify-center"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <Dialog open={open} onClose={handleClose}>
            <div className="flex items-center justify-between border p-2">
              {openDialog === "dialog2" ? (
                <span className="pl-2 text-base font-medium text-tblack">
                  Thông tin tài khoản
                </span>
              ) : openDialog === "dialog3" ? (
                <span className="pl-2 text-base font-medium text-tblack">
                  Thông tin tài khoản
                </span>
              ) : (
                <span className="pl-2 text-base font-medium text-tblack">
                  Thêm bạn
                </span>
              )}
              <Button onClick={handleClose} style={{ color: "#000000" }}>
                <CloseIcon />
              </Button>
            </div>
            <DialogContent className="p-[17px]">
              {openDialog === "dialog2" ? (
                <AddFriendDialog2
                  data={userFound}
                  // handleShowDialog3={handleOpenDialog3}
                  setOpenDialog={setOpenDialog}
                ></AddFriendDialog2>
              ) : openDialog === "dialog3" ? (
                <AddFriendDialog3 data={userFound}></AddFriendDialog3>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="mt-1 w-1/3">
                    <Select
                      size="small"
                      value={selectedCountry.code}
                      onChange={handleSelectCountry}
                      renderValue={(selected) => {
                        return (
                          <div className="flex items-center py-[1.5px]">
                            <span className="text-3xl text-tblack">
                              {selectedCountry.flag}
                            </span>
                            <span className=" pl-1 text-sm text-tblack">
                              ({selectedCountry.dial_code})
                            </span>
                          </div>
                        );
                      }}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          <div className="flex  w-full">
                            <div className="flex-none">
                              <span>{country.flag}</span>
                            </div>
                            <div className="flex-1">
                              <span>{country.name}</span>
                            </div>
                            <div className="flex justify-end">
                              <span>{country.dial_code}</span>
                            </div>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div className="w-2/3">
                    <TextField
                      required
                      margin="dense"
                      id="phoneNumber"
                      label="Số điện thoại"
                      type="number"
                      fullWidth
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div
                className={
                  openDialog === "dialog2" || openDialog === "dialog3"
                    ? "mt-3 hidden"
                    : "mt-3"
                }
              >
                <span className="text-[13px] text-[#7589A3]">
                  Kết quả gần nhất
                </span>
                <ul>
                  {recentSearches.map((data, index) => (
                    <AvatarNameItem key={index} data={data} type={"AF"} />
                  ))}
                </ul>
              </div>
              <div
                className={
                  openDialog === "dialog2" || openDialog === "dialog3"
                    ? "mt-3 hidden"
                    : "mt-3"
                }
              >
                <div className="flex">
                  <span>
                    <img src="/user2.png" alt="" />
                  </span>
                  <span className="ml-2 text-[13px] text-[#7589A3]">
                    Có thể bạn quen
                  </span>
                </div>
                <ul>
                  {suggestedFriends.map((friend, index) => (
                    <AvatarNameItem key={index} data={friend} type={"MS"} />
                  ))}
                </ul>
              </div>
            </DialogContent>
            {openDialog === "dialog2" ? (
              <></>
            ) : openDialog === "dialog3" ? (
              <DialogActions className="border p-4">
                <div className="py-1">
                  <Button
                    onClick={handleClose}
                    variant="contained"
                    color="silver"
                    style={{
                      textTransform: "none",
                      color: "#081c36",
                      fontSize: 16,
                      fontWeight: 500,
                      marginRight: 10,
                    }}
                  >
                    Thông tin
                  </Button>
                  <Button
                    onClick={() => {
                      // handleAddFriend();
                      // handleFindUserByPhoneNumber();
                      // setOpenDialog("dialog2");
                      sendMessage();
                    }}
                    variant="contained"
                    color="primary"
                    style={{
                      textTransform: "none",
                      color: "white",
                      fontSize: 16,
                      fontWeight: 500,
                      marginRight: 10,
                    }}
                  >
                    Kết bạn
                  </Button>
                </div>
              </DialogActions>
            ) : (
              <DialogActions className="border p-4">
                <div className="py-1">
                  <Button
                    onClick={handleClose}
                    variant="contained"
                    color="silver"
                    style={{
                      textTransform: "none",
                      color: "#081c36",
                      fontSize: 16,
                      fontWeight: 500,
                      marginRight: 10,
                    }}
                  >
                    Huỷ
                  </Button>
                  <Button
                    onClick={() => {
                      // handleAddFriend();
                      handleFindUserByPhoneNumber();
                      setOpenDialog("dialog2");
                    }}
                    variant="contained"
                    color="primary"
                    style={{
                      textTransform: "none",
                      color: "white",
                      fontSize: 16,
                      fontWeight: 500,
                      marginRight: 10,
                    }}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </DialogActions>
            )}
          </Dialog>
        </Fragment>
        <div
          className="absolute inset-0 cursor-pointer rounded-md bg-black bg-opacity-0 transition-opacity duration-300 hover:bg-opacity-10"
          onClick={()=>{handleClickOpen();
            setUserID(getUserIDFromCookie());
          }}
        ></div>
      </div>
    </ThemeProvider>
  );
}
