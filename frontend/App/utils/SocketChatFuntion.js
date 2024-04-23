import { v4 as uuidv4 } from 'uuid';
export { sendMessage, deliveryMessage, readMessage, hiddenMessage, recallMessage }
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
    ws.onopen = () => {
        console.log('Connected to the WebSocket server with ID ', senderID);
    }
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
    ws.onopen = () => {
        console.log('Connected to the WebSocket server with ID ', receiverID);
    }
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
    ws.onopen = () => {
        console.log('Connected to the WebSocket server with ID ', receiverID);
    }
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
    ws.onopen = () => {
        console.log('Connected to the WebSocket server with ID ', receiverID);
    }
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
    ws.onopen = () => {
        console.log('Connected to the WebSocket server with ID ', receiverID);
    }
    ws.send(JSON.stringify(message));
    ws.close();
};

function waitForWebSocketOpen(socket) {
    return new Promise((resolve, reject) => {
        if (socket.readyState === WebSocket.OPEN) {
            resolve(socket);
        } else {
            socket.addEventListener('open', () => {
                resolve(socket);
            });
            socket.addEventListener('error', (error) => {
                reject(error);
            });
        }
    });
}