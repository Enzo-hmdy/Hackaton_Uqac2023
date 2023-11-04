/**
 *
 * @param graph
 * @returns {String[][]}
 */
function everyPossibilities(graph) {
    const pointList = [];
    for (letter in graph) {
        pointList.push(letter)
    }

    let start;
    let end;
    let others = []

    for (let [key, e] of Object.entries(graph)) {
        if (e["isStart"] === true) {
            start = e;
        } else if (e["isEnd"] === true) {
            end = e;
        } else if (e["isValve"] === true) {
            others.push(e)
        }
    }

    if (start == null || end == null)
        return []

    const otherValues = [];
    others.forEach(e => {
        otherValues.push(e["letter"])
    })


    const allPossibilities = permutation(otherValues).map(list => {
        return [start["letter"], ...list, end["letter"]]
    })

    return allPossibilities;
}


function permutation(arr) {
    function p(array, temp) {
        var i, x;
        if (!array.length) {
            result.push(temp);
        }
        for (i = 0; i < array.length; i++) {
            x = array.splice(i, 1)[0];
            p(array, temp.concat(x));
            array.splice(i, 0, x);
        }
    }

    var result = [];
    p(arr, []);
    return result;
}

module.exports = everyPossibilities;
