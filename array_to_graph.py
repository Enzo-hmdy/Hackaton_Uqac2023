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


map = [[1,0,0,0,0],
       [0,2,0,0,0],
       [0,0,0,2,0],
       [0,2,0,0,0],
       [0,0,0,0,4]]

graph = array_to_weighted_graph(map)
print(graph)