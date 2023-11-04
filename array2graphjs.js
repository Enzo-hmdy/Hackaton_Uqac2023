function array_to_weighted_graph(array) {
    const graph = {

    };


    let currentLetter = "A"
    function generateElem(coords, isStart, isEnd) {
        graph[currentLetter] = {
            "letter": currentLetter,
            "coords": coords,
            "isStart": isStart,
            "isEnd": isEnd,
            "dest": {

            }
        }

        currentLetter = String.fromCharCode(currentLetter.charCodeAt() + 1)
    }

    function addDest(from, to, distance) {
        graph[from]["dest"][to] = distance
    }

    array.forEach((sub, y) => {
        sub.forEach((elem, x) => {
            switch (elem) {
                case 1:
                    generateElem([x, y], true, false)
                    break;
                case 2:
                    generateElem([x, y], false, false)
                    break;
                case 4:
                    generateElem([x, y], false, true)
                    break;
                case 0:
                default:
                    null;
            }
        })
    })



    // We now have a nice list of every point, we just need to add neighboors.


    const pointList = [];
    for (letter in graph) {
        pointList.push(letter)
    }


    // On repasse sur chaque point.
    pointList.forEach(currentLetter => {
        const currentElem = graph[currentLetter];
        const otherLetters = pointList.filter(e => e !== currentLetter);

        otherLetters.forEach(l => {
            const e = graph[l];

            const dist = Math.abs(currentElem["coords"][0] - e["coords"][0]) + Math.abs(currentElem["coords"][1] - e["coords"][1])
            addDest(currentLetter, l, dist);
        })
    })

    return graph;
}

module.exports = array_to_weighted_graph