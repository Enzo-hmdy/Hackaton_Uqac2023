const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000', {reconnect: true});

const array_to_graph = require("./array2graphjs");
const everyPossibilities = require("./everyPossibilities");


// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.emit("newgame", ["lvl1", 2], newGameResponse => {
    const gameId = newGameResponse[0];
    const agentId = newGameResponse[1];

    console.log(newGameResponse)

    socket.emit("gamestatus", gameId, gameStatusResponse => {
        gameStatusResponse = JSON.parse(gameStatusResponse)
        console.log(gameStatusResponse)

        let graph = array_to_graph(gameStatusResponse)

        const everyPossiblities = everyPossibilities(graph)

        let bestPath = []
        let bestWeight = Number.MAX_VALUE;

        everyPossiblities.forEach((possibility) => {
            let weight = 0;

            possibility.forEach((p, index) => {
                if (index !== possibility.length - 1) {
                    weight += graph[p]["dest"][possibility[index + 1]];
                }

            })


            console.log(possibility)
            console.log(weight)
            if (weight <= bestWeight) {
                bestPath = possibility;
                bestWeight = weight;
            }
        })

        console.log(bestPath)
        console.log(bestWeight)

    })
})
