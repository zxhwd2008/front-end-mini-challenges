(function () {
    const crossTemplate = `<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" /> </svg>`;
    const circleTemplate = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> </svg>`;
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
        if (e.target.getAttribute('class').indexOf('cell') === -1) {
            return;
        }

        const colElem = e.target;
        const rowElem = colElem.parentElement;

        const rowIndex = Array.from(container.children).indexOf(rowElem);
        const colIndex = Array.from(rowElem.children).indexOf(colElem);

        const index = rowIndex * 3 + colIndex;

        if (visited.has(index) || hasResult) {
            return;
        }

        visited.add(index);

        if (isCrossTurn) {
            placeMovement(colElem, crossTemplate);
            addMovementToHashMap(rowIndex, colIndex, crossPlayerHashMap);
            checkWinner(crossPlayerHashMap);
        } else {
            placeMovement(colElem, circleTemplate);
            addMovementToHashMap(rowIndex, colIndex, circlePlayerHashMap);
            checkWinner(circlePlayerHashMap);
        }
        
        isCrossTurn = !isCrossTurn;
    }

    function placeMovement(target, template) {
        target.innerHTML = template;
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

        for (const row of container.children) {
            for (const cell of row.children) {
                const movement = cell.querySelector('svg');
                if (!movement) {
                    continue;
                }

                movement.remove();
            }
        }
    }
})();