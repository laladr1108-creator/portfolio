const projectData = {
  finance: {
    title: "Финансовый центр",
    text: "SaaS-дашборд для руководителя: KPI, график, прогноз, сценарии и таблица операций. Хорошо показывает работу с данными и интерфейсом принятия решений.",
    href: "./projects/01-finance-command/index.html",
    tags: ["дашборд", "финансы", "интерактивный график"]
  },
  planner: {
    title: "AI-планировщик спринта",
    text: "Инструмент для продуктовой команды: backlog, capacity, риски, создание задач и AI-бриф. Внутри есть живые состояния и быстрые действия.",
    href: "./projects/02-ai-sprint-planner/index.html",
    tags: ["планирование", "продукт", "ai-процесс"]
  },
  commerce: {
    title: "Atelier Commerce",
    text: "Премиальная витрина магазина с фильтрами, сортировкой, карточками товаров и выезжающей корзиной. Проект показывает e-commerce flow.",
    href: "./projects/03-atelier-commerce/index.html",
    tags: ["магазин", "фильтры", "выезжающая корзина"]
  },
  travel: {
    title: "Nova Travel",
    text: "Планировщик поездок с направлениями, картой, бюджетом и дневным маршрутом. Хороший пример эмоционального, но рабочего интерфейса.",
    href: "./projects/04-nova-travel/index.html",
    tags: ["поездки", "карта", "маршрут"]
  },
  chroma: {
    title: "Chroma Studio",
    text: "Креативный редактор цветовых палитр: генерация, сохранение, копирование HEX и проверка контраста. Подходит для демонстрации tool UI.",
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
  showToast("Андрей / Swatik11: черный UI, frontend, быстрые сценарии");
});

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("alt-accent");
  showToast(document.body.classList.contains("alt-accent") ? "Холодный акцент включен" : "Лаймовый акцент включен");
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
