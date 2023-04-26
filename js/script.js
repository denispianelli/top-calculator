function add(...numbers) {
  const res = numbers.reduce((num1, num2) => num1 + num2);
  return res;
}

function subtract(...numbers) {
  const res = numbers.reduce((num1, num2) => num1 - num2);
  return res;
}

function multiply(...numbers) {
  const res = numbers.reduce((num1, num2) => num1 * num2);
  return res;
}

function divide(...numbers) {
  if (numbers.includes(0)) {
    return "nice try";
  }
  const res = numbers.reduce((num1, num2) => num1 / num2);
  return res;
}

function operate(operator, ...operands) {
  switch (operator) {
    case "+":
      return add(...operands);
    case "-":
      return subtract(...operands);
    case "*":
      return multiply(...operands);
    case "/":
      return divide(...operands);
    default:
      return null;
  }
}
const display = document.querySelector("#display");
let displayValue = "";
let operands = [];
display.textContent = "0";
let operator = null;
let result = null;

function populateDisplay(num) {
  displayValue += num;
  display.textContent = displayValue;
}

function resetDisplay() {
  displayValue = "";
}

function clearAll() {
  operands = [];
  operator = null;
  result = null;
  resetDisplay();
  display.textContent = "0";
}

function calculate() {
  if (operands.length < 2 || !operator) {
    return;
  }
  result = operate(operator, ...operands);
  operands = [result];

  if (result.toString().includes(".")) {
    const decimalPlaces = result.toString().split(".")[1].length;
    if (decimalPlaces > 15) {
      display.textContent = result.toFixed(15);
    } else {
      display.textContent = result;
    }
  } else {
    display.textContent = result;
  }
}

const numberBtn = document.querySelectorAll(".number");
let prevInputWasEqual = false;
let prevInputWasOperator = false;
numberBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (prevInputWasEqual) {
      resetDisplay();
      operands = [];
      prevInputWasEqual = false;
    } else if (prevInputWasOperator) {
      resetDisplay();
      prevInputWasOperator = false;
    }

    populateDisplay(button.value);
    displayValue = parseInt(display.textContent);
    prevInputWasNumber = true;
  });
});

const operatorBtn = document.querySelectorAll(".operator");
let prevInputWasNumber = false;
operatorBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (
      prevInputWasNumber == false &&
      prevInputWasEqual == false &&
      button.value == operator
    ) {
      return;
    } else if (prevInputWasNumber == true) {
      prevInputWasNumber = false;
      prevInputWasEqual = false;
      prevInputWasOperator = true;
      operands.push(displayValue);
      //resetDisplay();
    } else if (prevInputWasEqual == false && button.value == operator) {
      return;
    } else if (prevInputWasEqual == true && operands == result) {
      operator = button.value;
      prevInputWasEqual = false;
      prevInputWasOperator = true;
      resetDisplay();
    } else if (prevInputWasEqual == true && operands != result) {
      operands.push(displayValue);
      prevInputWasEqual = false;
      prevInputWasOperator = true;
      resetDisplay();
    }

    if (operands.length >= 2) {
      calculate();
    }

    operator = button.value;
  });
});

const equalBtn = document.querySelector(".equals");
equalBtn.addEventListener("click", () => {
  prevInputWasEqual = true;
  prevInputWasNumber = false;
  if (operands.length > 0) {
    operands.push(displayValue);
    calculate();
  } else {
    return;
  }
});

const clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", clearAll);
