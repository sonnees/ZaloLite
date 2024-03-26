import * as React from "react";
import { Fragment, useState } from "react";
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

import AvatarNameItem from "../AvatarNameItem";

import countries from "../../data/countries";

const recentSearchesData = [
  {
    id: 1,
    name: "John Doe",
    avatar:
      "https://eliteprschool.edu.vn/wp-content/uploads/2017/08/xay-dung-hinh-anh-doanh-nha-1.jpg",
    phoneNumber: "(+84) 0123456789", // Số điện thoại bắt đầu bằng (+84)
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar:
      "https://cdn-i.vtcnews.vn/resize/th/upload/2023/10/13/anh-bao-chi--2-11095058.jpg",
    phoneNumber: "(+84) 0987654321", // Số điện thoại bắt đầu bằng (+84)
  },
  {
    id: 3,
    name: "Bob Johnson",
    avatar: "https://i-ngoisao.vnecdn.net/2019/02/03/2-8472-1549155527.jpg",
    phoneNumber: "(+84) 0876543210", // Số điện thoại bắt đầu bằng (+84)
  },
];

const suggestedFriendsData = [
  { id: 4, name: "Alice Brown", avatar: "/avatars/alice.jpg" },
  { id: 5, name: "Charlie Green", avatar: "/avatars/charlie.jpg" },
  { id: 6, name: "David White", avatar: "/avatars/david.jpg" },
  { id: 7, name: "Eva Black", avatar: "/avatars/eva.jpg" },
];

export default function AddFriendDialog() {
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "Vietnam",
    flag: "🇻🇳",
    code: "VN",
    dial_code: "+84",
  });
  const [recentSearches, setRecentSearches] = useState(recentSearchesData);
  const [suggestedFriends, setSuggestedFriends] =
    useState(suggestedFriendsData);

  const [selectedCountryValue, setSelectedCountryValue] =
    useState(selectedCountry);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
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

  return (
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
            <DialogTitle sx={{ padding: 0 }}>
              <span className="pl-2 text-base font-medium text-tblack">
                Thêm bạn
              </span>
            </DialogTitle>
            <Button onClick={handleClose} style={{ color: "#000000" }}>
              <CloseIcon />
            </Button>
          </div>
          <DialogContent className="p-4">
            <div className="flex items-center border">
              <div className="w-1/3">
                <Select
                  size="small"
                  value={selectedCountry.code}
                  onChange={handleSelectCountry}
                  renderValue={(selected) => {
                    return (
                      <div className="flex items-center border">
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
                  type="tel"
                  fullWidth
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[13px] text-[#7589A3]">
                Kết quả gần nhất
              </span>
              {/* <AvatarNameItem /> */}
              <ul>
                {recentSearches.map((data, index) => (
                  // <li key={index} className="flex items-center space-x-2">
                  //   <Avatar src={search.avatar} alt={search.name} />
                  //   <span>{search.name}</span>
                  // </li>
                  <AvatarNameItem data={data} type={"AF"} />
                ))}
              </ul>
            </div>
            <div className="mt-3">
              <DialogContentText>Suggested Friends:</DialogContentText>
              <ul>
                {suggestedFriends.map((friend, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Avatar src={friend.avatar} alt={friend.name} />
                    <span>{friend.name}</span>
                    <Button
                      onClick={() => handleAddSuggestedFriend(friend)}
                      variant="outlined"
                    >
                      Add Friend
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
          <DialogActions className="p-4">
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleAddFriend}
              variant="contained"
              color="primary"
            >
              Add Friend
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
      <div
        className="absolute inset-0 rounded-md bg-black bg-opacity-0 transition-opacity duration-300 hover:bg-opacity-10 cursor-pointer"
        onClick={handleClickOpen}
      ></div>
    </div>
  );
}
