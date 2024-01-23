import { faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

function Contact() {
  return (
    <div className="h-[64px] w-[334px] flex-col">

      <ListItemButton className="h-[64px]">
        <ListItemIcon>
          <FontAwesomeIcon icon={faMobileScreen} className='mx-3'/>
        </ListItemIcon>
        <ListItemText primary="Danh sách bạn bè"/>
      </ListItemButton>

      <ListItemButton className="h-[64px]">
        <ListItemIcon>
          <FontAwesomeIcon icon={faMobileScreen} className='mx-3'/>
        </ListItemIcon>
        <ListItemText primary="Danh sách nhóm"/>
      </ListItemButton>

      <ListItemButton className="h-[64px]">
        <ListItemIcon>
          <FontAwesomeIcon icon={faMobileScreen} className='mx-3'/>
        </ListItemIcon>
        <ListItemText primary="Lời mời kết bạn"/>
      </ListItemButton>

      

    </div>
  );
}

export default Contact;
