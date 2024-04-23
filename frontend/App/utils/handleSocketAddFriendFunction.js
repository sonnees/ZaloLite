const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8082 });

wss.on('connection', function connection(ws) {
    console.log('New client connected!');

    ws.on('message', function incoming(message) {
        console.log('Received message:', message);

        const data = JSON.parse(message);

        switch (data.tum) {
            case 'TUM01':
                console.log('Received friend request:', data);



                break;
            case 'TUM02':
                console.log('Received recall friend request:', data);



                break;
            case 'TUM03':
                console.log('Received accept friend request:', data);


                break;
            case 'TUM04':
                console.log('Received unfriend request:', data);



                break;
            default:
                console.log('Unknown message type:', data);
        }
    });
});
