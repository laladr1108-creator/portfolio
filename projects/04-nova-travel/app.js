const destinations = [
  {
    id: "paris",
    city: "Париж",
    route: "Культурный маршрут",
    days: 5,
    flight: "7ч 10м",
    season: "апр-июн",
    pace: "Сбалансированный",
    base: 4820,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1100&q=80",
    pins: [[22, 35], [46, 48], [68, 35], [78, 68]],
    stops: [
      ["Заезд в Сен-Жермен", "Бутик-отель, прогулка по Сене и бронь ужина."],
      ["Музейное утро", "Частный вход в Лувр, кафе и блок магазинов в Маре."],
      ["Дизайн-квартал", "Галереи, concept stores и вечерний rooftop-стол."]
    ]
  },
  {
    id: "tokyo",
    city: "Токио",
    route: "Дизайн и гастрономия",
    days: 7,
    flight: "11ч 35м",
    season: "окт-ноя",
    pace: "Активный",
    base: 6240,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1100&q=80",
    pins: [[18, 62], [42, 34], [60, 52], [76, 30], [82, 72]],
    stops: [
      ["Прилет в Сибую", "Отель, вечерние идзакая и прогулка по skyline."],
      ["День архитектуры", "Омотэсандо, музей Нэдзу и маршрут по дизайн-магазинам."],
      ["Гастро-лаборатория", "Завтрак на Цукидзи, tasting counter и тихий бар."]
    ]
  },
  {
    id: "iceland",
    city: "Исландия",
    route: "Природное кольцо",
    days: 6,
    flight: "6ч 45м",
    season: "июн-сен",
    pace: "Дорога",
    base: 5360,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=80",
    pins: [[20, 46], [42, 58], [58, 36], [74, 62]],
    stops: [
      ["База в Рейкьявике", "Ужин у гавани, spa-восстановление и брифинг по дороге."],
      ["Южное побережье", "Водопады, черный пляж и заезд в lodge."],
      ["День ледника", "Гидированный хайк, горячий источник и наблюдение неба."]
    ]
  }
];

let active = destinations[0];
let comfort = 2;
let stops = [...active.stops];

const destinationList = document.querySelector("#destinationList");
const heroImage = document.querySelector("#heroImage");
const heroCity = document.querySelector("#heroCity");
const heroMeta = document.querySelector("#heroMeta");
const mapTitle = document.querySelector("#mapTitle");
const mapCanvas = document.querySelector("#mapCanvas");
const flightStat = document.querySelector("#flightStat");
const seasonStat = document.querySelector("#seasonStat");
const paceStat = document.querySelector("#paceStat");
const comfortInput = document.querySelector("#comfortInput");
const comfortLabel = document.querySelector("#comfortLabel");
const budgetTotal = document.querySelector("#budgetTotal");
const budgetBreakdown = document.querySelector("#budgetBreakdown");
const timeline = document.querySelector("#timeline");
const toast = document.querySelector("#toast");

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1700);
}

function renderDestinations() {
  destinationList.innerHTML = destinations.map((item) => `
    <button class="destination-card ${item.id === active.id ? "active" : ""}" type="button" data-destination="${item.id}">
      <img src="${item.image}" alt="${item.city}" loading="lazy">
      <div>
        <header>
          <h3>${item.city}</h3>
          <span class="tag">${item.days} дней</span>
        </header>
        <p>${item.route}. Лучше всего для темпа: ${item.pace.toLowerCase()}.</p>
      </div>
    </button>
  `).join("");
}

function renderMap() {
  const pointString = active.pins.map(([x, y]) => `${x * 6},${y * 3.4}`).join(" ");
  mapCanvas.innerHTML = `
    <svg class="route-line" viewBox="0 0 600 340" preserveAspectRatio="none" aria-hidden="true">
      <polyline points="${pointString}" fill="none" stroke="#14766d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 10" />
    </svg>
    ${active.pins.map(([x, y], index) => `<span class="pin" style="left:${x}%; top:${y}%;">${index + 1}</span>`).join("")}
  `;
}

function renderBudget() {
  const labels = ["Экономно", "Премиум", "Signature"];
  const multiplier = [0.76, 1, 1.34][comfort - 1];
  const total = Math.round(active.base * multiplier);
  comfortLabel.textContent = labels[comfort - 1];
  budgetTotal.textContent = money(total);
  const breakdown = [
    ["Проживание", total * 0.38],
    ["Перелеты", total * 0.3],
    ["Еда", total * 0.18],
    ["Впечатления", total * 0.14]
  ];
  budgetBreakdown.innerHTML = breakdown.map(([label, value]) => `<li><span>${label}</span><strong>${money(value)}</strong></li>`).join("");
}

function renderTimeline() {
  timeline.innerHTML = stops.map(([title, detail], index) => `
    <article class="timeline-item">
      <span class="day">${index + 1}</span>
      <div>
        <h3>${title}</h3>
        <p>${detail}</p>
      </div>
      <button type="button" data-remove="${index}">Удалить</button>
    </article>
  `).join("");
}

function renderActive() {
  heroImage.style.opacity = "0.2";
  window.setTimeout(() => {
    heroImage.src = active.image;
    heroImage.alt = active.city;
    heroImage.style.opacity = "1";
  }, 140);
  heroCity.textContent = active.city;
  heroMeta.textContent = `${active.days} дней, ${active.route.toLowerCase()}`;
  mapTitle.textContent = `Маршрут: ${active.city}`;
  flightStat.textContent = active.flight;
  seasonStat.textContent = active.season;
  paceStat.textContent = active.pace;
  renderDestinations();
  renderMap();
  renderBudget();
  renderTimeline();
}

destinationList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-destination]");
  if (!button) return;
  active = destinations.find((item) => item.id === button.dataset.destination);
  stops = [...active.stops];
  renderActive();
});

comfortInput.addEventListener("input", () => {
  comfort = Number(comfortInput.value);
  renderBudget();
});

document.querySelector("#addStop").addEventListener("click", () => {
  stops.push(["Локальная прогулка", "Кураторский маршрут по району, гибкий ужин и время на восстановление."]);
  renderTimeline();
  showToast("Точка добавлена");
});

timeline.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  stops.splice(Number(button.dataset.remove), 1);
  renderTimeline();
  showToast("Точка удалена");
});

document.querySelector("#saveTrip").addEventListener("click", () => {
  showToast(`Поездка: ${active.city} сохранена`);
});

renderActive();
