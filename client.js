const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000', {reconnect: true});

const array_to_graph = require("./array2graphjs");
const everyPossibilities = require("./everyPossibilities");


// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.emit("newgame", ["lvl1", 25], newGameResponse => {
    const gameId = newGameResponse[0];
    const agentId = newGameResponse[1];

    console.log(newGameResponse)

    socket.emit("gamestatus", gameId, gameStatusResponse => {
        solve(gameStatusResponse, gameId, agentId)

    })
})


function solve(map, gameId, agentId) {
    gameStatusResponse = JSON.parse(map)
    // console.log(gameStatusResponse)

    console.log("Carte actuelle: ", JSON.stringify(gameStatusResponse))
    console.log("Génération du graph...")
    let graph = array_to_graph(gameStatusResponse)
    console.log("Calcul de tous les chemins possibles...")
    const everyPossiblities = everyPossibilities(graph)
    console.log("Test de tous les chemins...")

    if (everyPossiblities.length === 1) {
        console.log("Tous les chemins ont été résolu!")
        return;
    }

    let bestPath = []
    let bestWeight = Number.MAX_VALUE;

    everyPossiblities.forEach((possibility) => {
        let weight = 0;

        possibility.forEach((p, index) => {
            if (index !== possibility.length - 1) {
                weight += graph[p]["dest"][possibility[index + 1]];
            }

        })

        if (weight <= bestWeight) {
            bestPath = possibility;
            bestWeight = weight;
        }
    })

    console.log("Meilleur chemin trouvé: ", JSON.stringify(bestPath));
    console.log("Coût du chemin", bestWeight)

    bestPath.forEach((currentLetter, index) => {
        if (index === bestPath.length - 1) {
            socket.emit("lockout", [gameId, agentId], (response) => {
                game_status = response[0]
                reward = response[1]
                solved = response[2]

                console.log("Niveau résolu! Score actuel: ", reward)
                console.log("Passage au niveau suivant...")
                console.log()
                console.log()
                console.log()
                console.log()
                solve(game_status, gameId, agentId)
            })
        } else {
            let currentPos = graph[currentLetter]["coords"];
            let nextPos = graph[bestPath[index + 1]]["coords"];

            let moveX = currentPos[0] - nextPos[0];
            if (moveX > 0) {
                let i = Math.abs(moveX)
                // console.log("need to move ", i, "times left")

                while (i-- > 0) {
                    // console.log("move left")

                    socket.emit("move", [gameId, agentId, "LEFT"], (e => {
                    }));
                }
            } else if (moveX < 0) {
                let i = Math.abs(moveX)
                // console.log("need to move ", i, "times right")

                while (i-- > 0) {
                    // console.log("move right")

                    socket.emit("move", [gameId, agentId, "RIGHT"], (e => {
                    }))
                }
            }

            let moveY = currentPos[1] - nextPos[1];
            if (moveY > 0) {
                let i = Math.abs(moveY)
                // console.log("need to move ", i, "times up")

                while (i-- > 0) {
                    // console.log("move up")

                    socket.emit("move", [gameId, agentId, "UP"], (e => {
                    }))
                }
            } else if (moveY < 0) {
                let i = Math.abs(moveY)
                // console.log("need to move ", i, "times down")
                while (i-- > 0) {
                    // console.log("move down")

                    socket.emit("move", [gameId, agentId, "DOWN"], (e => {
                    }));
                }
            }


            socket.emit("lockout", [gameId, agentId], (response) => {
                game_status = response[0]
                reward = response[1]
                solved = response[2]
            })
            // verouille la valve
        }

    })
}