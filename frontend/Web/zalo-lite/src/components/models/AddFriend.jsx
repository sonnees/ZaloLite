import * as React from "react";
import { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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

const tblack = "#081C36";

const recentSearchesData = [
  {
    id: 1,
    name: "Quỳnh Hương",
    avatar: "https://zpsocial-f54-org.zadn.vn/2a82699d417ca022f96d.jpg",
    phone: "(+84) 0357 391 277",
  },
  {
    id: 2,
    name: "Huỳnh Anh Khôi",
    avatar: "https://zpsocial-f53-org.zadn.vn/d168380f0628e776be39.jpg",
    phone: "(+84) 0232 971 887",
  },
  {
    id: 3,
    name: "Nguyễn Trường Tuấn Kiệt",
    avatar: "https://zpsocial-f54-org.zadn.vn/862e2ff4f96918374178.jpg",
    phone: "(+84) 0778 231 988",
  },
];
const suggestedFriendsData = [
  {
    id: 4,
    name: "Anh",
    avatar: "https://zpsocial-f40-org.zadn.vn/1b25bbcb39a8d5f68cb9.jpg",
    suggest: "Từ số điện thoại",
  },
  {
    id: 5,
    name: "Định Thảo Nguyên",
    avatar: "https://zpsocial-f55-org.zadn.vn/e84753de0c44ed1ab455.jpg",
    suggest: "Từ gợi ý kết bạn",
  },
  {
    id: 6,
    name: "Nguyễn Thị Thanh Huyền",
    avatar: "https://zpsocial-f55-org.zadn.vn/ab493bf39c687d362479.jpg",
    suggest: "Từ gợi ý kết bạn",
  },
];

const btnMakeFriend = (
  <Button
    size="small"
    onClick={() => handleAddSuggestedFriend(friend)}
    variant="outlined"
    sx={{
      fontSize: "14px",
      textTransform: "none",
      paddingX: 2,
      height: 24,
      borderColor: "#0068FF",
      color: "#0068FF",
      fontWeight: "semibold",
    }}
  >
    Kết bạn
  </Button>
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
      marginLeft: 88,
    },
  },
};

export default function AddFriendDialog() {
  const [anchorEl, setAnchorEl] = useState(null);

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

  const [searchTerm, setSearchTerm] = useState("");
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
    setAnchorEl(e.currentTarget);
  };

  return (
    <Fragment>
      <div
        onClick={handleClickOpen}
        className="w-10 ml-3 mr-1 hover:bg-gray-200"
      >
        <img
          src="/src/assets/user-plus.png"
          alt=""
          className="cursor-pointer items-center justify-center"
          style={{ width: "100%", height: "100%"}}
        />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <div className="flex items-center justify-between border p-2">
          <DialogTitle sx={{ padding: 0 }}>
            <span className="pl-2 text-base font-bold text-tblack">
              Thêm bạn
            </span>
          </DialogTitle>
          <Button onClick={handleClose} style={{ color: "#000000" }}>
            <CloseIcon />
          </Button>
        </div>
        <DialogContent className="p-4">
          <div className="flex items-center">
            <div className="w-1/3">
              <Select
                size="small"
                value={selectedCountry.code}
                onChange={handleSelectCountry}
                renderValue={(selected) => {
                  return (
                    <div className="flex items-center">
                      <span className="-mb-1 text-3xl text-tblack">
                        {selectedCountry.flag}
                      </span>
                      <span className="w-[50px] pl-1 text-sm text-tblack">
                        ({selectedCountry.dial_code})
                      </span>
                    </div>
                  );
                }}
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
              >
                <div className="w-full px-3 py-2">
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search countries..."
                    // inputProps={{
                    //   style: {borderRadius: "20px", backgroundColor: "#EAEDF0", border:"none"},
                    // }}
                  />
                </div>
                {countries
                  .filter((country) =>
                    country.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                  )
                  .map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      <div className="flex w-[300px]">
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
            <div className="ml-4 w-2/3">
              <TextField
                size="small"
                required
                id="phoneNumber"
                type="tel"
                fullWidth
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => {
                  // Chỉ cho phép nhập số
                  const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
                  setPhoneNumber(sanitizedValue);
                }}
                inputProps={{
                  style: {
                    fontSize: 16,
                    padding: "13px 15px",
                    color: "#081C36",
                  },
                  pattern: "[0-9]*", // Chỉ cho phép nhập số
                }}
              />
            </div>
          </div>
          <div className="mt-7">
            <div className="text-semibol flex gap-x-2 text-[13px] text-[#7589a3]">
              <span>Kết quả gần nhất:</span>
            </div>
            <ul>
              {recentSearches.map((search, index) => (
                <li key={index} className="flex items-center">
                  <AvatarNameItem key={index} id={index} {...search} />
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3">
            <div className="text-semibol flex gap-x-2 text-[13px] text-[#7589a3]">
              <span>
                <img
                  src="/src/assets/make-friend.png"
                  alt=""
                  className="h-4 w-4"
                />
              </span>
              <span>Có thể bạn quen</span>
            </div>
            <ul>
              {suggestedFriends.map((friend, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <AvatarNameItem
                    key={index}
                    id={index}
                    {...friend}
                    btnMakeFriend={btnMakeFriend}
                  />
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
        <DialogActions className="border">
          <div className="space-x-2 p-3 py-2">
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                backgroundColor: "#EAEDF0",
                color: tblack,
                fontSize: "16px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#dce0e4",
                  color: tblack,
                },
              }}
            >
              Huỷ
            </Button>
            <Button
              onClick={handleAddFriend}
              variant="contained"
              color="primary"
              sx={{
                fontSize: "16px",
                textTransform: "none",
                backgroundColor: "#0068FF",
                "&:hover": { backgroundColor: "#0058e0" },
              }}
            >
              Tìm kiếm
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
