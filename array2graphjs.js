function array_to_weighted_graph(array) {
    const graph = {};
    const rows = array.length;
    const cols = array[0].length;

    // Find the coordinates of 1, 2, and 4
    let start_coords = null;
    const end_coords = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const value = array[i][j];
            const coords = [i, j];
            if (value === 1) {
                start_coords = [coords, value];
            } else if (value === 2 || value === 4) {
                end_coords.push([coords, value]);
            }
        }
    }

    if (!start_coords || !end_coords) {
        return graph;  // No start or end nodes found
    }

    // Calculate distances between 1 and 2/4 and between 2/4
    for (const [end_coord, end_value] of end_coords) {
        const distance = Math.abs(start_coords[0][0] - end_coord[0]) + Math.abs(start_coords[0][1] - end_coord[1]);
        graph[[start_coords, [end_coord, end_value]]] = distance;
    }

    for (let i = 0; i < end_coords.length; i++) {
        for (let j = i + 1; j < end_coords.length; j++) {
            const distance = Math.abs(end_coords[i][0][0] - end_coords[j][0][0]) + Math.abs(end_coords[i][0][1] - end_coords[j][0][1]);
            graph[[end_coords[i], end_coords[i][1]], [end_coords[j], end_coords[j][1]]] = distance;
        }
    }

    return graph;
}

const my_map = [[1, 0, 2, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 2], [0, 0, 0, 0, 0], [4, 0, 0, 2, 0]];
const weighted_graph = array_to_weighted_graph(my_map);

for (const [[node1, value1], [node2, value2]] of Object.keys(weighted_graph)) {
    const distance = weighted_graph[[node1, value1], [node2, value2]];
    console.log(`Distance from Node ${node1} (Value ${value1}) to Node ${node2} (Value ${value2}): ${Math.floor(distance)}`);
}