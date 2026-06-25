const apps = {
  kbju: {
    targets: { calories: 2310, protein: 145, fat: 74, carbs: 266 },
    meals: [
      { name: "Овсянка, банан, йогурт", calories: 430, protein: 18, fat: 9, carbs: 71 },
      { name: "Курица, рис, овощи", calories: 620, protein: 48, fat: 14, carbs: 78 }
    ],
    presets: [
      { name: "Творог 5%", calories: 240, protein: 28, fat: 10, carbs: 8 },
      { name: "Лосось + салат", calories: 510, protein: 36, fat: 31, carbs: 16 },
      { name: "Протеин + яблоко", calories: 210, protein: 25, fat: 2, carbs: 22 }
    ]
  },
  fluxvpn: {
    active: true,
    server: "Нидерланды",
    plan: "Pro",
    servers: [
      { country: "Нидерланды", ping: 32, speed: 920 },
      { country: "Германия", ping: 41, speed: 870 },
      { country: "Финляндия", ping: 55, speed: 760 },
      { country: "Турция", ping: 66, speed: 690 }
    ]
  },
  exclusive: {
    partners: [
      { name: "Aurum Club", tier: "Черный", status: "активен", potential: 2850000, conversion: 78 },
      { name: "Prime Auto", tier: "Золотой", status: "проверка", potential: 1640000, conversion: 61 },
      { name: "Elite Realty", tier: "Черный", status: "теплый контакт", potential: 1210000, conversion: 52 },
      { name: "Status Travel", tier: "Серебро", status: "активен", potential: 880000, conversion: 49 }
    ]
  },
  tgorder: {
    cart: [],
    menu: [
      { name: "Лендинг под ключ", price: 15000 },
      { name: "Telegram-бот", price: 12000 },
      { name: "Дизайн карточки", price: 4500 }
    ],
    statuses: ["Новая заявка", "Уточнение", "В работе", "Готово"]
  },
  tgsupport: {
    activeTicket: 0,
    replies: 0,
    tickets: [
      { name: "Оплата не прошла", user: "@client_one", priority: "важно", status: "новая" },
      { name: "Нужен доступ к боту", user: "@market_lead", priority: "обычно", status: "в работе" },
      { name: "Вопрос по тарифу", user: "@flux_user", priority: "низко", status: "ответить" }
    ],
    templates: [
      "Здравствуйте. Проверяю вопрос и скоро вернусь с ответом.",
      "Можете прислать скрин оплаты или ID заявки?",
      "Готово, доступ обновлен. Проверьте, пожалуйста."
    ]
  }
};

const app = document.body.dataset.app;
const state = apps[app];
const root = document.querySelector("#appRoot");
const metrics = document.querySelector("#metrics");
const toast = document.querySelector("#toast");

function money(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function renderMetrics(items) {
  metrics.innerHTML = items.map((item) => `
    <article class="metric">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </article>
  `).join("");
}

function renderKbju() {
  const total = state.meals.reduce((sum, meal) => ({
    calories: sum.calories + meal.calories,
    protein: sum.protein + meal.protein,
    fat: sum.fat + meal.fat,
    carbs: sum.carbs + meal.carbs
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

  renderMetrics([
    { label: "цель", value: `${state.targets.calories} ккал` },
    { label: "съедено", value: `${total.calories} ккал` },
    { label: "белки", value: `${total.protein}/${state.targets.protein} г` },
    { label: "остаток", value: `${Math.max(0, state.targets.calories - total.calories)} ккал` }
  ]);

  const bars = [
    ["Калории", total.calories, state.targets.calories, "ккал"],
    ["Белки", total.protein, state.targets.protein, "г"],
    ["Жиры", total.fat, state.targets.fat, "г"],
    ["Углеводы", total.carbs, state.targets.carbs, "г"]
  ];

  root.innerHTML = `
    <section class="grid">
      <article class="panel">
        <p class="eyebrow">telegram сценарий</p>
        <h2>КБЖУ внутри бота</h2>
        <div class="phone-frame">
          <div class="phone-top"><span>КБЖУ Bot</span><span>online</span></div>
          <div class="phone-message"><strong>Сегодня съедено ${total.calories} ккал</strong><small>Осталось ${Math.max(0, state.targets.calories - total.calories)} ккал. Белки: ${total.protein}/${state.targets.protein} г.</small></div>
          <div class="phone-message"><strong>Быстрые продукты</strong><small>Нажми пресет ниже, чтобы добавить прием пищи.</small></div>
        </div>
        <div class="chips">${state.presets.map((meal, index) => `<button type="button" data-preset="${index}">${meal.name}</button>`).join("")}</div>
        <div class="list">${state.meals.map((meal, index) => `
          <div class="list-item">
            <div><strong>${meal.name}</strong><span>${meal.calories} ккал · Б ${meal.protein} · Ж ${meal.fat} · У ${meal.carbs}</span></div>
            <button type="button" data-remove="${index}">Удалить</button>
          </div>`).join("")}</div>
      </article>
      <aside class="panel">
        <p class="eyebrow">прогресс</p>
        <h2>Макросы</h2>
        <div class="bars">${bars.map(([label, value, target, unit]) => `
          <div>
            <div class="bar-label"><span>${label}</span><strong>${value} / ${target} ${unit}</strong></div>
            <div class="track"><div class="fill" style="--value:${Math.min(100, Math.round(value / target * 100))}%"></div></div>
          </div>`).join("")}</div>
      </aside>
    </section>
  `;
}

function renderFluxvpn() {
  const activeServer = state.servers.find((server) => server.country === state.server);
  renderMetrics([
    { label: "статус", value: state.active ? "защищен" : "выключен" },
    { label: "сервер", value: state.server },
    { label: "ping", value: `${activeServer.ping} ms` },
    { label: "скорость", value: `${activeServer.speed} Mbps` }
  ]);

  root.innerHTML = `
    <section class="grid">
      <article class="panel">
        <p class="eyebrow">FluxVpn кабинет</p>
        <h2>${state.active ? "Защита включена" : "Защита выключена"}</h2>
        <p>Панель показывает основной сценарий FluxVpn: подключение, выбор страны, скорость, ping, тариф и активные устройства.</p>
        <div class="actions"><button class="button primary" type="button" data-toggle-flux>${state.active ? "Отключить" : "Подключить"}</button></div>
        <div class="cards">${state.servers.map((server) => `
          <button class="small-card" type="button" data-server="${server.country}">
            <span>${server.country}</span>
            <strong>${server.ping} ms</strong>
            <p>${server.speed} Mbps</p>
          </button>`).join("")}</div>
      </article>
      <aside class="panel">
        <p class="eyebrow">тариф и устройства</p>
        <h2>${state.plan}</h2>
        <div class="list">
          <div class="list-item"><div><strong>iPhone</strong><span>подключен через ${state.server}</span></div><span class="status-pill">online</span></div>
          <div class="list-item"><div><strong>Windows PC</strong><span>последняя активность сегодня</span></div><span class="status-pill">safe</span></div>
          <div class="list-item"><div><strong>Лимит</strong><span>5 устройств в тарифе</span></div><span class="status-pill">2/5</span></div>
        </div>
      </aside>
    </section>
  `;
}

function renderExclusive() {
  const total = state.partners.reduce((sum, partner) => sum + partner.potential, 0);
  renderMetrics([
    { label: "партнеры", value: state.partners.length },
    { label: "потенциал", value: money(total) },
    { label: "средняя конверсия", value: `${Math.round(state.partners.reduce((sum, p) => sum + p.conversion, 0) / state.partners.length)}%` },
    { label: "воронка", value: "4 этапа" }
  ]);

  root.innerHTML = `
    <section class="grid">
      <article class="panel">
        <p class="eyebrow">партнеры</p>
        <h2>Exclusive pipeline</h2>
        <div class="chips">
          <button type="button" data-filter="all">Все</button>
          <button type="button" data-filter="Черный">Черный</button>
          <button type="button" data-filter="Золотой">Золотой</button>
        </div>
        <div class="list" id="partnerList">${partnerCards(state.partners)}</div>
      </article>
      <aside class="panel">
        <p class="eyebrow">расчет сделки</p>
        <h2>Комиссия</h2>
        <div class="form-grid">
          <label>Средний чек<input id="avgDeal" type="number" value="85000"></label>
          <label>Сделок<input id="dealCount" type="number" value="12"></label>
          <label>Комиссия %<input id="commission" type="number" value="12"></label>
        </div>
        <div class="small-card"><span>оценка</span><strong id="commissionResult">${money(122400)}</strong></div>
      </aside>
    </section>
  `;
}

function partnerCards(list) {
  return list.map((partner) => `
    <div class="list-item">
      <div><strong>${partner.name}</strong><span>${partner.tier} · ${partner.status} · ${money(partner.potential)}</span></div>
      <span class="status-pill">${partner.conversion}%</span>
    </div>`).join("");
}

function renderTgOrder() {
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  renderMetrics([
    { label: "позиции", value: state.menu.length },
    { label: "в корзине", value: state.cart.length },
    { label: "сумма", value: money(total) },
    { label: "статусы", value: state.statuses.length }
  ]);

  root.innerHTML = `
    <section class="grid">
      <article class="panel">
        <p class="eyebrow">бот заказов</p>
        <h2>Меню и корзина</h2>
        <div class="cards">${state.menu.map((item, index) => `
          <button class="small-card" type="button" data-add-order="${index}">
            <span>${money(item.price)}</span>
            <strong>${item.name}</strong>
            <p>Добавить в заявку</p>
          </button>`).join("")}</div>
        <div class="list">${state.cart.length ? state.cart.map((item, index) => `
          <div class="list-item">
            <div><strong>${item.name}</strong><span>${money(item.price)} · заявка #${index + 1}</span></div>
            <button type="button" data-remove-order="${index}">Убрать</button>
          </div>`).join("") : `<div class="list-item"><div><strong>Корзина пустая</strong><span>Добавь услугу из меню выше.</span></div><span class="status-pill">new</span></div>`}</div>
      </article>
      <aside class="panel">
        <p class="eyebrow">как выглядит в Telegram</p>
        <h2>Диалог</h2>
        <div class="phone-frame">
          <div class="phone-top"><span>Order Bot</span><span>online</span></div>
          <div class="phone-message"><strong>Выберите услугу</strong><small>Лендинг, Telegram-бот, дизайн карточки.</small></div>
          <div class="phone-message"><strong>Заявка: ${money(total)}</strong><small>${state.cart.length ? "Можно отправить менеджеру." : "Пока ничего не выбрано."}</small></div>
        </div>
      </aside>
    </section>
  `;
}

function renderTgSupport() {
  const ticket = state.tickets[state.activeTicket];
  renderMetrics([
    { label: "заявки", value: state.tickets.length },
    { label: "активная", value: ticket.priority },
    { label: "ответы", value: state.replies },
    { label: "SLA", value: "14 мин" }
  ]);

  root.innerHTML = `
    <section class="grid">
      <article class="panel">
        <p class="eyebrow">поддержка</p>
        <h2>Очередь заявок</h2>
        <div class="list">${state.tickets.map((item, index) => `
          <div class="list-item">
            <div><strong>${item.name}</strong><span>${item.user} · ${item.priority} · ${item.status}</span></div>
            <button type="button" data-ticket="${index}">${index === state.activeTicket ? "Открыта" : "Открыть"}</button>
          </div>`).join("")}</div>
      </article>
      <aside class="panel">
        <p class="eyebrow">ответ оператору</p>
        <h2>${ticket.name}</h2>
        <div class="phone-frame">
          <div class="phone-top"><span>${ticket.user}</span><span>${ticket.priority}</span></div>
          <div class="phone-message"><strong>Сообщение клиента</strong><small>Нужно быстро понять проблему и дать аккуратный ответ.</small></div>
          <div class="phone-message"><strong>Шаблон ответа</strong><small id="replyText">${state.templates[0]}</small></div>
        </div>
        <div class="chips">${state.templates.map((template, index) => `<button type="button" data-template="${index}">Ответ ${index + 1}</button>`).join("")}</div>
      </aside>
    </section>
  `;
}

function render() {
  if (app === "kbju") renderKbju();
  if (app === "fluxvpn") renderFluxvpn();
  if (app === "exclusive") renderExclusive();
  if (app === "tgorder") renderTgOrder();
  if (app === "tgsupport") renderTgSupport();
}

root.addEventListener("click", (event) => {
  const preset = event.target.closest("[data-preset]");
  if (preset && app === "kbju") {
    state.meals.push(state.presets[Number(preset.dataset.preset)]);
    showToast("Продукт добавлен");
    render();
  }

  const remove = event.target.closest("[data-remove]");
  if (remove && app === "kbju") {
    state.meals.splice(Number(remove.dataset.remove), 1);
    render();
  }

  const server = event.target.closest("[data-server]");
  if (server && app === "fluxvpn") {
    state.server = server.dataset.server;
    showToast(`Сервер: ${state.server}`);
    render();
  }

  const toggle = event.target.closest("[data-toggle-flux]");
  if (toggle && app === "fluxvpn") {
    state.active = !state.active;
    render();
  }

  const filter = event.target.closest("[data-filter]");
  if (filter && app === "exclusive") {
    const list = filter.dataset.filter === "all" ? state.partners : state.partners.filter((partner) => partner.tier === filter.dataset.filter);
    document.querySelector("#partnerList").innerHTML = partnerCards(list);
  }

  const addOrder = event.target.closest("[data-add-order]");
  if (addOrder && app === "tgorder") {
    state.cart.push(state.menu[Number(addOrder.dataset.addOrder)]);
    showToast("Добавлено в заявку");
    render();
  }

  const removeOrder = event.target.closest("[data-remove-order]");
  if (removeOrder && app === "tgorder") {
    state.cart.splice(Number(removeOrder.dataset.removeOrder), 1);
    render();
  }

  const ticket = event.target.closest("[data-ticket]");
  if (ticket && app === "tgsupport") {
    state.activeTicket = Number(ticket.dataset.ticket);
    render();
  }

  const template = event.target.closest("[data-template]");
  if (template && app === "tgsupport") {
    state.replies += 1;
    document.querySelector("#replyText").textContent = state.templates[Number(template.dataset.template)];
    showToast("Шаблон выбран");
    renderMetrics([
      { label: "заявки", value: state.tickets.length },
      { label: "активная", value: state.tickets[state.activeTicket].priority },
      { label: "ответы", value: state.replies },
      { label: "SLA", value: "14 мин" }
    ]);
  }
});

root.addEventListener("input", () => {
  if (app !== "exclusive") return;
  const avg = Number(document.querySelector("#avgDeal")?.value || 0);
  const count = Number(document.querySelector("#dealCount")?.value || 0);
  const commission = Number(document.querySelector("#commission")?.value || 0) / 100;
  const result = document.querySelector("#commissionResult");
  if (result) result.textContent = money(avg * count * commission);
});

render();
