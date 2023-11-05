import json
from itertools import permutations
import random
import sys
import numpy as np

# global best_score
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

    starts = starts[0]
    ends = ends[0]
    all_others = np.array([point for point in others if point != starts and point != ends])

    all_possibilities = []
    # generate all permutations of others
    for perm in permutations(all_others):
        all_possibilities.append([starts] + list(perm) + [ends])

   
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
        # place a checkpoint but veryfie that it's not on the same as a precedent checkpoint
        elif map[checkpoint_y][checkpoint_x] == 0:
            map[checkpoint_y][checkpoint_x] = 2
            i += 1
        else:
            pass

    return map


# my_map = generate_random_map((5,5))


# calculate the score of each path
def calculate_score(path, graph, best_score):
    score = 0
    for i in range(len(path) - 1):
        score += graph[path[i]]['dest'][path[i + 1]]
        if score > best_score:
            return 100000
    return score

def nearest_neighbor(graph):
    start = [point for point in graph if graph[point]['isStart']][0]
    end = [point for point in graph if graph[point]['isEnd']][0]

    unvisited = set(graph.keys())
    unvisited.remove(start)
    path = [start]

    while unvisited:
        current_point = path[-1]
        nearest_point = min(unvisited, key=lambda point: graph[current_point]['dest'][point])
        path.append(nearest_point)
        unvisited.remove(nearest_point)

    path.append(end)

    return path
def calculate_score_and_print_best_path(all_possibilities, graph):
    best_score = 100000
    best_path = []
    for path in all_possibilities:
        score = calculate_score(path, graph, best_score)
        if score < best_score:
            best_score = score
            best_path = path

    return best_path, best_score

import time
def main():
    array = generate_random_map((8,8))
    graph = array_to_weighted_graph(array)

    # Original approach
    start = time.time()
    all_possibilities = func_every_possibilities(graph)
    best_path_original, best_score_original = calculate_score_and_print_best_path(all_possibilities, graph)
    end = time.time()
    print("Time taken:", end - start)

    # Nearest Neighbor approach
    try : 
        start = time.time()
        best_path_nearest_neighbor = nearest_neighbor(graph)
        best_score_nearest_neighbor = calculate_score(best_path_nearest_neighbor, graph, float('inf'))
        end = time.time()
        print("Time taken:", end - start)
    except:
        best_path_nearest_neighbor = []
        best_score_nearest_neighbor = 0
        print("No path found")

    print("Original Approach:")
    print("Best Path:", best_path_original)
    print("Best Score:", best_score_original)

    print("Nearest Neighbor Approach:")
    print("Best Path:", best_path_nearest_neighbor)
    print("Best Score:", best_score_nearest_neighbor)

if __name__ == "__main__":
    main()