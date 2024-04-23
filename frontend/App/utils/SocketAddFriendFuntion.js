import { v4 as uuidv4 } from 'uuid';
const sendFriendRequest = (yourProfile, myProfile, desc) => {
    const websocketURL = `ws://192.168.1.10:8082/ws/user/${yourProfile.userID}`;
    const message = {
        "id": uuidv4(),
        "tum": "TUM01",
        "senderID": myProfile.userID,
        "senderName": myProfile.userName,
        "senderAvatar": myProfile.avatar,
        "receiverID": yourProfile.userID,
        "receiverName": yourProfile.userName,
        "receiverAvatar": yourProfile.avatar,
        "description": desc
    };

    const ws = new WebSocket(websocketURL);
    ws.send(JSON.stringify(message));

    ws.close();
};

const recallFriendRequest = (senderID, receiverID) => {
    const websocketURL = `ws://localhost:8082/ws/user/${senderID}`;
    const message = {
        "id": uuidv4(),
        "tum": "TUM02",

        "senderID": senderID,
        "receiverID": receiverID,
    };

    const ws = new WebSocket(websocketURL);
    ws.send(JSON.stringify(message));

    ws.close();
};

const acceptFriendRequest = (yourProfile, myProfile) => {
    const websocketURL = `ws://localhost:8082/ws/user/${yourProfile.userID}`;
    const message = {
        "id": uuidv4(),
        "tum": "TUM03",
        "senderID": myProfile.userID,
        "senderName": myProfile.userName,
        "senderAvatar": myProfile.avatar,
        "receiverID": yourProfile.userID,
        "receiverName": yourProfile.userName,
        "receiverAvatar": yourProfile.avatar,
    };

    const ws = new WebSocket(websocketURL);
    ws.send(JSON.stringify(message));
    ws.close();
};

const unfriendRequest = (senderID, receiverID) => {
    const websocketURL = `ws://localhost:8082/ws/user/${senderID}`;
    const message = {
        "id": uuidv4(),
        "tum": "TUM04",
        "senderID": senderID,
        "receiverID": receiverID,
    };


    const ws = new WebSocket(websocketURL);
    ws.send(JSON.stringify(message));
    ws.close();
};