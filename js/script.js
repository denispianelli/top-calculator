const display = document.querySelector("#display");
display.textContent = "0";
let displayValue = "";
let operands = [];
let operator = null;
let result = null;
let decimalAdded = false;
let prevInput = null;
let lastOperator = null;

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
  lastInputType = null;
  lastOperator = null;
  document.querySelector(".clear-text").textContent = "AC";
}

function calculate() {
  if (operands.length < 2 || !operator) {
    return;
  }
  result = operate(operator, ...operands);
  operands = [result];
  const roundedResult = roundResult(result);
  display.textContent = roundedResult;

  adjustFontSize(roundedResult);
}

function roundResult(result) {
  if (result == "Cannot divide by zero") {
    return result;
  }
  const roundedResult = Number(result).toFixed(15);
  if (/\.?0+$/.test(roundedResult)) {
    return Number(roundedResult).toString();
  } else if (/\.?9+$/.test(roundedResult)) {
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

  display.style.fontSize = Math.min(fontSize, maxFontSize) + "px";
}

function resetFontSize() {
  display.style.fontSize = 50 + "px";
}

// Buttons support
// Event listener for decimal button
const decimalBtn = document.querySelector(".decimal");
decimalBtn.addEventListener("click", () => {
  if (prevInput === null || prevInput === "operator") {
    resetDisplay();
    populateDisplay("0.");
  } else if (prevInput === "equal") {
    operands = [displayValue];
    resetDisplay();
    populateDisplay("0.");
  } else {
    populateDisplay(decimalBtn.textContent);
  }

  displayValue = display.textContent;
  prevInput = "decimal";
  decimalAdded = true;
});

// Event listeners for number buttons
const numberBtn = document.querySelectorAll(".number");
numberBtn.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".clear-text").textContent = "C";

    if (display.textContent == "Invalid input") {
      resetFontSize();
    }

    if (prevInput === "equal") {
      resetFontSize();
      resetDisplay();
      operands = [];
    } else if (prevInput === "operator") {
      resetDisplay();
      resetFontSize();
    } else if (prevInput == "plusMinus") {
      resetDisplay();
      resetFontSize();
    } else if (prevInput == "plusMinus") {
      resetDisplay();
      resetFontSize();
    }

    if (decimalAdded == true && !displayValue.toString().includes(".")) {
      displayValue = display.textContent;
    }

    populateDisplay(button.value);
    displayValue = Number(display.textContent);
    prevInput = "number";

    if (display.textContent > 7) {
      adjustFontSize(displayValue);
    }
  });
});

// Event listeners for operators button
const operatorBtn = document.querySelectorAll(".operator");

operatorBtn.forEach((operator) => {
  operator.addEventListener("click", (e) => {
    operatorBtn.forEach((op) => {
      if (op !== e.target) {
        op.classList.remove("active");
      }
    });
    e.target.classList.add("active");
  });
});

operatorBtn.forEach((button) => {
  button.addEventListener("click", () => {
    blinkDisplay();

    if (prevInput === "operator" && button.value === operator) {
      return;
    } else if (prevInput === "number") {
      prevInput = "operator";
      operands.push(Number(displayValue));
    } else if (prevInput === "equal" && operands == result) {
      operator = button.value;
      prevInput = "operator";
      resetDisplay();
    } else if (prevInput === "equal" && operands !== result) {
      operands.push(Number(displayValue));
      prevInput = "operator";
      resetDisplay();
    } else if (prevInput === "decimal") {
      prevInput = "operator";
      operands.push(Number(displayValue));
    } else if (prevInput == "plusMinus" && lastInputType == "number") {
      prevInput = "operator";
      operands.push(Number(displayValue));
    } else if (prevInput == "plusMinus" && lastInputType == "operators") {
      operator = button.value;
      prevInput = "operator";
      resetDisplay();
    } else if (prevInput == "percentageDivisor" && lastInputType == "number") {
      prevInput = "operator";
      operands.push(Number(displayValue));
    } else if (
      prevInput == "percentageDivisor" &&
      lastInputType == "operators"
    ) {
      operator = button.value;
      prevInput = "operator";
      resetDisplay();
    }

    if (button.value == "+") {
      lastOperator = "add";
    } else if (button.value == "-") {
      lastOperator = "subtract";
    } else if (button.value == "*") {
      lastOperator = "multiply";
    } else if (button.value == "/") {
      lastOperator = "divide";
    }

    if (operands.length >= 2) {
      calculate();
    }

    operator = button.value;
    decimalAdded = false;
    prevInput = "operator";
  });
});

// Event listener for equal button
const equalBtn = document.querySelector(".equals");
equalBtn.addEventListener("click", () => {
  blinkDisplay();
  operatorBtn.forEach((operator) => {
    operator.classList.remove("active");
  });
  if (prevInput === "operator") {
    displayValue = Number(display.textContent);
    operands.push(Number(displayValue));
    calculate();
  } else if (prevInput === "decimal") {
    operands.push(Number(displayValue));
    calculate();
  } else if (operands.length > 0) {
    operands.push(Number(displayValue));
    calculate();
  } else {
    return;
  }

  prevInput = "equal";
  decimalAdded = false;
});

// Event listener for clear button
const clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
  clearAll();
  blinkDisplay();
  operatorBtn.forEach((operator) => {
    operator.classList.remove("active");
  });
});

// Event listener and function for plus minus button
const plusMinus = document.querySelector(".plus-minus");
plusMinus.addEventListener("click", () => {
  blinkDisplay();
  negateNumber();
});

let lastInputType;

function negateNumber() {
  if (prevInput == "number" || prevInput == null) {
    displayValue *= -1;
    display.textContent = displayValue;
    lastInputType = "number";
  } else if (prevInput == "operator" || prevInput == "equal") {
    operands = [operands * -1];
    display.textContent = operands;
    lastInputType = "operators";
  } else if (prevInput == "percentageDivisor" && lastInputType == "result") {
    displayValue *= -1;
    display.textContent = displayValue;
    lastInputType = "percentage";
  } else if (
    prevInput == "percentageDivisor" &&
    lastInputType != "result" &&
    lastInputType != "number"
  ) {
    operands = [operands * -1];
    display.textContent = operands;
    lastInputType = "operators";
  } else if (prevInput == "percentageDivisor" && lastInputType == "number") {
    displayValue *= -1;
    display.textContent = displayValue;
    lastInputType = "percentage";
  }

  if (prevInput == "plusMinus" && lastInputType == "number") {
    displayValue *= -1;
    display.textContent = displayValue;
  } else if (prevInput == "plusMinus" && lastInputType == "operators") {
    operands = [operands * -1];
    display.textContent = operands;
  } else if (prevInput == "plusMinus" && lastInputType == "percentage") {
    displayValue *= -1;
    display.textContent = displayValue;
  }

  prevInput = "plusMinus";
}

// Event listener and function for percentage button
const percentageBtn = document.querySelector(".percentage");
percentageBtn.addEventListener("click", () => {
  blinkDisplay();
  percentageDivisor();
});

let percentageCase;

function percentageDivisor() {
  if (operands.length == 0 && prevInput != "percentageDivisor") {
    displayValue /= 100;
    display.textContent = displayValue;
    percentageCase = "displayValue";
  } else if (
    prevInput == "number" &&
    (lastOperator == "add" || lastOperator == "subtract") &&
    operands.length != 0
  ) {
    let result = operands * (displayValue / 100);
    displayValue = result;
    display.textContent = result;
    percentageCase = "result";
  } else if (prevInput == "equal") {
    operands = [operands / 100];
    display.textContent = operands;
    percentageCase = "operands";
  } else if (
    (lastOperator == "multiply" || lastOperator == "divide") &&
    operands.length != 0 &&
    prevInput != "percentageDivisor" && prevInput != "plusMinus"
  ) {
    displayValue /= 100;
    display.textContent = displayValue;
    percentageCase = "displayValue";
  } else if (prevInput == "operator") {
    operands = [operands / 100];
    display.textContent = operands;
    percentageCase = "operands";
  } else if (prevInput == "plusMinus" && lastInputType == "operators") {
    operands = [operands / 100];
    display.textContent = operands;
    percentageCase = "operands";
  } else if (prevInput == "plusMinus") {
    displayValue /= 100;
    display.textContent = displayValue;
    percentageCase = "displayValue";
  }

  if (prevInput == "percentageDivisor" && percentageCase == "displayValue") {
    displayValue /= 100;
    display.textContent = displayValue;
  } else if (prevInput == "percentageDivisor" && percentageCase == "operands") {
    operands = [(operands /= 100)];
    display.textContent = operands;
  }
  if (prevInput == "percentageDivisor" && percentageCase == "result") {
    result = operands * (displayValue / 100);
    displayValue = result;
    display.textContent = result;
  }

  adjustFontSize(displayValue);
  prevInput = "percentageDivisor";
}

// Dark mode support

const header = document.querySelector(".header-container");
const body = document.querySelector("body");
const footer = document.querySelector(".footer");
const darkMode = document.querySelector(".dark-mode-btn");
const brightIcon = document.querySelector("#bright-icon");
const brightLogo = document.querySelector("#bright-logo");

let isDarkMode = false;

darkMode.addEventListener("click", () => {
  header.classList.toggle("dark-mode");
  body.classList.toggle("dark-mode");
  footer.classList.toggle("dark-mode-footer");
  darkMode.classList.toggle("dark-mode");

  if (isDarkMode) {
    brightIcon.src = "./images/bright-mode.png";
    brightLogo.src = "./images/denis-logo-black.png";
    isDarkMode = false;
  } else {
    brightIcon.src = "./images/night-mode.png";
    brightLogo.src = "./images/denis-logo-white.png";
    isDarkMode = true;
  }
});

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
  if (lastInputType == "operators" && prevInput != "number") {
    return;
  } else {
    displayValue = displayValue.toString().slice(0, -1);
    display.textContent = displayValue;
  }
  if (displayValue.length == 0) {
    display.textContent = "0";
  }
}
