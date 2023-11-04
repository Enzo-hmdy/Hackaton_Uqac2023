import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Connected to server')

@sio.event
def move(game_id, agent_id, direction):
    @sio.event
    def response(response):
        game_status = response[0]
        reward = response[1]
        displayStatus(game_status)
        elem_reward.innerText = reward

    if direction == "right":
        sio.emit('move', [game_id, agent_id, "right"], callback=response)
    elif direction == "left":
        sio.emit('move', [game_id, agent_id, "left"], callback=response)
    else:
        print("Invalid direction")

sio.connect('http://localhost:3000')

#sio.move(335, 0, "right")
