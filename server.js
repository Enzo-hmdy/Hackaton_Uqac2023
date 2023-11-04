const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { Plant } = require('./game/Plant');
const path = require("path")

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});


// Game maps, game properties under level_name key
maps = {
    "lvl0" : [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    "lvl1" : [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],

    ]
}

valves = {
    "lvl0" : [
        [0, 2],
        [2, 4],
        [4, 3]
    ],
    "lvl1" : [
        [0, 2], 
        [0, 7],
        [2, 3],
        [3, 6],
        [5, 1],
        [7, 6]
    ]
}


start_points = {
    "lvl0" : [0, 0],
    "lvl1" : [0, 0]
}

goal_points = {
    "lvl0" : [4, 0],
    "lvl1" : [7, 0]
}

rooms = {}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Websocket event "newgame" handler  : Create a new game, args are initial lvl name and number of episodes
  socket.on("newgame", (args, callback) => {
    level_name = args[0]
    episodes = args[1]

    // Get unique ID
    do {
        game_id = Math.floor(Math.random() * 10000);
    } while (game_id in rooms)

    // Create game instance
    rooms[game_id] = new Plant(game_id, maps[level_name], start_points[level_name], goal_points[level_name], episodes)
    // Add valves
    valves[level_name].forEach(valve => {
        rooms[game_id].addValve(valve[0], valve[1])
    });
    // Add agent
    agent_id = rooms[game_id].addAgent()
    console.log(game_id)
    console.log(agent_id)
    // console.log(rooms)
    // Callback to client with game_id and agent_id
    callback([game_id, agent_id])
  })

  // Websocket event "gamestatus" handler : Return JSON string of rooms[game_id] status
  socket.on("gamestatus", (game_id, callback) => { 
    console.log(rooms[game_id].render())
    callback(rooms[game_id].render())
  })

  // Websocket "move" event handler : Move agent in game of ID game_id with ID agent_id in direction
  socket.on("move", (args, callback) => {
    game_id = args[0]
    agent_id = args[1]
    direction = args[2]
    rooms[game_id].moveAgent(agent_id, direction)
    // Callback to client with JSON string status and reward score of agent with ID agent_id 
    callback([rooms[game_id].render(), rooms[game_id].getAgent(agent_id).getReward() ])
  })

  // Websocket "lockout" event handler : In game with ID=game_id, have agent with ID=agent_id lockout
  socket.on("lockout", (args, callback) => {
    game_id = args[0]
    agent_id = args[1]
    rooms[game_id].lockout(agent_id)
    console.log(rooms[game_id].isSolved())
    // Callback to client with JSON string status, reward score of agent with ID agent_id and the isSolved boolean (true if game is over)
    callback([rooms[game_id].render(), rooms[game_id].getAgent(agent_id).getReward(), rooms[game_id].isSolved() ])
  })

//  // Add an agent to a game
//   socket.on("joinagent", (args, callback) => {
//     game_id = args[0]

//     if (game_id in rooms) {
//         callback(rooms[game_id].addAgent())
//     } else {
//         callback("No game with this ID !")
//     }
//   })

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});