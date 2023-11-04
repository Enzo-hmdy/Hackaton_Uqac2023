import socketio
import asyncio

sio = socketio.AsyncClient()

async def get_game_status(game_id):
    await sio.emit("gamestatus", game_id, callback=handle_game_status)

def handle_game_status(response):
    game_status = response
    print(f'Game Status: {game_status}')
    # Vous pouvez traiter le statut du jeu ici

async def main():
    server_url = 'http://localhost:3000'  # Assurez-vous que le serveur Node.js tourne sur le port 3000

    await sio.connect(server_url)

    # Émettez la commande "newgame" pour obtenir game_id et agent_id
    await sio.emit("newgame", ["lvl0", 3], callback=handle_newgame_response)






    await sio.wait()

async def handle_newgame_response(response):
    game_id, agent_id = response
    print(f'New Game Response - Game ID: {game_id}, Agent ID: {agent_id}')
    
    # Appelez la fonction pour obtenir le statut du jeu en utilisant le game_id
    await get_game_status(game_id)

if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(main())
