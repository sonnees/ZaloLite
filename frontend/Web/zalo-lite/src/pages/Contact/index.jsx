import { faAddressBook, faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
import { faMobileScreen, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="h-[64px] w-[334px] flex-col">
    <List className="p-0 my-0">
      <ListItemButton className="h-[64px] w-[310px]" id="listFriend" selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
        <ListItemIcon>
          <FontAwesomeIcon icon={faAddressBook} className='mx-3'/>
        </ListItemIcon>
        <ListItemText className="font-bold" primary="Danh sách bạn bè"/>
      </ListItemButton>

      <ListItemButton className="h-[64px] w-[310px]" id="listGroup" selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
        <ListItemIcon>
          <FontAwesomeIcon icon={faUserGroup} className='mx-3'/>
        </ListItemIcon>
        <ListItemText className="font-bold" primary="Danh sách nhóm và cộng đồng"/>
      </ListItemButton>

      <ListItemButton className="h-[64px] w-[310px]" id="addFriend" selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
        <ListItemIcon>
          <FontAwesomeIcon icon={faEnvelopeOpen} className='mx-3'/>
        </ListItemIcon>
        <ListItemText className="font-bold" primary="Lời mời kết bạn"/>
      </ListItemButton>

    </List>
      

    </div>
  );
}

export default Contact;
