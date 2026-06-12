const projectData = {
  finance: {
    title: "Финансовый центр",
    text: "Демонстрационный SaaS-дашборд для контроля KPI, финансовых сценариев и списка операций. Проект показывает работу с метриками, табличными данными и управляемыми состояниями интерфейса.",
    href: "./projects/01-finance-command/index.html",
    tags: ["дашборд", "финансы", "интерактивный график"]
  },
  planner: {
    title: "AI-планировщик спринта",
    text: "Интерфейс для планирования спринта: backlog, capacity, оценка рисков и краткий AI-бриф. Подходит для демонстрации продуктового workflow и быстрых действий в рабочей панели.",
    href: "./projects/02-ai-sprint-planner/index.html",
    tags: ["планирование", "продукт", "ai-процесс"]
  },
  commerce: {
    title: "Atelier Commerce",
    text: "E-commerce каталог с фильтрами, сортировкой, карточками товаров и корзиной. Проект показывает полный путь от выбора товара до оформления заказа.",
    href: "./projects/03-atelier-commerce/index.html",
    tags: ["магазин", "фильтры", "выезжающая корзина"]
  },
  travel: {
    title: "Nova Travel",
    text: "Планировщик поездки с направлениями, картой, бюджетом и дневным маршрутом. Проект сочетает визуальную подачу и практичный сценарий планирования.",
    href: "./projects/04-nova-travel/index.html",
    tags: ["поездки", "карта", "маршрут"]
  },
  chroma: {
    title: "Chroma Studio",
    text: "Инструмент для работы с цветовыми палитрами: генерация, сохранение, копирование HEX и проверка контраста. Проект демонстрирует интерфейс небольшого профессионального инструмента.",
    href: "./projects/05-chroma-studio/index.html",
    tags: ["креативный инструмент", "палитра", "контраст"]
  }
};

const visitorCount = document.querySelector("#visitorCount");
const toast = document.querySelector("#toast");
const projectModal = document.querySelector("#projectModal");
const contactModal = document.querySelector("#contactModal");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const modalMeta = document.querySelector("#modalMeta");
const modalLink = document.querySelector("#modalLink");
const themeToggle = document.querySelector("#themeToggle");
const themeLabel = document.querySelector("[data-theme-label]");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function updateVisitors() {
  const key = "swatik11-portfolio-visits";
  const next = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(next));
  visitorCount.textContent = next;
}

function openModal(modal) {
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const focusTarget = modal.querySelector("button, a");
  window.setTimeout(() => focusTarget?.focus(), 120);
}

function closeModal(modal) {
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openProject(projectKey) {
  const project = projectData[projectKey];
  if (!project) return;
  modalTitle.textContent = project.title;
  modalText.textContent = project.text;
  modalMeta.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");
  modalLink.href = project.href;
  openModal(projectModal);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(`${value} скопирован`);
  } catch {
    showToast("Копирование недоступно");
  }
}

document.querySelectorAll(".work-card").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    openProject(card.dataset.project);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProject(card.dataset.project);
    }
  });
});

document.querySelectorAll("[data-close]").forEach((item) => {
  item.addEventListener("click", () => {
    closeModal(projectModal);
    closeModal(contactModal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(projectModal);
    closeModal(contactModal);
  }
});

document.querySelector("#openContact").addEventListener("click", () => openModal(contactModal));
document.querySelector("#openAbout").addEventListener("click", () => {
  showToast("Фокус: frontend, UI-системы, понятные сценарии");
});

function syncThemeLabel() {
  const isLight = document.body.classList.contains("light-mode");
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Включить черную тему" : "Включить белую тему");
  themeToggle.title = isLight ? "Включить черную тему" : "Включить белую тему";
  if (themeLabel) themeLabel.textContent = isLight ? "white" : "black";
}

const savedTheme = localStorage.getItem("swatik11-theme");
if (savedTheme === "white") {
  document.body.classList.add("light-mode");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  localStorage.setItem("swatik11-theme", isLight ? "white" : "black");
  syncThemeLabel();
  showToast(isLight ? "Белая тема включена" : "Черная тема включена");
});

document.querySelector("#copyNick").addEventListener("click", () => copyText("@Swatik11"));
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyText(button.dataset.copy));
});

document.querySelectorAll(".skill-list button").forEach((button) => {
  button.addEventListener("click", () => {
    const detail = button.nextElementSibling;
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    detail.classList.toggle("open", !isOpen);
  });
});

document.querySelectorAll(".magnetic").forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.1;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.1;
    item.style.transform = `translate(${x}px, ${y}px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

updateVisitors();
syncThemeLabel();
