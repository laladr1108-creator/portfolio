let partners = [
  { id: 1, name: "Aurum Club", tier: "Black", status: "active", city: "Москва", leads: 42, potential: 2850000, conversion: 78 },
  { id: 2, name: "Prime Auto", tier: "Gold", status: "review", city: "Санкт-Петербург", leads: 28, potential: 1640000, conversion: 61 },
  { id: 3, name: "Elite Realty", tier: "Black", status: "warm", city: "Казань", leads: 19, potential: 1210000, conversion: 52 },
  { id: 4, name: "Status Travel", tier: "Silver", status: "active", city: "Сочи", leads: 17, potential: 880000, conversion: 49 },
  { id: 5, name: "Luxe Events", tier: "Gold", status: "active", city: "Дубай", leads: 31, potential: 1920000, conversion: 66 }
];

const stages = [
  { name: "Новые лиды", value: 82 },
  { name: "Переговоры", value: 64 },
  { name: "Договор", value: 38 },
  { name: "Запуск", value: 24 }
];

const tasks = [
  "Подготовить оффер для Aurum Club",
  "Проверить документы Prime Auto",
  "Созвониться с Elite Realty по условиям",
  "Обновить медиакит для Gold-партнеров"
];

const partnersGrid = document.querySelector("#partners");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const tierFilter = document.querySelector("#tierFilter");
const totalPotential = document.querySelector("#totalPotential");
const pipelineList = document.querySelector("#pipelineList");
const taskList = document.querySelector("#taskList");
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

function statusLabel(status) {
  return {
    active: "активный",
    review: "на проверке",
    warm: "теплый"
  }[status];
}

function filteredPartners() {
  const query = searchInput.value.trim().toLowerCase();
  return partners.filter((partner) => {
    const matchQuery = !query || partner.name.toLowerCase().includes(query) || partner.city.toLowerCase().includes(query);
    const matchStatus = statusFilter.value === "all" || partner.status === statusFilter.value;
    const matchTier = tierFilter.value === "all" || partner.tier === tierFilter.value;
    return matchQuery && matchStatus && matchTier;
  });
}

function renderPartners() {
  const list = filteredPartners();
  if (!list.length) {
    partnersGrid.innerHTML = `<article class="partner-card"><h3>Ничего не найдено</h3><p>Попробуй изменить фильтры или поиск.</p></article>`;
    return;
  }

  partnersGrid.innerHTML = list.map((partner) => `
    <article class="partner-card">
      <header>
        <div>
          <h3>${partner.name}</h3>
          <p>${partner.city}</p>
        </div>
        <span class="tier">${partner.tier}</span>
      </header>
      <div class="partner-metrics">
        <div><span>Лиды</span><strong>${partner.leads}</strong></div>
        <div><span>Потенциал</span><strong>${money(partner.potential)}</strong></div>
        <div><span>Конверсия</span><strong>${partner.conversion}%</strong></div>
        <div><span>Уровень</span><strong>${partner.tier}</strong></div>
      </div>
      <span class="status ${partner.status}">${statusLabel(partner.status)}</span>
    </article>
  `).join("");
}

function renderStats() {
  totalPotential.textContent = money(partners.reduce((sum, partner) => sum + partner.potential, 0));
  pipelineList.innerHTML = stages.map((stage) => `
    <div class="pipeline-item">
      <strong><span>${stage.name}</span><span>${stage.value}%</span></strong>
      <div class="track"><div class="fill" style="--value: ${stage.value}%"></div></div>
    </div>
  `).join("");
  taskList.innerHTML = tasks.map((task, index) => `
    <div class="task-item">
      <strong><span>${task}</span><span>0${index + 1}</span></strong>
    </div>
  `).join("");
}

function renderCalculator() {
  const avg = Number(document.querySelector("#avgDeal").value || 0);
  const count = Number(document.querySelector("#dealCount").value || 0);
  const commission = Number(document.querySelector("#commission").value || 0) / 100;
  document.querySelector("#commissionResult").textContent = money(avg * count * commission);
}

function render() {
  renderPartners();
  renderStats();
  renderCalculator();
}

[searchInput, statusFilter, tierFilter].forEach((input) => {
  input.addEventListener("input", renderPartners);
});

["#avgDeal", "#dealCount", "#commission"].forEach((selector) => {
  document.querySelector(selector).addEventListener("input", renderCalculator);
});

document.querySelector("#addPartner").addEventListener("click", () => {
  partners = [
    ...partners,
    {
      id: Date.now(),
      name: "Exclusive Demo",
      tier: "Silver",
      status: "warm",
      city: "Онлайн",
      leads: 11,
      potential: 640000,
      conversion: 43
    }
  ];
  render();
  showToast("Демо-партнер добавлен");
});

render();
