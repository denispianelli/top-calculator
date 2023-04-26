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
    return "Cannot divide by zero";
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
let decimalAdded = false;
let prevInput = null;

function populateDisplay(num) {
  if (isNaN(num) && num !== ".") {
    display.textContent = "Invalid input";
    resetDisplay();
    return;
  } else if (num === "." && decimalAdded) {
    return;
  }

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
  decimalAdded = false;
  prevInput = null;
  resetFontSize();
}

function calculate() {
  if (operands.length < 2 || !operator) {
    return;
  }
  result = operate(operator, ...operands);
  operands = [result];
  const roundedResult = roundResult(result);
  display.textContent = roundedResult;

  const fontSize = parseInt(window.getComputedStyle(display).fontSize);
  const resultString = result.toString();
  const maxWidth = 242;
  let maxFontSize;
  if (resultString.length >= 15) {
    maxFontSize = Math.floor(maxWidth / (15 * 0.7));
  } else {
    maxFontSize = Math.floor(maxWidth / (resultString.length * 0.7));
  }
  display.style.fontSize = Math.min(fontSize, maxFontSize) + "px";
}

function roundResult(result) {
  const roundedResult = result.toFixed(15);
  if (/\.?0+$/.test(roundedResult)) {
    return Number(roundedResult).toString();
  } else {
    return roundedResult;
  }
}

const decimalBtn = document.querySelector(".decimal");
decimalBtn.addEventListener("click", () => {
  if (prevInput === null || prevInput === "operator") {
    resetDisplay();
    populateDisplay("0.");
  } else if (prevInput === "equal") {
    resetDisplay();
    operands = [];
    populateDisplay("0.");
  } else {
    populateDisplay(decimalBtn.textContent);
  }

  displayValue = display.textContent;
  prevInput = "decimal";
  decimalAdded = true;
});

const numberBtn = document.querySelectorAll(".number");
numberBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (prevInput === "equal") {
      resetFontSize();
      resetDisplay();
      operands = [];
    } else if (prevInput === "operator") {
      resetDisplay();
      resetFontSize();
    }

    populateDisplay(button.value);
    displayValue = Number(display.textContent);
    prevInput = "number";
    if (display.textContent > 7) {
      adjustFontSize();
    }
  });
});

const operatorBtn = document.querySelectorAll(".operator");
operatorBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (prevInput === "operator" && button.value === operator) {
      return;
    } else if (prevInput === "number") {
      prevInput = "operator";
      operands.push(displayValue);
    } else if (prevInput === "equal" && operands == result) {
      operator = button.value;
      prevInput = "operator";
      resetDisplay();
    } else if (prevInput === "equal" && operands !== result) {
      operands.push(displayValue);
      prevInput = "operator";
      resetDisplay();
    } else if (prevInput === "decimal") {
      prevInput = "operator";
      operands.push(Number(displayValue));
    }

    if (operands.length >= 2) {
      calculate();
    }

    operator = button.value;
    decimalAdded = false;
    prevInput = "operator";
  });
});

const equalBtn = document.querySelector(".equals");
equalBtn.addEventListener("click", () => {
  if (prevInput === "operator") {
    displayValue = Number(display.textContent);
    operands.push(displayValue);
    calculate();
  } else if (prevInput === "decimal") {
    operands.push(Number(displayValue));
    calculate();
  } else if (operands.length > 0) {
    operands.push(displayValue);
    calculate();
  } else {
    return;
  }
  prevInput = "equal";
  decimalAdded = false;
});

const clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", clearAll);

function adjustFontSize() {
  const fontSize = parseInt(window.getComputedStyle(display).fontSize);
  const numChars = display.textContent.length;

  if (numChars > 7 && fontSize > 15) {
    display.style.fontSize = fontSize - 4 + "px";
  }
}

function resetFontSize() {
  display.style.fontSize = 50 + "px";
}
