const display = document.getElementById("display");
const keys = document.querySelectorAll(".keys button");
const sci = document.getElementById("scientific");
const modeBtn = document.getElementById("modeBtn");
const themeBtn = document.getElementById("themeBtn");
const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");

let history = JSON.parse(localStorage.getItem("history")) || [];
renderHistory();

keys.forEach(btn => {
  btn.onclick = () => handle(btn.innerText);
});

document.querySelectorAll("[data-fn]").forEach(btn => {
  btn.onclick = () => applyFn(btn.dataset.fn);
});

function handle(val) {
  if (val === "C") display.value = "";
  else if (val === "⌫") display.value = display.value.slice(0, -1);
  else if (val === "=") calculate();
  else display.value += val;
}

function calculate() {
  try {
    const result = Function(`"use strict";return(${display.value})`)();
    save(`${display.value} = ${result}`);
    display.value = result;
  } catch {
    display.value = "Error";
  }
}

function applyFn(fn) {
  const v = parseFloat(display.value);
  if (isNaN(v)) return;
  const res = Math[fn](v);
  save(`${fn}(${v}) = ${res}`);
  display.value = res;
}

function save(entry) {
  history.unshift(entry);
  history = history.slice(0, 20);
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    historyList.appendChild(li);
  });
}

clearHistory.onclick = () => {
  history = [];
  localStorage.clear();
  renderHistory();
};

modeBtn.onclick = () => sci.classList.toggle("hidden");
themeBtn.onclick = () => document.body.classList.toggle("light");

/* ⌨ Keyboard support */
document.addEventListener("keydown", e => {
  if ("0123456789+-*/.%".includes(e.key)) display.value += e.key;
  if (e.key === "Enter") calculate();
  if (e.key === "Backspace") display.value = display.value.slice(0, -1);
});