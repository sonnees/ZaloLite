import {
  faAddressBook,
  faEnvelopeOpen,
} from "@fortawesome/free-regular-svg-icons";
import { faMobileScreen, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Contact() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/contact/listFriend")
  }, [])

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    if (index ==0 ) {
      navigate("/contact/listFriend")
    } else if (index == 1 ) {
      navigate("/contact/listGroup")
    } else if (index == 2 ) {
      navigate("/contact/listFriendRequest")
    }
  };

  return (
    <div className="h-full w-full flex-col pr-4">
      <List className="my-0 p-0 ">
        <Link to="listFriend">
          <ListItemButton
            className="h-[56px] w-[310px]"
            id="listFriend"
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faAddressBook} className="" />
            </ListItemIcon>
            <ListItemText
              className="-ml-5 text-base font-bold"
              primary="Danh sách bạn bè"
            />
          </ListItemButton>
        </Link>

        <ListItemButton
          className="h-[56px] w-[310px]"
          id="listGroup"
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faUserGroup} className="" />
          </ListItemIcon>
          <ListItemText
            className="-ml-5 font-bold"
            primary="Danh sách nhóm và cộng đồng"
          />
        </ListItemButton>

        <Link to="listfriendrequest">
          <ListItemButton
            className="h-[56px] w-full"
            id="addFriend"
            selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 2)}
          >
            <ListItemIcon>
              {/* <FontAwesomeIcon icon={faEnvelopeOpen} className="" /> */}
              <img src="/friend-request.png" alt="" className="w-[24px] " />
            </ListItemIcon>
            {/* <ListItemText
              className="-ml-5 border text-tblack"
              primary="Lời mời kết bạn"
              sx={{ fontWeight: "bold" }}
            /> */}
            <div className="-ml-5  text-tblack">
              <span className=" text-base font-semibold text-tblack">
                Lời mời kết bạn
              </span>
            </div>
          </ListItemButton>
        </Link>
      </List>
    </div>
  );
}

export default Contact;
