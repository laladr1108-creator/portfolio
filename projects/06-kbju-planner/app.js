const presets = [
  { name: "Овсянка + банан", calories: 410, protein: 13, fat: 8, carbs: 72 },
  { name: "Курица + рис", calories: 560, protein: 43, fat: 12, carbs: 68 },
  { name: "Творог 5%", calories: 240, protein: 28, fat: 10, carbs: 8 },
  { name: "Лосось + салат", calories: 480, protein: 34, fat: 29, carbs: 16 }
];

const state = {
  target: { calories: 2200, protein: 144, fat: 72, carbs: 248 },
  meals: JSON.parse(localStorage.getItem("kbju-meals") || "[]")
};

const form = document.querySelector("#calculatorForm");
const mealForm = document.querySelector("#mealForm");
const mealList = document.querySelector("#mealList");
const presetRow = document.querySelector("#presetRow");
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function saveMeals() {
  localStorage.setItem("kbju-meals", JSON.stringify(state.meals));
}

function calculateTarget({ silent = false } = {}) {
  const gender = document.querySelector("#gender").value;
  const age = Number(document.querySelector("#age").value);
  const height = Number(document.querySelector("#height").value);
  const weight = Number(document.querySelector("#weight").value);
  const activity = Number(document.querySelector("#activity").value);
  const goal = Number(document.querySelector("#goal").value);
  const base = 10 * weight + 6.25 * height - 5 * age + (gender === "male" ? 5 : -161);
  const calories = Math.round(base * activity + goal);
  const protein = Math.round(weight * 2);
  const fat = Math.round(weight * 0.9);
  const carbs = Math.max(80, Math.round((calories - protein * 4 - fat * 9) / 4));
  state.target = { calories, protein, fat, carbs };
  render();
  if (!silent) showToast("Расчет обновлен");
}

function totals() {
  return state.meals.reduce((sum, meal) => ({
    calories: sum.calories + meal.calories,
    protein: sum.protein + meal.protein,
    fat: sum.fat + meal.fat,
    carbs: sum.carbs + meal.carbs
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
}

function addMeal(meal) {
  state.meals.push({ ...meal, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) });
  saveMeals();
  render();
  showToast(`${meal.name} добавлен`);
}

function removeMeal(id) {
  state.meals = state.meals.filter((meal) => meal.id !== id);
  saveMeals();
  render();
}

function renderTargets() {
  document.querySelector("#targetCalories").textContent = `${state.target.calories} ккал`;
  document.querySelector("#heroCalories").textContent = `${state.target.calories} ккал`;
  document.querySelector("#proteinTarget").textContent = `${state.target.protein} г`;
  document.querySelector("#fatTarget").textContent = `${state.target.fat} г`;
  document.querySelector("#carbTarget").textContent = `${state.target.carbs} г`;
}

function renderPresets() {
  presetRow.innerHTML = presets.map((preset) => (
    `<button type="button" data-preset="${preset.name}">${preset.name}</button>`
  )).join("");
}

function renderMeals() {
  if (!state.meals.length) {
    mealList.innerHTML = `<div class="meal-item"><strong>Рацион пока пустой</strong><span>Добавь продукт или выбери пресет</span></div>`;
    return;
  }

  mealList.innerHTML = state.meals.map((meal) => `
    <div class="meal-item">
      <strong>${meal.name}</strong>
      <span>${meal.calories} ккал</span>
      <span>Б ${meal.protein}г</span>
      <span>Ж ${meal.fat}г</span>
      <span>У ${meal.carbs}г</span>
      <button type="button" data-remove="${meal.id}">Удалить</button>
    </div>
  `).join("");
}

function renderProgress() {
  const total = totals();
  const rows = [
    ["Калории", total.calories, state.target.calories, "ккал"],
    ["Белки", total.protein, state.target.protein, "г"],
    ["Жиры", total.fat, state.target.fat, "г"],
    ["Углеводы", total.carbs, state.target.carbs, "г"]
  ];

  document.querySelector("#progressBars").innerHTML = rows.map(([label, value, target, unit]) => {
    const percent = Math.min(120, Math.round((value / target) * 100 || 0));
    return `
      <div class="bar-row">
        <div class="bar-label"><span>${label}</span><strong>${value} / ${target} ${unit}</strong></div>
        <div class="bar-track"><div class="bar-fill" style="--value: ${Math.min(percent, 100)}%"></div></div>
      </div>
    `;
  }).join("");
}

function render() {
  renderTargets();
  renderMeals();
  renderProgress();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateTarget();
});

mealForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const meal = {
    name: document.querySelector("#mealName").value.trim(),
    calories: Number(document.querySelector("#mealCalories").value),
    protein: Number(document.querySelector("#mealProtein").value || 0),
    fat: Number(document.querySelector("#mealFat").value || 0),
    carbs: Number(document.querySelector("#mealCarbs").value || 0)
  };
  addMeal(meal);
  mealForm.reset();
});

presetRow.addEventListener("click", (event) => {
  const button = event.target.closest("[data-preset]");
  if (!button) return;
  const preset = presets.find((item) => item.name === button.dataset.preset);
  if (preset) addMeal(preset);
});

mealList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (button) removeMeal(button.dataset.remove);
});

document.querySelector("#resetDay").addEventListener("click", () => {
  state.meals = [];
  saveMeals();
  render();
  showToast("День очищен");
});

renderPresets();
calculateTarget({ silent: true });
