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

