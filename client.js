const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000', {reconnect: true});

const array_to_graph = require("./array2graphjs");


// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.emit("newgame", ["lvl0", 2], newGameResponse => {
    const gameId = newGameResponse[0];
    const agentId = newGameResponse[1];

    console.log(newGameResponse)

    socket.emit("gamestatus", gameId, gameStatusResponse => {
        gameStatusResponse = JSON.parse(gameStatusResponse)
        console.log(gameStatusResponse)
        console.log(array_to_graph(gameStatusResponse))
    })
})
