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
  resetDisplay();
  display.textContent = "0";
}

function calculate() {
  if (operands.length < 2 || !operator) {
    return;
  }
  const result = operate(operator, ...operands);
  operands = [result];
  display.textContent = result;
}

const numberBtn = document.querySelectorAll(".number");
numberBtn.forEach((button) => {
  button.addEventListener("click", () => {
    populateDisplay(button.value);
    displayValue = parseInt(display.textContent);
    prevInputWasNumber = true;
  });
});

const operatorBtn = document.querySelectorAll(".operator");
let prevInputWasNumber = false;
operatorBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (prevInputWasNumber == false && button.value == operator) {
      return;
    } else {
      prevInputWasNumber = false;
      operands.push(displayValue);
      resetDisplay();
    }

    if (operands.length >= 2) {
      calculate();
    }
    operator = button.value;
    console.log(operands);
  });
});

const equalBtn = document.querySelector(".equals");
equalBtn.addEventListener("click", () => {
  operands.push(Number(displayValue));
  calculate();
});

const clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", clearAll);
