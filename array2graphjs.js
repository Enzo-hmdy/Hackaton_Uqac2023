function array_to_graph(array) {
    let graph = {};
    let rows = array.length;
    let cols = array[0].length;
    let neighbors = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let node_value = array[i][j];
            let node = [i, j];
            let neighbors_list = [];

            for (let [dx, dy] of neighbors) {
                let x = i + dx;
                let y = j + dy;

                if (0 <= x && x < rows && 0 <= y && y < cols) {
                    let neighbor_value = array[x][y];
                    let neighbor = [x, y];
                    neighbors_list.push([neighbor, neighbor_value]);
                }
            }

            graph[[node, node_value]] = neighbors_list;
        }
    }

    return graph;
}

let my_map = [[1, 0, 2, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 2], [0, 0, 0, 0, 0], [4, 0, 0, 2, 0]];
let graph = array_to_graph(my_map);

for (let [[x, y], node_value] of Object.keys(graph)) {
    console.log(`Node (${x}, ${y}), value ${node_value} connects to: ${graph[[x, y], node_value]}`);
}