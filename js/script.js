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
  const resultString = roundedResult.toString();
  const maxWidth = 242;
  let maxFontSize;

  maxFontSize = Math.floor(maxWidth / (resultString.length * 0.6));

  display.style.fontSize = Math.min(fontSize, maxFontSize) + "px";
}

function roundResult(result) {
  if (result == "Cannot divide by zero") {
    return result;
  }
  const roundedResult = Number(result).toFixed(15);
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

const numberBtn = document.querySelectorAll(".number");
numberBtn.forEach((button) => {
  button.addEventListener("click", () => {
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
      adjustFontSize();
    }
  });
});
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

function blinkDisplay() {
  display.classList.add("blink");
  setTimeout(() => {
    display.classList.remove("blink");
  }, 100);
}

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

  lastInputType = "operators"
  prevInput = "equal";
  decimalAdded = false;
});

const clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
  clearAll();
  blinkDisplay();
  operatorBtn.forEach((operator) => {
    operator.classList.remove("active");
  });
});
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
  } else if (
    prevInput == "operator" ||
    prevInput == "equal" ||
    prevInput == "percentageDivisor"
  ) {
    operands = [operands * -1];
    display.textContent = operands;
    lastInputType = "operators";
  }

  if (prevInput == "plusMinus" && lastInputType == "number") {
    displayValue *= -1;
    display.textContent = displayValue;
  } else if (prevInput == "plusMinus" && lastInputType == "operators") {
    operands = [operands * -1];
    display.textContent = operands;
  }

  prevInput = "plusMinus";
}

const percentageBtn = document.querySelector(".percentage");
percentageBtn.addEventListener("click", () => {
  blinkDisplay();
  percentageDivisor();
});

function percentageDivisor() {
  if (prevInput == "number" || prevInput == null) {
    displayValue /= 100;
    display.textContent = displayValue;
    lastInputType = "number";
  } else if (prevInput == "operator" || prevInput == "equal") {
    operands = [(operands /= 100)];
    display.textContent = operands;
    lastInputType = "operators";
  }

  if (prevInput == "plusMinus" && lastInputType == "number") {
    displayValue /= 100;
    display.textContent = displayValue;
  } else if (prevInput == "plusMinus" && lastInputType == "operators") {
    operands = [(operands /= 100)];
    display.textContent = operands;
  }

  prevInput = "percentageDivisor";
}

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

//Keyboard support

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^\d$/.test(key)) {
    // handle digits
    numberBtn.forEach((button) => {
      if (button.textContent === key) {
        button.click();
        button.classList.add("highlight");
        setTimeout(() => {
          button.classList.remove("highlight");
        }, 100);
      }
    });
  } else if (key === "") {
    return;
  } else if (key === "Backspace") {
    handleBackSpace();
  } else if (key === "Enter") {
    // handle equals
    event.preventDefault();
    equalBtn.click();
  } else if (key === "." || key === ",") {
    // handle decimal point
    decimalBtn.click();
  } else if (key === "Escape") {
    clearBtn.click();
  } else {
    // handle operators
    operatorBtn.forEach((button) => {
      if (button.textContent === key) {
        button.click();
      } else if (key === "/" && button.value === "/") {
        event.preventDefault();
        button.click();
      } else if (key === "*" && button.value === "*") {
        event.preventDefault();
        button.click();
      }
    });
  }
});
