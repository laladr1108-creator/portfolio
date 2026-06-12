const metrics = {
  revenue: {
    title: "Траектория выручки",
    actual: [860, 930, 1020, 1180, 1320, 1510, 1690, 1840],
    forecast: [1840, 2030, 2290, 2540],
    suffix: "K"
  },
  margin: {
    title: "Рост маржи",
    actual: [62, 64, 67, 68, 71, 73, 76, 78],
    forecast: [78, 79, 81, 83],
    suffix: "%"
  },
  cash: {
    title: "Денежный баланс",
    actual: [3420, 3220, 3040, 2860, 2710, 2580, 2420, 2260],
    forecast: [2260, 2140, 2020, 1940],
    suffix: "K"
  }
};

const transactions = [
  { vendor: "Northstar Cloud", type: "Инфраструктура", owner: "Майя", amount: "$24,800", status: "approved", label: "одобрено" },
  { vendor: "Ledger Sync", type: "Финансы", owner: "Иван", amount: "$8,450", status: "approved", label: "одобрено" },
  { vendor: "Vector Ads", type: "Рост", owner: "Ари", amount: "$31,200", status: "review", label: "проверка" },
  { vendor: "Studio Nine", type: "Бренд", owner: "Лея", amount: "$12,100", status: "approved", label: "одобрено" },
  { vendor: "Hiring Pipeline", type: "Команда", owner: "Ной", amount: "$18,600", status: "blocked", label: "блокер" },
  { vendor: "Data Lakehouse", type: "Аналитика", owner: "Сэм", amount: "$15,900", status: "review", label: "проверка" }
];

const chart = document.querySelector("#metricChart");
const chartTitle = document.querySelector("#chartTitle");
const tabButtons = document.querySelectorAll("[data-metric]");
const searchInput = document.querySelector("#transactionSearch");
const transactionBody = document.querySelector("#transactionBody");
const clearSearch = document.querySelector("#clearSearch");
const exportButton = document.querySelector("#exportButton");
const toast = document.querySelector("#toast");
const growthInput = document.querySelector("#growthInput");
const hiringInput = document.querySelector("#hiringInput");

function pointList(values, width, height, padding, min, max) {
  return values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (values.length - 1);
    const y = height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2);
    return [x, y];
  });
}

function drawMetric(name) {
  const metric = metrics[name];
  const allValues = [...metric.actual, ...metric.forecast];
  const min = Math.min(...allValues) * 0.92;
  const max = Math.max(...allValues) * 1.08;
  const width = 720;
  const height = 280;
  const padding = 34;
  const actualPoints = pointList(metric.actual, width * 0.68, height, padding, min, max);
  const forecastPoints = pointList(metric.forecast, width * 0.35, height, padding, min, max)
    .map(([x, y]) => [x + width * 0.61, y]);
  const area = `${actualPoints.map((point) => point.join(",")).join(" ")} ${actualPoints.at(-1)[0]},${height - padding} ${actualPoints[0][0]},${height - padding}`;

  chartTitle.textContent = metric.title;
  chart.innerHTML = `
    <defs>
      <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#0b6f5d" stop-opacity="0.22" />
        <stop offset="100%" stop-color="#0b6f5d" stop-opacity="0.02" />
      </linearGradient>
    </defs>
    ${[60, 115, 170, 225].map((y) => `<line class="grid-line" x1="28" x2="692" y1="${y}" y2="${y}" />`).join("")}
    <polygon class="chart-area" fill="url(#chartFill)" points="${area}" />
    <polyline class="chart-line" points="${actualPoints.map((point) => point.join(",")).join(" ")}" />
    <polyline class="forecast-line" points="${forecastPoints.map((point) => point.join(",")).join(" ")}" />
    ${actualPoints.map(([x, y]) => `<circle class="chart-dot" cx="${x}" cy="${y}" r="6" />`).join("")}
    <text x="34" y="34" fill="#65706a" font-size="13" font-weight="700">${Math.round(max)}${metric.suffix}</text>
    <text x="34" y="254" fill="#65706a" font-size="13" font-weight="700">${Math.round(min)}${metric.suffix}</text>
  `;
}

function renderTransactions() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = transactions.filter((item) =>
    Object.values(item).some((value) => value.toLowerCase().includes(query))
  );

  transactionBody.innerHTML = filtered.length
    ? filtered.map((item) => `
      <tr>
        <td><strong>${item.vendor}</strong></td>
        <td>${item.type}</td>
        <td>${item.owner}</td>
        <td>${item.amount}</td>
        <td><span class="label ${item.status}">${item.label}</span></td>
      </tr>
    `).join("")
    : `<tr><td colspan="5">По этому запросу транзакций нет.</td></tr>`;
}

function updateScenario() {
  const growth = Number(growthInput.value);
  const hiring = Number(hiringInput.value);
  const runway = Math.max(8.4, 16.8 + growth * 0.16 - hiring * 0.42);
  const cash = Math.max(0.8, 1.55 + growth * 0.035 - hiring * 0.075);
  document.querySelector("#growthLabel").textContent = `${growth}%`;
  document.querySelector("#hiringLabel").textContent = `${hiring} ролей`;
  document.querySelector("#scenarioRunway").textContent = `${runway.toFixed(1)} мес`;
  document.querySelector("#scenarioCash").textContent = `$${cash.toFixed(2)}M`;
  document.querySelector("#runwayValue").textContent = `${runway.toFixed(1)} мес`;
  document.querySelector("#advisorText").textContent = hiring > 6
    ? "Темп найма сокращает runway. Рассмотрите поэтапные офферы или более высокий рост."
    : "Runway улучшается, если найм остается ниже 4 ролей в квартал.";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1900);
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    drawMetric(button.dataset.metric);
  });
});

searchInput.addEventListener("input", renderTransactions);
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  renderTransactions();
  searchInput.focus();
});
exportButton.addEventListener("click", () => showToast("Финансовый экспорт подготовлен"));
growthInput.addEventListener("input", updateScenario);
hiringInput.addEventListener("input", updateScenario);

drawMetric("revenue");
renderTransactions();
updateScenario();
