const display = document.querySelector("#display");
let displayValue = "0";
display.textContent = displayValue;
let firstNumber = null;
let secondNumber = null;
let result = 0;
let prevInput = null;
let operator = null;
let lastOperator = null;
let prevKey = null;

function calculate(operator, a, b) {
  if (isNaN(a) || isNaN(b)) {
    displayError("Invalid input");
    return;
  }

  if (!isSupportedOperator(operator)) {
    displayError("Invalid input");
    return;
  }

  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      if (b === 0) {
        displayError("Cannot divide by zero");
        return;
      } else {
        result = a / b;
      }
      break;
    default:
      result = null;
      break;
  }

  function isSupportedOperator(operator) {
    return (
      operator === "+" ||
      operator === "-" ||
      operator === "*" ||
      operator === "/"
    );
  }

  function displayError(errorMessage) {
    display.textContent = errorMessage;
    adjustFontSize(errorMessage);
  }

  const roundedResult = roundResult(result);
  firstNumber = parseFloat(roundedResult);
  secondNumber = null;
  displayValue = firstNumber;
  display.textContent = displayValue;
  adjustFontSize(displayValue);
  return result;
}

function populateDisplay(num) {
  if (isNaN(num) && num !== ".") {
    display.textContent = "Invalid input";
    resetFontSize();
    return;
  }

  displayValue += num;
  display.textContent = displayValue;
}

function clearAll() {
  document.querySelector(".clear-text").textContent = "AC";
  display.textContent = "0";
  displayValue = "0";
  firstNumber = null;
  secondNumber = null;
  result = 0;
  prevInput = null;
  lastOperator = null;
  prevKey = null;
  operator = null;
  resetFontSize();
}

function roundResult(result) {
  const roundedResult = Number(result).toFixed(15);
  if (/\.?0+$/.test(roundedResult) || /\.?9+$/.test(roundedResult)) {
    return Number(roundedResult).toString();
  } else {
    return roundedResult;
  }
}

function blinkDisplay() {
  display.classList.add("blink");
  setTimeout(() => {
    display.classList.remove("blink");
  }, 100);
}

function adjustFontSize(value) {
  const fontSize = parseInt(window.getComputedStyle(display).fontSize);
  const resultString = value.toString();
  const maxWidth = 242;
  let maxFontSize;
  maxFontSize = Math.floor(maxWidth / (resultString.length * 0.7));

  if (prevKey == "backSpace" && maxFontSize < 50) {
    display.style.fontSize = Math.max(fontSize, maxFontSize) + "px";
  } else {
    display.style.fontSize = Math.min(fontSize, maxFontSize) + "px";
  }
}

function resetFontSize() {
  display.style.fontSize = 50 + "px";
}

const decimalBtn = document.querySelector(".decimal");
decimalBtn.addEventListener("click", handleDecimalClick);

function handleDecimalClick() {
  if (
    display.textContent == "Cannot divide by zero" ||
    display.textContent == "Invalid input"
  ) {
    clearAll();
  }

  if (prevInput == "operator") {
    displayValue = "0";
  }

  if (displayValue.toString().includes(".")) {
    return;
  }

  populateDisplay(".");

  prevInput = "decimal";
}

const numberBtn = document.querySelectorAll(".number");
const clearText = document.querySelector(".clear-text");
numberBtn.forEach((button) => {
  button.addEventListener("click", handleNumberClick);
});

function handleNumberClick(event) {
  const buttonValue = event.target.value;
  clearText.textContent = "C";
  if (
    display.textContent == "Cannot divide by zero" ||
    display.textContent == "Invalid input"
  ) {
    clearAll();
  }

  if (
    displayValue.toString().startsWith("0") &&
    !displayValue.toString().includes(".")
  ) {
    displayValue = displayValue.slice(1, -1);
  }

  if (prevInput == "equal") {
    displayValue = "";
    firstNumber = null;
    secondNumber = null;
  }

  if (prevInput == "operator") {
    displayValue = "";
  } else if (displayValue === "-0") {
    displayValue = "-";
  }

  if (display.textContent.length > 16) {
    return;
  } else {
    populateDisplay(buttonValue);
  }

  adjustFontSize(displayValue);
  prevInput = "number";
  prevKey = null;
}

const operatorBtn = document.querySelectorAll(".operator");
operatorBtn.forEach((button) => {
  button.addEventListener("click", () => {
    handleOperatorClick(button);
    activateOperatorButton(button);
  });
});

function activateOperatorButton(button) {
  operatorBtn.forEach((op) => {
    if (op !== button) {
      op.classList.remove("active");
    }
  });
  button.classList.add("active");
}

function handleOperatorClick(button) {
  blinkDisplay();
  if (
    display.textContent == "Cannot divide by zero" ||
    (prevInput == "operator" && button.value == lastOperator)
  ) {
    return;
  }

  if (firstNumber == null) {
    firstNumber = parseFloat(displayValue);
  } else if (
    secondNumber == null &&
    prevInput != "equal" &&
    prevInput != "plus-minus" &&
    prevInput != "operator"
  ) {
    secondNumber = parseFloat(displayValue);
  }

  if (firstNumber != null && secondNumber != null) {
    calculate(operator, firstNumber, secondNumber);
  }

  switch (button.value) {
    case "+":
      lastOperator = "+";
      break;
    case "-":
      lastOperator = "-";
      break;
    case "/":
      lastOperator = "/";
      break;
    case "*":
      lastOperator = "*";
      break;
    default:
      break;
  }

  operator = button.value;
  prevInput = "operator";
}

const equalBtn = document.querySelector(".equals");
equalBtn.addEventListener("click", handleEqualClick);

function handleEqualClick() {
  blinkDisplay();
  resetFontSize();
  operatorBtn.forEach((operator) => {
    operator.classList.remove("active");
  });

  if (secondNumber == null && prevInput != "equal" && operator != null) {
    secondNumber = parseFloat(displayValue);
  }

  if (firstNumber == null) {
    firstNumber = parseFloat(displayValue);
    secondNumber = null;
  }

  if (firstNumber != null && secondNumber != null) {
    calculate(operator, firstNumber, secondNumber);
  }

  prevInput = "equal";
}

const clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
  handleClearClick();
});

function handleClearClick() {
  clearAll();
  blinkDisplay();
  operatorBtn.forEach((operator) => {
    operator.classList.remove("active");
  });
}

const plusMinus = document.querySelector(".plus-minus");
plusMinus.addEventListener("click", () => {
  blinkDisplay();
  negateNumber();
});

function negateNumber() {
  if (display.textContent == "Cannot divide by zero") {
    return;
  }

  if (firstNumber == null && display.textContent == "0") {
    displayValue = "-0";
  } else if (displayValue == "-0") {
    displayValue = "0";
  } else if (prevInput == "operator" && firstNumber != null) {
    displayValue = "-0";
  } else if (displayValue == firstNumber) {
    displayValue *= -1;
    firstNumber = displayValue;
  } else {
    displayValue *= -1;
  }

  display.textContent = displayValue;
  prevInput = "plus-minus";
}

const percentageBtn = document.querySelector(".percentage");
percentageBtn.addEventListener("click", () => {
  blinkDisplay();
  percentageDivisor();
});

function percentageDivisor() {
  if (display.textContent == "Cannot divide by zero") {
    return;
  }

  if (displayValue.toString().length >= 8) {
    return;
  } else if (lastOperator == "+" || lastOperator == "-") {
    displayValue = parseFloat(firstNumber * (displayValue / 100));
  } else {
    displayValue = parseFloat(displayValue / 100);
  }

  display.textContent = displayValue;
  adjustFontSize(displayValue);
}

//Keyboard support
function highlight(button) {
  button.classList.add("highlight");
  setTimeout(() => {
    button.classList.remove("highlight");
  }, 100);
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^\d$/.test(key)) {
    numberBtn.forEach((button) => {
      if (button.textContent === key) {
        button.click();
        highlight(button);
      }
    });
  } else if (key === "") {
    return;
  } else if (key === "Backspace") {
    handleBackSpace();
  } else if (key === "Enter") {
    event.preventDefault();
    equalBtn.click();
  } else if (key === "." || key === ",") {
    decimalBtn.click();
  } else if (key === "Escape") {
    clearBtn.click();
    highlight(clearBtn);
  } else if (key === "%") {
    highlight(percentageBtn);
    event.preventDefault();
    percentageBtn.click();
  } else if (event.ctrlKey && key === "-") {
    highlight(plusMinus);
    event.preventDefault();
    plusMinus.click();
  } else {
    operatorBtn.forEach((button) => {
      if (button.textContent === key) {
        button.click();
      } else if (key === "/" && button.value === "/") {
        event.preventDefault();
        button.click();
      } else if (key === "*" && button.value === "*") {
        event.preventDefault();
        button.click();
      } else if (key === "+" && button.value === "+") {
        event.preventDefault();
        button.click();
      } else if ((key === "-") & (button.value === "-")) {
        event.preventDefault();
        button.click();
      }
    });
  }
});

function handleBackSpace() {
  if (
    display.textContent.includes("NaN") ||
    prevInput == "operator" ||
    prevInput == "equal"
  ) {
    return;
  } else {
    displayValue = displayValue.toString().slice(0, -1);
    display.textContent = displayValue;
  }
  if (displayValue.length == 0) {
    display.textContent = "0";
  }

  if (display.textContent.length >= 8) {
    adjustFontSize(display.textContent);
  } else if (display.textContent.length <= 9) {
    display.style.fontSize = 50 + "px";
  }

  prevKey = "backSpace";
}

// Dark mode support
const header = document.querySelector(".header-container");
const body = document.querySelector("body");
const footer = document.querySelector(".footer");
const darkMode = document.querySelector(".dark-mode-btn");
const brightIcon = document.querySelector("#bright-icon");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const githubLogo = document.querySelector("#github-mark");

let isDarkMode = false;

darkMode.addEventListener("click", () => {
  header.classList.toggle("dark-mode");
  body.classList.toggle("dark-mode");
  footer.classList.toggle("dark-mode-footer");
  darkMode.classList.toggle("dark-mode");

  if (isDarkMode) {
    brightIcon.src = "./images/bright-mode.png";
    firstName.style.fill = "black";
    lastName.style.fill = "black";
    githubLogo.style.fill = "#24292F";
    isDarkMode = false;
  } else {
    brightIcon.src = "./images/night-mode.png";
    firstName.style.fill = "white";
    lastName.style.fill = "white";
    githubLogo.style.fill = "white";
    isDarkMode = true;
  }
});
