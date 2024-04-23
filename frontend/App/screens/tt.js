// if (socket) {
//     console.log("WEBSOCKET WAS TURN ON");
//     socket.onmessage = (event) => {
//         const data = event.data;
//         console.log("Received data:", data);
//         try {
//             const jsonData = JSON.parse(data);
//             console.log("Received JSON data:", jsonData);
//             const newTopChatActivity = {
//                 messageID: jsonData.id,
//                 userID: jsonData.userID,
//                 timestamp: jsonData.timestamp,
//                 parentID: jsonData.parentID,
//                 contents: jsonData.contents,
//                 hiden: [],
//                 recall: false,
//             }