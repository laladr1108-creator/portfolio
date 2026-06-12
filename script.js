const projectData = {
  finance: {
    title: "Финансовый центр",
    text: "В этом проекте я показываю, как могу собрать рабочий дашборд: KPI-карточки, график, таблицу операций и сценарии. Это не реальная финансовая система, а аккуратная демонстрация интерфейсной логики.",
    href: "./projects/01-finance-command/index.html",
    tags: ["дашборд", "финансы", "интерактивный график"]
  },
  planner: {
    title: "AI-планировщик спринта",
    text: "Здесь я показываю интерфейс для планирования спринта: backlog, capacity, риски и краткий AI-бриф. Проект помогает показать, как я думаю о рабочих панелях и быстрых действиях.",
    href: "./projects/02-ai-sprint-planner/index.html",
    tags: ["планирование", "продукт", "ai-процесс"]
  },
  commerce: {
    title: "Atelier Commerce",
    text: "В этом проекте я собрал e-commerce сценарий: каталог, фильтры, сортировку, карточки товаров и корзину. Основной фокус — понятный путь пользователя от просмотра к заказу.",
    href: "./projects/03-atelier-commerce/index.html",
    tags: ["магазин", "фильтры", "выезжающая корзина"]
  },
  travel: {
    title: "Nova Travel",
    text: "Здесь я тренирую более визуальный интерфейс: направления, карта, бюджет и маршрут по дням. Проект показывает, что я могу работать не только с строгими панелями, но и с более эмоциональной подачей.",
    href: "./projects/04-nova-travel/index.html",
    tags: ["поездки", "карта", "маршрут"]
  },
  chroma: {
    title: "Chroma Studio",
    text: "В этом проекте я показываю небольшой tool UI: генерацию палитр, сохранение наборов, копирование HEX и проверку контраста. Это пример компактного инструмента с понятными состояниями.",
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
  if (!visitorCount) return;
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

async function copyText(value, fallbackUrl = "") {
  const fallbackCopy = () => {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  };

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else if (!fallbackCopy()) {
      throw new Error("Fallback copy failed");
    }
    showToast(`${value} скопирован`);
  } catch {
    if (fallbackUrl) {
      showToast("Копирование заблокировано. Открываю Telegram");
      window.setTimeout(() => {
        const popup = window.open(fallbackUrl, "_blank", "noopener,noreferrer");
        if (!popup) window.location.href = fallbackUrl;
      }, 250);
    } else {
      showToast("Не получилось скопировать. Telegram: @Swatik11");
    }
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

document.querySelector("#openContact")?.addEventListener("click", () => openModal(contactModal));
document.querySelector("#openAbout").addEventListener("click", () => {
  showToast("Фокус: аккуратный frontend, UI-логика, адаптив и деплой");
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

document.querySelector("#copyNick").addEventListener("click", () => copyText("@Swatik11", "https://t.me/Swatik11"));
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyText(button.dataset.copy, button.dataset.telegram));
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
