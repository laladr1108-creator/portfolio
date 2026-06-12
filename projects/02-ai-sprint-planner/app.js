const state = {
  filter: "all",
  backlog: [
    { id: 1, title: "Переработать пустое состояние онбординга", detail: "Повысить активацию команд без импортированных данных.", priority: "high", points: 5 },
    { id: 2, title: "Добавить пороги биллинговых уведомлений", detail: "Предупреждать админов до блокировки рабочих пространств.", priority: "medium", points: 8 },
    { id: 3, title: "Ускорить индексацию поиска", detail: "Сократить задержку результатов в больших аккаунтах.", priority: "high", points: 13 },
    { id: 4, title: "Обновить приглашения в workspace", detail: "Уточнить статусы мест и повторную отправку приглашений.", priority: "low", points: 3 },
    { id: 5, title: "Добавить события здоровья спринта", detail: "Отслеживать изменения плана, добавления и переносы.", priority: "medium", points: 5 }
  ],
  sprint: [
    { id: 6, title: "Запустить командное меню", detail: "Навигация с клавиатуры по ключевым сценариям.", priority: "high", points: 8 },
    { id: 7, title: "QA-чеклист релиза", detail: "Видимые проверки перед релизом для владельцев поставки.", priority: "medium", points: 5 }
  ]
};

const backlogList = document.querySelector("#backlogList");
const sprintList = document.querySelector("#sprintList");
const riskList = document.querySelector("#riskList");
const backlogCount = document.querySelector("#backlogCount");
const usedPoints = document.querySelector("#usedPoints");
const capacityMeter = document.querySelector("#capacityMeter");
const confidenceValue = document.querySelector("#confidenceValue");
const confidenceMeter = document.querySelector("#confidenceMeter");
const briefOutput = document.querySelector("#briefOutput");
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1700);
}

const priorityLabels = {
  high: "высокий",
  medium: "средний",
  low: "низкий"
};

function taskCard(task, source) {
  const action = source === "backlog" ? "В план" : "Убрать";
  return `
    <article class="task-card">
      <header>
        <span class="pill ${task.priority}">${priorityLabels[task.priority]}</span>
        <strong>${task.points} пт</strong>
      </header>
      <div>
        <h4>${task.title}</h4>
        <p>${task.detail}</p>
      </div>
      <footer>
        <span>${source === "backlog" ? "Бэклог" : "Спринт"}</span>
        <button class="task-action" type="button" data-action="${source === "backlog" ? "add" : "remove"}" data-id="${task.id}">${action}</button>
      </footer>
    </article>
  `;
}

function render() {
  const backlog = state.filter === "all"
    ? state.backlog
    : state.backlog.filter((task) => task.priority === state.filter);
  backlogCount.textContent = `${backlog.length} задач`;
  backlogList.innerHTML = backlog.length
    ? backlog.map((task) => taskCard(task, "backlog")).join("")
    : `<div class="task-card"><p>Для этого приоритета задач нет.</p></div>`;
  sprintList.innerHTML = state.sprint.length
    ? state.sprint.map((task) => taskCard(task, "sprint")).join("")
    : `<div class="task-card"><p>Спринт пуст. Добавьте сфокусированные задачи из бэклога.</p></div>`;

  const points = state.sprint.reduce((sum, task) => sum + task.points, 0);
  const capacity = Math.min(points / 34, 1);
  const confidence = Math.max(42, Math.round(96 - Math.abs(24 - points) * 1.8 - state.sprint.filter((task) => task.priority === "high").length * 2));
  usedPoints.textContent = points;
  capacityMeter.style.width = `${capacity * 100}%`;
  capacityMeter.style.background = points > 34 ? "linear-gradient(90deg, #b64c62, #c89a33)" : "";
  confidenceValue.textContent = `${confidence}%`;
  confidenceMeter.style.width = `${confidence}%`;
  renderRisks(points);
}

function renderRisks(points) {
  const highCount = state.sprint.filter((task) => task.priority === "high").length;
  const risks = [];
  if (points > 34) risks.push("Загрузка превышена. Уберите или разделите задачу до старта.");
  if (highCount > 2) risks.push("Слишком много задач высокого приоритета. Назначьте владельцев заранее.");
  if (points < 18) risks.push("Спринт выглядит легким. Добавьте среднюю задачу, если поддержка стабильна.");
  if (!risks.length) risks.push("План сбалансирован. Держите изменения скоупа видимыми на середине спринта.");
  riskList.innerHTML = risks.map((risk) => `<li>${risk}</li>`).join("");
}

function moveTask(id, from, to) {
  const source = state[from];
  const index = source.findIndex((task) => task.id === id);
  if (index < 0) return;
  const [task] = source.splice(index, 1);
  state[to].push(task);
  render();
}

function generateBrief() {
  const points = state.sprint.reduce((sum, task) => sum + task.points, 0);
  const titles = state.sprint.map((task) => task.title).join(", ");
  const high = state.sprint.filter((task) => task.priority === "high").length;
  briefOutput.innerHTML = `
    <p><strong>Бриф спринта 24:</strong> команда берет ${state.sprint.length} задач на ${points} пунктов. Главные результаты: ${titles || "план пока пуст"}.</p>
    <p>Фокус: ${high ? `${high} инициатив высокого приоритета требуют четких владельцев и ранней проверки.` : "Сохраняем стабильную поставку и резерв под discovery."}</p>
  `;
  showToast("Бриф создан");
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    render();
  });
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const id = Number(actionButton.dataset.id);
  if (actionButton.dataset.action === "add") {
    moveTask(id, "backlog", "sprint");
    showToast("Задача добавлена в спринт");
  } else {
    moveTask(id, "sprint", "backlog");
    showToast("Задача возвращена в бэклог");
  }
});

document.querySelector("#taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#taskTitle").value.trim();
  const priority = document.querySelector("#taskPriority").value;
  const points = Number(document.querySelector("#taskPoints").value);
  if (!title) return;
  state.backlog.unshift({
    id: Date.now(),
    title,
    detail: "Новая задача готова к уточнению.",
    priority,
    points
  });
  event.currentTarget.reset();
  document.querySelector("#taskPoints").value = 5;
  state.filter = "all";
  document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
  render();
  showToast("Задача создана");
});

document.querySelector("#briefButton").addEventListener("click", generateBrief);
document.querySelector("#copyBrief").addEventListener("click", async () => {
  const text = briefOutput.innerText.trim();
  if (text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Бриф скопирован");
    } catch {
      showToast("Копирование недоступно в этом браузере");
    }
  }
});

document.querySelector("#themeButton").addEventListener("click", () => {
  document.body.classList.toggle("focus-mode");
  showToast(document.body.classList.contains("focus-mode") ? "Режим фокуса включен" : "Режим фокуса выключен");
});

render();
