/**************************************************
** GAME MAIN BOARD CLASS
**************************************************/

const { Agent } = require("./Agent")

const Direction = {
	"UP" : [-1, 0],
	"DOWN" : [1, 0],
	"LEFT" : [0, -1],
	"RIGHT" : [0, 1]
}

// Reward values 
const MOVE_REWARD = -2
const LOCKOUT_REWARD = 25
const BAD_LOCKOUT_REWARD = -50
const GOAL_LOCKOUT_REWARD = 100
const GOAL_BAD_LOCKOUT_REWARD = -200

// Plant class takes an int id, 2D array map, start_point co-ord., goal_point co_ord., int number of episodes
var Plant = function(id, map, start_point, goal_point, episodes) {
	var map = map
    var id = id
    var start = start_point
    var goal = goal_point
    var valves = []
    var agents = []
    var episodes_left = episodes
    var solved = false

    // for reset purposes
    var saved_state = {
        "map" : map,
        "start" : start,
        "goal" : goal,
        "valves" : valves,
        "agents" : agents
    }

    var isSolved = function() {
        return solved;
    }

    // Save state in saved_state var
    var saveState = function() {
        saved_state.map = JSON.parse(JSON.stringify(map))
        saved_state.start = JSON.parse(JSON.stringify(start))
        saved_state.goal = JSON.parse(JSON.stringify(goal))
        saved_state.valves = JSON.parse(JSON.stringify(valves))
        saved_state.agents = JSON.parse(JSON.stringify(agents))
    }

    // Set map back to last saved setup
    var resetSavedState = function() {
        map = JSON.parse(JSON.stringify(saved_state.map))
        start = JSON.parse(JSON.stringify(saved_state.start))
        goal = JSON.parse(JSON.stringify(saved_state.goal))
        valves = JSON.parse(JSON.stringify(saved_state.valves))
        agents = JSON.parse(JSON.stringify(saved_state.agents))
    }

    // Resets map to new random setup. Usefull for successive episodes training
    var resetRandom = function() {
        number_valves = Math.floor( (map.length + map[0].length) / 2) - 1
        valves = JSON.parse(JSON.stringify(randomValves(number_valves)))
        // console.log(valves)
        goal = JSON.parse(JSON.stringify(randomGoal()))
        // console.log(goal)

    }

    var getRandomInt = function( min, max ) {
        return Math.floor( Math.random() * (max - min + 1) ) + min;
    }
      

    // Get an array of unique coordinates of num_valves size
    var randomValves = function(num_valves) {
        new_valves = []
        for (let i = 0; i < num_valves; i++) {
            var x,y 
            // Draw random coordinates until they are unique
            do {
                x = getRandomInt( 0, map.length - 1 );
                y = getRandomInt( 0, map[ 0 ].length - 1 );
                nv = [x, y]
            } while ( (new_valves.findIndex((valve) => JSON.stringify(valve) == JSON.stringify(nv))) != -1);
            new_valves.push(nv)
        }
        return new_valves
    }

    // Set the goal in a new random position
    var randomGoal = function() {
        do {
            x = getRandomInt( 0, map.length - 1 );
            y = getRandomInt( 0, map[ 0 ].length - 1 );
            ng = [x, y]
        } while ( (new_valves.findIndex((valve) => JSON.stringify(valve) == JSON.stringify(ng))) != -1);
        // console.log("rngoal")
        // console.log(ng)
        return ng
    }

    var addValve = function(vx, vy) {
        valves.push([vx, vy])
        saveState()
    }

    var addAgent = function() {
        agents.push(new Agent(start))
        saveState()
        return agents.length - 1
    }

    var getAgents = function() {
        return agents
    }

    var getAgent = function(agent_id) {
        return agents[agent_id]
    }

    var delAgent = function(agent_id) {
        agents[agent_id].delete()
        saveState()
    }

    // Moves agent of ID = agent_id in direction. Change in coordinates found in Direction[direction]
    var moveAgent = function(agent_id, direction) {
        current_a_pos = agents[agent_id].getPos()
        console.log(Direction[direction])
        new_pos = current_a_pos.map((e, i) => e + Direction[direction][i])
        if (!solved) {
            agents[agent_id].applyReward(MOVE_REWARD)
        }
        // Return current pos if move is out of bounds
        if (new_pos[0] < 0 || new_pos[0] >= map.length) {
            return current_a_pos
        }
        else if (new_pos[1] < 0 || new_pos[1] >= map[0].length) {
            return current_a_pos
        } 
        // Update coordinates if move is valid
        else {
            return agents[agent_id].setPos(new_pos)
        }
    }

    // Lockout main function
    var lockout = function(agent_id) {
        // Find valve id on agent position if there is one
        valve_id = valves.findIndex((valve) => JSON.stringify(valve) == JSON.stringify(agents[agent_id].getPos()))
        // Check if agent is on goal
        lockout_machine = (JSON.stringify(agents[agent_id].getPos()) == JSON.stringify(goal))

        // If agent is trying to lockout goal
        if (lockout_machine) {
            // Check if there are still valves to lockout
            // if not
            if (valves.length == 0) {
                // Apply reward if puzzle hasn't been solved already
                if (!solved) { 
                    agents[agent_id].applyReward(GOAL_LOCKOUT_REWARD)
                    console.log("Congratulations ! Proper Lockout !")
                }
                // Reset the game at random if there are still more episodes
                if (episodes_left > 1) {
                    episodes_left = episodes_left - 1
                    resetRandom()
                } 
                // Else mark game as solved
                else {
                    solved = true
                }
                return agents[agent_id].getReward()
            } 
            // If there are still valves to lock
            else {
                // If game is not over
                if (!solved) { 
                    // Apply reward (penalty)
                    agents[agent_id].applyReward(GOAL_BAD_LOCKOUT_REWARD)
                }
                console.log("Improper lockout, die a horrible death !")
                return agents[agent_id].getReward()
            }
        }

        // If there is a valve on agent position
        if (valve_id != -1){
            // Remove valve from list
            valves.splice(valve_id, 1)

            // Apply reward if game not over
            if (!solved) {
                agents[agent_id].applyReward(LOCKOUT_REWARD)
            }
            // console.log("removed valve")
            // console.log(valves)
            return agents[agent_id].getReward()
        } 
        // Else (there are no valves on position)
        else {
            // Apply reward (penalty) if game not over
            if (!solved) {
                agents[agent_id].applyReward(BAD_LOCKOUT_REWARD)
            }
            // console.log("Valve not found")
            // console.log(valves)
            return agents[agent_id].getReward()
        }
    }

    var getValves = function() {
        return valves
    }

    var getId = function() {
        return id
    }

    var resetSavedState = function() {
        map = saved_state.map

    }

    // Returns JSON string representing status of game
    var render = function() {
        display = JSON.parse(JSON.stringify(map))
        
        agents.forEach((agent) => {
            display[agent.getX()][agent.getY()] = 1
        })

        valves.forEach((valve) => {
            display[valve[0]] [valve[1]] += 2
        })

        display[goal[0]][goal[1]] += 4
        
        return JSON.stringify(display)
    }


	// Define which variables and methods can be accessed
	return {
        getId:getId,
        addValve:addValve,
        getValves:getValves,
        addAgent:addAgent,
        getAgents:getAgents,
        getAgent:getAgent,
        delAgent:delAgent,
        moveAgent:moveAgent,
        resetSavedState:resetSavedState,
        isSolved:isSolved,
        lockout:lockout,
        render:render
	}
};

// Export the Player class so you can use it in
// other files by using require("Plant").Plant
exports.Plant = Plant;