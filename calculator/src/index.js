// css: box-sizing, word-break etc.
// edge cases with calculator
// should mention js decimal calculation is not working correctly (3.3 >= 1.1 * 3 false)
// how to fix (use decimalType or convert to int)
(function () {
    const cells = document.querySelectorAll('.calculator-container .cell');
    const output = document.querySelector('.calculator-container .output');

    let expression = '0';

    cells.forEach(cell => {
        cell.addEventListener('click', onClick);
    });

    function onClick(e) {
        const val = e.target.textContent;
        const isOperator = e.target.classList.contains('operator');
        if (isOperator) {
            expression = addOperator(expression, val);
        } else if (!isNaN(val)) {
            expression = addNum(expression, val);
        }

        output.textContent = expression;
    }

    function addOperator(expression, operator) {
        const len = expression.length;

        if (isNaN(expression[len - 1]) && (operator === '%' || operator === '+/-' || operator === '=')) {
            return expression;
        }

        if (operator === 'AC') {
            return reset();
        } else if (operator === '%') {
            const [lastNum, lastNumIndex] = findLastNum(expression);
            return expression.substring(0, lastNumIndex) + (lastNum / 100);
        } else if (operator === '+/-') {
            const [lastNum, lastNumIndex] = findLastNum(expression);
            return expression.substring(0, lastNumIndex) + (-lastNum);
        } else if (operator === '=') {
            const result = eval(expression);
            return result.toString();
        } else if (operator === ',') {
            const [lastNum] = findLastNum(expression);
            
            if (isNaN(expression[len - 1])) {
                return expression + '0.';
            } else if (lastNum !== parseInt(lastNum, 10)) {
                return expression;
            }

            return expression + '.';
        } else {
            if (!isNaN(expression[len - 1])) {
                return expression + operator;
            }
            
            return expression.substring(0, len - 1) + operator;
        }
    }

    function addNum(expression, num) {
        if (expression[expression.length - 1] === '0') {
            return eliminateZero(expression, num);
        }

        return expression + num;
    }

    function findLastNum(expression) {
        let index = expression.length - 1;

        while (!isNaN(expression[index]) || expression[index] === '-' || expression[index] === '.') {
            index--;
        }

        const lastNum = index === expression.length - 1 ? null : parseFloat(expression.substring(index + 1), 10);
        const lastIndex = index === expression.length - 1 ? null : index + 1;

        return [lastNum, lastIndex];
    }

    function eliminateZero(expression, num) {
        const lastCharIndex = expression.length - 1;
        if (expression[lastCharIndex] === '0' && (isNaN(expression[lastCharIndex - 1]) || lastCharIndex === 0)) {
            return expression.substring(0, lastCharIndex) + num;
        }

        return expression + num;
    }

    function reset() {
        expression = '0';

        return expression;
    }

})();