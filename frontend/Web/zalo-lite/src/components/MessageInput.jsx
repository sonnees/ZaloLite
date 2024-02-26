import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div
      className="flex w-full items-center bg-white"
      style={{ height: "58.5px" }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Nhập tin nhắn..."
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        inputProps={{ style: { fontSize: 15} }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderTop: "1px solid",
            borderBottom: "none",
            borderLeft: "none",
            borderRight: "none",
            borderColor: "#CFD6DC",
            borderRadius: 2,
          },
          "& .MuiOutlinedInput-root:hover": {
            borderTop: "1px solid",
            borderBottom: "none",
            borderLeft: "none",
            borderRight: "none",
            borderRadius: 2,
            borderColor: "blue",
          },
          "& .Mui-focused": {
            borderTop: "1px solid",
            borderBottom: "none",
            borderLeft: "none",
            borderRight: "none",
            borderRadius: 2,
          },
        }}
      />
      {/* <IconButton color="primary" onClick={handleSendMessage}>
        <SendIcon />
      </IconButton> */}
    </div>
  );
};

export default MessageInput;
