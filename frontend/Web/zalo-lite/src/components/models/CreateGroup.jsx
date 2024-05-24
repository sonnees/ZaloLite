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
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function CreateGroup({ image }) {
  const navigate = useNavigate();
  const { cons, setCons, loadDefaultAvt, setLoadDefaultAvt } = useUser();
  const [loadAvt, setLoadAvt] = useState(loadDefaultAvt);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [nameGroup, setNameGroup] = useState("");
  const [tfPhoneNumber, setTFPhoneNumber] = useState("");
  const [nameGroupClick, setNameGroupClick] = useState(false);
  const [tfPhoneNumberClick, setTFPhoneNumberClick] = useState(false);
  const [open, setOpen] = useState(false);
  const inputFileRef = useRef(null);
  const [socket, setSocket] = useState(null);
  // const [token, setToken] = useState(null);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (selectedOptions.length >= 2) {
      setCheck(true);
    }
    if (selectedOptions.length < 2) {
      setCheck(false);
    }
  });

  const storedData = JSON.parse(localStorage.getItem("conversations"));
  const conversations = storedData
    ? storedData.filter((conversation) => conversation.type !== "GROUP")
    : null;

  /* Fix lỗi hiển thị avatar khi load lại dữ liệu */

  useEffect(() => {
    const newSocket = new WebSocket(`${process.env.SOCKET_CHAT}/ws/group`);
    newSocket.onopen = () => {
      // console.log("WebSocket connected");
    };
    setSocket(newSocket);
    // return () => {
    //   newSocket.close();
    // };
  }, [open]);

  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (event) => {
        if (isJSON(event.data)) {
          let data = JSON.parse(event.data);
          // console.log(data);
          try {
            const jsonData = JSON.parse(data);
            console.log("Received JSON data:", jsonData);
          } catch (error) {
            console.error("Error parsing JSON data:", error);
          }
        }

        // Ensure that the socket is closed when the component unmounts
        return () => {
          socket.onmessage = null;
        };
      };
    }
    setLoadAvt(loadDefaultAvt);
  }, [socket, loadDefaultAvt]);

  const handleClickOpen = () => {
    setOpen(true);
    // console.log("000000000000000000000000000000000000000000000");
    // setLoadAvt("user-loading.jpg")
    setCons(JSON.parse(localStorage.getItem("conversations")));
  };

  const handleClose = async () => {
    setOpen(false);
    socket.close();
    try {
      const response = await fetch(
        `${process.env.HOST}/api/v1/user/info/${localStorage.getItem(
          "userID",
        )}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          method: "GET",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      const data = await response.json();
      console.log(data);
      localStorage.setItem("conversations", JSON.stringify(data.conversations));
      setCons(JSON.parse(localStorage.getItem("conversations")));
      console.log(cons);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleCreateGroup = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const data = getSelectedItems();
    console.log(data);
    const desiredFieldsArray = data.map((item) => ({
      userID: item.id_UserOrGroup,
      userName: item.chatName,
      userAvatar: item.chatAvatar,
    }));

    if (socket && user) {
      const create = {
        id: uuidv4(),
        tgm: "TGM01",
        chatName: nameGroup,
        owner: {
          userID: user.userID,
          userName: user.userName,
          userAvatar: user.avatar,
        },
        members: desiredFieldsArray,
        avatar: loadAvt,
      };

      socket.send(JSON.stringify(create));
      console.log(create);
      handleClose();
    } else {
      console.error("WebSocket is not initialized.");
    }
  };

  const handleFocusNameGroup = () => {
    setNameGroupClick(true);
  };

  const handleBlurNameGroup = () => {
    setNameGroupClick(false);
  };

  const handleFocusPhoneClick = () => {
    setTFPhoneNumberClick(true);
  };

  const handleBlurPhoneClick = () => {
    setTFPhoneNumberClick(false);
  };

  const handleOptionToggle = (optionId) => {
    const isSelected = selectedOptions.includes(optionId);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const getSelectedItems = () => {
    return conversations.filter((conversations) =>
      selectedOptions.includes(conversations.chatID),
    );
  };

  const handleAvatarClick = () => {
    inputFileRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bsqsytxl");
    try {
      let newAvatar = "";
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/du73a0oen/image/upload",
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: formData,
        },
      )
        .then((response) => response.json())
        .then((data) => (newAvatar = data.secure_url));

      console.log(newAvatar);
      setLoadAvt(newAvatar);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };
  return (
    <div className="relative ml-1 inline-block py-1">
      <Fragment>
        <div className={`w-8 px-1 ${image ? "" : "hover:bg-gray-200"} `}>
          <img
            src={image ? image : "/src/assets/group-user-plus.png"}
            alt=""
            className="cursor-pointer items-center justify-center"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <Dialog fullWidth open={open} onClose={handleClose}>
          <div className="flex items-center justify-between border-b p-2">
            <DialogTitle sx={{ padding: 0 }}>
              <span className="pl-4 text-base font-medium text-tblack">
                Tạo nhóm
              </span>
            </DialogTitle>
            <Button onClick={handleClose} style={{ color: "#000000" }}>
              <CloseIcon />
            </Button>
          </div>
          <DialogContent>
            <div className="flex-col items-center border-b">
              <div className="flex items-center">
                <input
                  ref={inputFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <img
                  onClick={handleAvatarClick}
                  className="h-12 w-12 rounded-full border"
                  src={loadAvt}
                  alt="Avatar"
                />
                <input
                  onFocus={handleFocusNameGroup}
                  onBlur={handleBlurNameGroup}
                  onChange={(event) => {
                    setNameGroup(event.target.value);
                  }}
                  className={`mx-3 w-full focus:outline-none ${
                    nameGroupClick ? "border-b border-b-blue-600" : "border-b"
                  } p-2`}
                  type="text"
                  placeholder="Nhập tên nhóm..."
                />
              </div>

              <div
                className={`flex items-center ${
                  tfPhoneNumberClick ? "border border-blue-600" : "border"
                } m-2 rounded-full p-2`}
              >
                <FontAwesomeIcon className="px-2" icon={faMagnifyingGlass} />
                <input
                  onFocus={handleFocusPhoneClick}
                  onBlur={handleBlurPhoneClick}
                  onChange={(event) => {
                    setTFPhoneNumber(event.target.value);
                  }}
                  className="w-full text-sm font-normal focus:outline-none"
                  type="text"
                  placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
                />
              </div>
            </div>

            <div className="h-[calc(65vh-70px)] w-full overflow-auto">
              <h6 className="p-2 text-sm font-semibold">Danh sách bạn bè</h6>

              <ul>
                {conversations
                  ? conversations.map((conversation) => (
                      <li
                        key={conversation.chatID}
                        className="flex items-center px-4 py-3"
                        onClick={() => handleOptionToggle(conversation.chatID)}
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2 h-4 w-4"
                          checked={selectedOptions.includes(
                            conversation.chatID,
                          )}
                          onChange={() => {}}
                        />
                        <img
                          src={conversation.chatAvatar}
                          alt={conversation.chatName}
                          className="mr-2 h-8 w-8 rounded-full"
                        />
                        <span>{conversation.chatName}</span>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          </DialogContent>
          <DialogActions className="p-4">
            <Button onClick={handleClose}>Hủy</Button>
            <Button
              onClick={handleCreateGroup}
              variant="contained"
              color="primary"
              disabled={!check}
            >
              Tạo nhóm
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
      <div
        className={`absolute inset-0 cursor-pointer rounded-md bg-black bg-opacity-0 transition-opacity duration-300  ${
          image ? "" : "hover:bg-opacity-10"
        }`}
        onClick={handleClickOpen}
      ></div>
    </div>
  );
}
