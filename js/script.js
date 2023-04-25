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
  const res = numbers.reduce((num1, num2) => num1 / num2);
  return res;
}

let firstNumber = null;
let operator = null;
let secondNumber = null;

function operate(operator, num1, num2) {
  switch (operator) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
      return divide(num1, num2);
    default:
      return null;
  }
}
const display = document.querySelector("#display");
let displayValue = "";
const numberBtn = document.querySelectorAll(".number");

numberBtn.forEach((button) => {
  button.addEventListener("click", () => {
    populateDisplay(button.value);
  });
});

function populateDisplay(num) {
  displayValue += num;
  display.textContent = displayValue;
}

function resetDisplay() {
  displayValue = "";
}

const operatorBtn = document.querySelectorAll(".operator");

operatorBtn.forEach((button) => {
  button.addEventListener("click", () => {
    firstNumber = parseInt(displayValue);
    operator = button.value;
    resetDisplay();
  });
});

const equalBtn = document.querySelector(".equals");

equalBtn.addEventListener("click", () => {
  secondNumber = parseInt(displayValue);
  let res = operate(operator, firstNumber, secondNumber);
  resetDisplay();
  populateDisplay(res);
  operator = "";
});

function clearAll() {
  firstNumber = null;
  operator = null;
  secondNumber = null;
  resetDisplay();
  display.textContent = displayValue;
}

const clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", clearAll);
