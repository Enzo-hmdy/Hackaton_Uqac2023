const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000', {reconnect: true});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.emit("newgame", ["lvl0", 2], newGameResponse => {
    const gameId = newGameResponse[0];
    const agentId = newGameResponse[1];

    console.log(newGameResponse)

    socket.emit("gamestatus", gameId, gameStatusResponse => {
        console.log(gameStatusResponse)
    })
})
