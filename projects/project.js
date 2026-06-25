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
  vpn: {
    active: true,
    server: "Нидерланды",
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
  workboard: {
    tasks: [
      { title: "Собрать первый экран", status: "В работе", priority: "высокий" },
      { title: "Проверить мобильную сетку", status: "Готово", priority: "средний" },
      { title: "Добавить пустые состояния", status: "План", priority: "низкий" }
    ]
  },
  money: {
    budget: 85000,
    expenses: [
      { name: "Аренда", category: "Дом", amount: 30000 },
      { name: "Продукты", category: "Еда", amount: 14200 },
      { name: "Сервисы", category: "Подписки", amount: 4200 }
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
        <p class="eyebrow">дневник питания</p>
        <h2>Рацион на день</h2>
        <div class="chips">${state.presets.map((meal, index) => `<button type="button" data-preset="${index}">${meal.name}</button>`).join("")}</div>
        <div class="list">${state.meals.map((meal, index) => `
          <div class="list-item">
            <div><strong>${meal.name}</strong><span>${meal.calories} ккал · Б ${meal.protein} · Ж ${meal.fat} · У ${meal.carbs}</span></div>
            <button type="button" data-remove="${index}">Удалить</button>
          </div>`).join("")}</div>
      </article>
      <aside class="panel">
        <p class="eyebrow">прогресс</p>
        <h2>Прогресс</h2>
        <div class="bars">${bars.map(([label, value, target, unit]) => `
          <div>
            <div class="bar-label"><span>${label}</span><strong>${value} / ${target} ${unit}</strong></div>
            <div class="track"><div class="fill" style="--value:${Math.min(100, Math.round(value / target * 100))}%"></div></div>
          </div>`).join("")}</div>
      </aside>
    </section>
  `;
}

function renderVpn() {
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
        <p class="eyebrow">подключение</p>
        <h2>${state.active ? "VPN подключен" : "VPN выключен"}</h2>
        <p>Панель показывает понятный личный кабинет: текущий сервер, статус защиты, скорость и выбор локации.</p>
        <div class="actions"><button class="button primary" type="button" data-toggle-vpn>${state.active ? "Отключить" : "Подключить"}</button></div>
        <div class="cards">${state.servers.map((server) => `
          <button class="small-card" type="button" data-server="${server.country}">
            <span>${server.country}</span>
            <strong>${server.ping} ms</strong>
            <p>${server.speed} Mbps</p>
          </button>`).join("")}</div>
      </article>
      <aside class="panel">
        <p class="eyebrow">устройства</p>
        <h2>Устройства</h2>
        <div class="list">
          <div class="list-item"><div><strong>iPhone</strong><span>сейчас подключен</span></div><span class="status-pill">онлайн</span></div>
          <div class="list-item"><div><strong>Windows PC</strong><span>последняя активность сегодня</span></div><span class="status-pill">защищен</span></div>
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
        <h2>Партнеры</h2>
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

function renderWorkboard() {
  const done = state.tasks.filter((task) => task.status === "Готово").length;
  renderMetrics([
    { label: "задачи", value: state.tasks.length },
    { label: "готово", value: done },
    { label: "в работе", value: state.tasks.filter((task) => task.status === "В работе").length },
    { label: "фокус", value: "UI" }
  ]);

  root.innerHTML = `
    <section class="grid">
      <article class="panel">
        <p class="eyebrow">доска задач</p>
        <h2>Рабочая доска</h2>
        <form class="form-grid" id="taskForm">
          <label>Задача<input id="taskTitle" type="text" value="Проверить форму контакта"></label>
          <label>Статус<select id="taskStatus"><option>План</option><option>В работе</option><option>Готово</option></select></label>
          <button class="button primary" type="submit">Добавить</button>
        </form>
        <div class="list">${state.tasks.map((task, index) => `
          <div class="list-item">
            <div><strong>${task.title}</strong><span>${task.status} · ${task.priority}</span></div>
            <button type="button" data-done="${index}">Готово</button>
          </div>`).join("")}</div>
      </article>
      <aside class="panel">
        <p class="eyebrow">итог</p>
        <h2>Что показывает проект</h2>
        <p>Добавление задач, изменение статуса, счетчики и компактная доска без лишнего шума.</p>
      </aside>
    </section>
  `;
}

function renderMoney() {
  const spent = state.expenses.reduce((sum, item) => sum + item.amount, 0);
  const left = state.budget - spent;
  renderMetrics([
    { label: "бюджет", value: money(state.budget) },
    { label: "расходы", value: money(spent) },
    { label: "остаток", value: money(left) },
    { label: "категории", value: new Set(state.expenses.map((item) => item.category)).size }
  ]);

  root.innerHTML = `
    <section class="grid">
      <article class="panel">
        <p class="eyebrow">расходы</p>
        <h2>Расходы месяца</h2>
        <form class="form-grid" id="expenseForm">
          <label>Название<input id="expenseName" type="text" value="Кофе"></label>
          <label>Категория<input id="expenseCategory" type="text" value="Еда"></label>
          <label>Сумма<input id="expenseAmount" type="number" value="450"></label>
          <button class="button primary" type="submit">Добавить</button>
        </form>
        <div class="list">${state.expenses.map((item, index) => `
          <div class="list-item">
            <div><strong>${item.name}</strong><span>${item.category} · ${money(item.amount)}</span></div>
            <button type="button" data-expense="${index}">Удалить</button>
          </div>`).join("")}</div>
      </article>
      <aside class="panel">
        <p class="eyebrow">бюджет</p>
        <h2>Бюджет</h2>
        <div class="bars">
          <div>
            <div class="bar-label"><span>Потрачено</span><strong>${Math.round(spent / state.budget * 100)}%</strong></div>
            <div class="track"><div class="fill" style="--value:${Math.min(100, Math.round(spent / state.budget * 100))}%"></div></div>
          </div>
        </div>
      </aside>
    </section>
  `;
}

function render() {
  if (app === "kbju") renderKbju();
  if (app === "vpn") renderVpn();
  if (app === "exclusive") renderExclusive();
  if (app === "workboard") renderWorkboard();
  if (app === "money") renderMoney();
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
  if (server && app === "vpn") {
    state.server = server.dataset.server;
    showToast(`Сервер: ${state.server}`);
    render();
  }

  const toggle = event.target.closest("[data-toggle-vpn]");
  if (toggle && app === "vpn") {
    state.active = !state.active;
    render();
  }

  const filter = event.target.closest("[data-filter]");
  if (filter && app === "exclusive") {
    const list = filter.dataset.filter === "all" ? state.partners : state.partners.filter((partner) => partner.tier === filter.dataset.filter);
    document.querySelector("#partnerList").innerHTML = partnerCards(list);
  }

  const done = event.target.closest("[data-done]");
  if (done && app === "workboard") {
    state.tasks[Number(done.dataset.done)].status = "Готово";
    render();
  }

  const expense = event.target.closest("[data-expense]");
  if (expense && app === "money") {
    state.expenses.splice(Number(expense.dataset.expense), 1);
    render();
  }
});

root.addEventListener("submit", (event) => {
  event.preventDefault();
  if (app === "workboard") {
    state.tasks.push({
      title: document.querySelector("#taskTitle").value,
      status: document.querySelector("#taskStatus").value,
      priority: "средний"
    });
    render();
  }
  if (app === "money") {
    state.expenses.push({
      name: document.querySelector("#expenseName").value,
      category: document.querySelector("#expenseCategory").value,
      amount: Number(document.querySelector("#expenseAmount").value)
    });
    render();
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
