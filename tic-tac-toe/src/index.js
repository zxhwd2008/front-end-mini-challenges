// The closest() method of the Element interface traverses the element and its parents (heading toward the document root) until it finds a node that matches the specified CSS selector.
(function () {
    const crossTemplate = document.createElement('i');
    crossTemplate.classList.add('fa-solid','fa-xmark', 'fa-2xl');

    const circleTemplate = document.createElement('i');
    circleTemplate.classList.add('fa-regular','fa-circle', 'fa-2xl');

    let crossPlayerHashMap = constructHashMap();
    let circlePlayerHashMap = constructHashMap();
    let visited = new Set();
    let isCrossTurn = true;
    let hasResult = false;

    const container = document.querySelector('.container');
    container.addEventListener('click', onClick);

    const resetBtn = document.querySelector('.reset-button');
    resetBtn.addEventListener('click', reset);

    const crossWinMsg = document.querySelector('.cross-win');
    const circleWinMsg = document.querySelector('.circle-win');

    function constructHashMap() {
        return {
            row0: 0,
            row1: 0,
            row2: 0,
            col0: 0,
            col1: 0,
            col2: 0,
            cross1: 0,
            cross2: 0,
        }
    }

    function onClick(e) {
        const colElem = e.target.closest('.cell');
        console.log(colElem);
        const rowElem = colElem.parentElement;

        const rowIndex = Array.from(container.children).indexOf(rowElem);
        const colIndex = Array.from(rowElem.children).indexOf(colElem);

        const index = rowIndex * 3 + colIndex;

        if (visited.has(index) || hasResult) {
            return;
        }

        visited.add(index);

        if (isCrossTurn) {
            colElem.append(crossTemplate.cloneNode(true));
            addMovementToHashMap(rowIndex, colIndex, crossPlayerHashMap);
            checkWinner(crossPlayerHashMap);
        } else {
            colElem.append(circleTemplate.cloneNode(true));
            addMovementToHashMap(rowIndex, colIndex, circlePlayerHashMap);
            checkWinner(circlePlayerHashMap);
        }
        
        isCrossTurn = !isCrossTurn;
    }

    function addMovementToHashMap(row, col, hashMap) {
        hashMap[`row${row}`] += 1;
        hashMap[`col${col}`] += 1;

        if (row === col) {
            hashMap.cross1 += 1;
        }

        if (row + col === 2) {
            hashMap.cross2 += 1;
        }
    }

    function checkWinner(hashMap) {
        for (const val of Object.values(hashMap)) {
            if (val === 3) {
                if (isCrossTurn) {
                    crossWinMsg.classList.remove('hide');
                    circleWinMsg.classList.add('hide');
                } else {
                    crossWinMsg.classList.add('hide');
                    circleWinMsg.classList.remove('hide');
                }

                hasResult = true;
            }
        }
    }

    function reset() {
        crossPlayerHashMap = constructHashMap();
        circlePlayerHashMap = constructHashMap();
        visited = new Set();
        isCrossTurn = true;
        hasResult = false;
        crossWinMsg.classList.add('hide');
        circleWinMsg.classList.add('hide');

        const icons = container.querySelectorAll('i');
        icons.forEach(icon => {
            icon.remove();
        });
    }
})();