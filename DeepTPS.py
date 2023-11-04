import json
from itertools import permutations
import random
import sys

global game_status

def array_to_weighted_graph(array):
    graph = {}
    current_letter = ['A']

    def generate_elem(coords, is_start, is_end):
        graph[current_letter[0]] = {
            'letter': current_letter[0],
            'coords': coords,
            'isStart': is_start,
            'isEnd': is_end,
            'dest': {}
        }
        current_letter[0] = chr(ord(current_letter[0]) + 1)

    def add_dest(from_, to, distance):
        graph[from_]['dest'][to] = distance

    for y, sub in enumerate(array):
        for x, elem in enumerate(sub):
            if elem == 1:
                generate_elem([x, y], True, False)
            elif elem == 2:
                generate_elem([x, y], False, False)
            elif elem == 4:
                generate_elem([x, y], False, True)

    point_list = list(graph.keys())

    for current_letter[0] in point_list:
        current_elem = graph[current_letter[0]]
        other_letters = [l for l in point_list if l != current_letter[0]]

        for l in other_letters:
            e = graph[l]
            dist = abs(current_elem['coords'][0] - e['coords'][0]) + abs(current_elem['coords'][1] - e['coords'][1])
            add_dest(current_letter[0], l, dist)

    return graph

def func_every_possibilities(graph):
    point_list = list(graph.keys())
    starts = [point for point, info in graph.items() if info['isStart']]
    ends = [point for point, info in graph.items() if info['isEnd']]
    others = [info['letter'] for point, info in graph.items() if not info['isStart'] and not info['isEnd']]

    if not starts or not ends:
        return []

    all_possibilities = list(permutations(others))
    all_possibilities = [[starts[0]] + list(perm) + [ends[0]] for perm in all_possibilities]

    return all_possibilities



def generate_random_map(size):
    """ generate a random map : 
    there is one 1 that is the start 
    there is one 4 that is the end
    there is size(x+y)/2 2 that are checkpoints
    if there is 3, than mean 1 is already on a checkpoint
    if there is 5, than mean 1 is at the end 

    need to generate random 1 a start then random 4 a end and random 2 checkpoints
    if some morf then you add 3 or 5.
    But 4 and 2 can never be on the same case
        size (tuple): siez in x,y
    """
    import random
    # generate a random map
    x,y = size
    map = [[0 for i in range(x)] for j in range(y)]
    # generate a random start
    start_x = random.randint(0,x-1)
    start_y = random.randint(0,y-1)
    map[start_y][start_x] = 1
    # generate a random end
    end_x = random.randint(0,x-1)
    end_y = random.randint(0,y-1)
    #if it's on the same case as start, put 5 on the map 
    if end_x == start_x and end_y == start_y:
        map[end_y][end_x] = 5
    else:
        map[end_y][end_x] = 4

    # generate random checkpoints it's th floor(x + y / 2) -1  
    nb_checkpoints = int((x+y)/2) - 1


    i = 0 
    while i < nb_checkpoints:
        checkpoint_x = random.randint(0,x-1)
        checkpoint_y = random.randint(0,y-1)
        # if it's on the same case as start  put 3  but that 3 is not already on the map
        if checkpoint_x == start_x and checkpoint_y == start_y:
            if 3 in map[checkpoint_y]:
                pass
            else:
                map[checkpoint_y][checkpoint_x] = 3
                i += 1  
        else:
            map[checkpoint_y][checkpoint_x] = 2
            i += 1

    return map


# my_map = generate_random_map((5,5))


# calculate the score of each path
def calculate_score(path,graph):
    score = 0
    for i in range(len(path)-1):
        score += graph[path[i]]['dest'][path[i+1]]
    return score

# calculate the score of each path  print the best path (lower score)
def calculate_score_and_print_best_path(all_possibilities,graph):
    best_score = 100000
    best_path = []
    for path in all_possibilities:
        score = calculate_score(path,graph)
        if score < best_score:
            best_score = score
            best_path = path

    return best_path,best_score 
def main():
    array = generate_random_map((11,11))
    # convert string to array
    # array = json.loads(array)


    graph = array_to_weighted_graph(array)
    print(graph)
    all_possibilities = func_every_possibilities(graph)
    best_path,best_score = calculate_score_and_print_best_path(all_possibilities,graph)
    print(json.dumps(best_path))
    print(best_score)
    sys.stdout.flush()

if __name__ == "__main__":
    main()