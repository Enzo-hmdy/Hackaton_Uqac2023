def array_to_weighted_graph(array):
    graph = {}
    rows = len(array)
    cols = len(array[0])

    # Find the coordinates of 1, 2, and 4
    start_coords = None
    end_coords = []

    for i in range(rows):
        for j in range(cols):
            value = array[i][j]
            coords = (i, j)
            if value == 1:
                start_coords = (coords, value)
            elif value == 2 or value == 4:
                end_coords.append((coords, value))

    if not start_coords or not end_coords:
        return graph  # No start or end nodes found

    # Calculate distances between 1 and 2/4 and between 2/4
    for (end_coord, end_value) in end_coords:
        distance = abs(start_coords[0][0] - end_coord[0]) + abs(start_coords[0][1] - end_coord[1])
        graph[(start_coords, (end_coord, end_value))] = distance

    for i in range(len(end_coords)):
        for j in range(i + 1, len(end_coords)):
            distance = abs(end_coords[i][0][0] - end_coords[j][0][0]) + abs(end_coords[i][0][1] - end_coords[j][0][1])
            graph[(end_coords[i], end_coords[i][1]), (end_coords[j], end_coords[j][1])] = distance

    return graph

my_map = [[1, 0, 2, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 2], [0, 0, 0, 0, 0], [4, 0, 0, 2, 0]]
weighted_graph = array_to_weighted_graph(my_map)

# Printing the weighted graph with integer distances
for (node1, value1), (node2, value2) in weighted_graph.keys():
    distance = weighted_graph[(node1, value1), (node2, value2)]
    print(f"Distance from Node {node1} (Value {value1}) to Node {node2} (Value {value2}): {int(distance)}")
