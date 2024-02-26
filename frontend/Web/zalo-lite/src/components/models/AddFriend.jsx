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
  { id: 1, name: "John Doe", avatar: "/avatars/john.jpg" },
  { id: 2, name: "Jane Smith", avatar: "/avatars/jane.jpg" },
  { id: 3, name: "Bob Johnson", avatar: "/avatars/bob.jpg" },
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
  const [suggestedFriends, setSuggestedFriends] = useState(suggestedFriendsData);

  const [selectedCountryValue, setSelectedCountryValue] = useState(selectedCountry);

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
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Friend
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <div className="flex items-center justify-between border p-2">
          <DialogTitle sx={{ padding: 0 }}>
            <span className="text-tblack pl-2 text-base font-bold">
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
                      <span className="text-tblack text-3xl">
                        {selectedCountry.flag}
                      </span>
                      <span className=" text-tblack pl-1 text-sm">
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
            <DialogContentText>Recent Searches:</DialogContentText>
            <AvatarNameItem />
            <ul>
              {recentSearches.map((search, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Avatar src={search.avatar} alt={search.name} />
                  <span>{search.name}</span>
                </li>
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
          <Button onClick={handleAddFriend} variant="contained" color="primary">
            Add Friend
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
