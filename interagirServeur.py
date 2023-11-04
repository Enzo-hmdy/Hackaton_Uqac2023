import socketio
import asyncio

sio = socketio.AsyncClient()
game_id = None
agent_id = None

async def get_game_status(game_id):
    await sio.emit("gamestatus", game_id, callback=handle_game_status)
    await asyncio.sleep(1)

async def handle_newgame_response(response):
    game_id, agent_id = response
    print(f'New Game Response - Game ID: {game_id}, Agent ID: {agent_id}')
    
    # Appelez la fonction pour obtenir le statut du jeu en utilisant le game_id
    await get_game_status(game_id)

def handle_game_status(response):
    game_status = response
    print(f'Game Status: {game_status}')
    # Vous pouvez traiter le statut du jeu ici


async def move(direction):
    print(f'Moving {direction}')
    response = await sio.emit("move", [game_id, agent_id, direction])
    await asyncio.sleep(1)

    if response and response[0] == 'success':
        game_status = response[1]
        print(f'Game Status: {game_status}')
    else:
        print('Error: Move operation failed')
   
    

def handle_move_status(response):
    game_status = response[0]
    reward = response[1]
    print(f'Game Status: {game_status}'
          f'Reward: {reward}')
    # Vous pouvez traiter le statut du jeu ici

async def main():
    server_url = 'http://localhost:3000'  # Assurez-vous que le serveur Node.js tourne sur le port 3000

    await sio.connect(server_url,wait_timeout=1000)
    #pause 5 secondes
    await asyncio.sleep(1)

    print('Connected to server!')
    # Émettez la commande "newgame" pour obtenir game_id et agent_id
    await sio.emit("newgame", ["lvl0", 3], callback=handle_newgame_response)
    await asyncio.sleep(1)
    
    

    while True: 

        print("1 - UP\n2 - RIGHT\n3 - DOWN\n4 - LEFT\n5 - EXIT\n")

        direction = input("Enter a direction: ")

        if direction == "1":
            response = await sio.emit("move", [game_id, agent_id, direction])
            await asyncio.sleep(1)

            if response and response[0] == 'success':
                game_status = response[1]
                print(f'Game Status: {game_status}')
            else:
                print('Error: Move operation failed')
            

        elif direction == "2":
            await move('RIGHT')
        
        elif direction == "3":
            await move('DOWN')
        
        elif direction == "4":
            await move('LEFT')
        
        elif direction == "5":
            break

    await sio.disconnect()



if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(main())
