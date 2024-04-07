import { v4 as uuidv4 } from 'uuid';
const sendMessage = (myProfile, key, value, parentID, senderID) => {
    const websocketURL = `ws://localhost:8082/ws/chat/${senderID}`;
    const message = {
        "id": uuidv4(),
        "tcm": "TCM01",
        "userID": myProfile.userID,
        "userAvatar": myProfile.avatar,
        "userName": myProfile.userName,
        "timestamp": new Date(),
        "parentID": parentID,
        "contents":
            [
                {
                    "key": key,
                    "value": value
                }
            ]
    };

    const ws = new WebSocket(websocketURL);
    ws.send(JSON.stringify(message));
    ws.close();
};

const deliveryMessage = (myProfile, messageID, receiverID) => {
    const websocketURL = `ws://localhost:8082/ws/chat/${receiverID}`;
    const message = {
        "id": uuidv4(),
        "tcm": "TCM02",
        "userID": myProfile.userID,
        "messageID": messageID,
        "userAvatar": myProfile.avatar,
        "userName": myProfile.userName,
    };

    const ws = new WebSocket(websocketURL);
    ws.send(JSON.stringify(message));
    ws.close();
};

const readMessage = (myProfile, messageID, receiverID) => {
    const websocketURL = `ws://localhost:8082/ws/chat/${receiverID}`;
    const message = {
        "id": uuidv4(),
        "tcm": "TCM03",
        "userID": myProfile.userID,
        "messageID": messageID,
        "userAvatar": myProfile.avatar,
        "userName": myProfile.userName,
    };

    const ws = new WebSocket(websocketURL);
    ws.send(JSON.stringify(message));
    ws.close();
};

const hiddenMessage = (myID, messageID, receiverID) => {
    const websocketURL = `ws://localhost:8082/ws/chat/${receiverID}`;
    const message = {
        "id": uuidv4(),
        "tcm": "TCM04",
        "userID": myID,
        "messageID": messageID
    };

    const ws = new WebSocket(websocketURL);
    ws.send(JSON.stringify(message));
    ws.close();
};

const recallMessage = (myID, messageID, receiverID) => {
    const websocketURL = `ws://localhost:8082/ws/chat/${receiverID}`;
    const message = {
        "id": uuidv4(),
        "tcm": "TCM05",
        "userID": myID,
        "messageID": messageID
    };

    const ws = new WebSocket(websocketURL);
    ws.send(JSON.stringify(message));
    ws.close();
};
// const typingMessage = (myProfile, chatID, receiverID) => {
//     const websocketURL = `ws://localhost:8082/ws/chat/${receiverID}`;
//     const message = {
//         "id": uuidv4(),
//         "tcm": "TCM06",
//         "chatID": chatID,
//         "senderName": myProfile.userName
//     };

//     const ws = new WebSocket(websocketURL);
//     ws.send(JSON.stringify(message));
//     ws.close();
// };