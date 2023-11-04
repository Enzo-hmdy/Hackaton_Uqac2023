/**************************************************
** GAME PLAYER CLASS
**************************************************/



var Agent = function(position) {
	var x = position[0],
		y = position[1];

	var reward = 0

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var getPos = function() {
		return [x, y]
	}

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var setPos = function(newPos) {
		x = newPos[0]
		y = newPos[1]
		getPos()
	}

	var applyReward = function(action_reward) {
		reward += action_reward
	}

	var resetReward = function() {
		reward = 0
	}

	var getReward = function() {
		return reward
	}

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getPos:getPos,
		setX: setX,
		setY: setY,
		setPos:setPos,
		getReward:getReward,
		applyReward:applyReward,
		resetReward:resetReward
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Agent = Agent;