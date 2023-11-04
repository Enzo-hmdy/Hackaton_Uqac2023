
def array_to_graph(array):
    graph = {}
    rows = len(array)
    cols = len(array[0])
    neighbors = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    for i in range(rows):
        for j in range(cols):
            node_value = array[i][j]
            node = (i, j)
            neighbors_list = []

            for dx, dy in neighbors:
                x, y = i + dx, j + dy

                if 0 <= x < rows and 0 <= y < cols:
                    neighbor_value = array[x][y]
                    neighbor = (x, y)
                    neighbors_list.append((neighbor, neighbor_value))

            graph[(node, node_value)] = neighbors_list

    return graph

my_map = [[1, 0, 2, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 2], [0, 0, 0, 0, 0], [4, 0, 0, 2, 0]]
graph = array_to_graph(my_map)

for (node, node_value), neighbors in graph.items():
    print(f"Node ({node}, value {node_value}) connects to: {neighbors}")
