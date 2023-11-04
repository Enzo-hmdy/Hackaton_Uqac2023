/**
 *
 * @param graph
 * @returns {String[][]}
 */
function everyPossibilities(graph) {
    const pointList = Object.keys(graph);
    const starts = Object.values(graph).filter(e => e.isStart);
    const ends = Object.values(graph).filter(e => e.isEnd);
    const others = Object.values(graph).filter(e => !e.isStart && !e.isEnd).map(e => e.letter);

    if (starts.length === 0 || ends.length === 0) return [];

    const allPossibilities = permutation(others).map(list => [starts[0].letter, ...list, ends[0].letter]);

    return allPossibilities;
}


function permutation(arr) {
    const result = [];

    function p(array, temp) {
        if (!array.length) {
            result.push(temp);
        }
        for (let i = 0; i < array.length; i++) {
            const x = array.splice(i, 1)[0];
            p(array, temp.concat(x));
            array.splice(i, 0, x);
        }
    }

    p(arr, []);
    return result;
}
module.exports = everyPossibilities;
