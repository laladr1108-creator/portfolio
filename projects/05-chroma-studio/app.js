const hueInput = document.querySelector("#hueInput");
const intensityInput = document.querySelector("#intensityInput");
const modeSelect = document.querySelector("#modeSelect");
const hueLabel = document.querySelector("#hueLabel");
const intensityLabel = document.querySelector("#intensityLabel");
const modeLabel = document.querySelector("#modeLabel");
const swatchGrid = document.querySelector("#swatchGrid");
const sampleCard = document.querySelector("#sampleCard");
const contrastRatio = document.querySelector("#contrastRatio");
const contrastLabel = document.querySelector("#contrastLabel");
const savedList = document.querySelector("#savedList");
const toast = document.querySelector("#toast");

let palette = [];
let saved = [];

const modeLabels = {
  analogous: "Аналоговая",
  triad: "Триада",
  split: "Раздельный комплемент",
  mono: "Редакционная моно"
};

function clampHue(value) {
  return (value + 360) % 360;
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channels = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(a, b) {
  const first = luminance(a);
  const second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function recipeOffsets(mode) {
  if (mode === "triad") return [0, 120, 240, 32, 208];
  if (mode === "split") return [0, 150, 210, 32, 330];
  if (mode === "mono") return [0, 0, 0, 0, 0];
  return [0, 22, 44, 196, 326];
}

function generatePalette() {
  const hue = Number(hueInput.value);
  const intensity = Number(intensityInput.value);
  const mode = modeSelect.value;
  const offsets = recipeOffsets(mode);
  const lightness = mode === "mono" ? [16, 30, 48, 68, 88] : [18, 38, 54, 70, 88];
  const saturation = mode === "mono" ? [18, 34, 42, 48, 32] : [intensity, Math.max(42, intensity - 8), intensity, Math.max(36, intensity - 16), Math.max(20, intensity - 28)];
  palette = offsets.map((offset, index) => hslToHex(clampHue(hue + offset), saturation[index], lightness[index]));
  render();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

async function copyColor(hex) {
  try {
    await navigator.clipboard.writeText(hex);
    showToast(`${hex} скопирован`);
  } catch {
    showToast("Копирование недоступно в этом браузере");
  }
}

function renderSwatches() {
  swatchGrid.innerHTML = palette.map((hex, index) => `
    <article class="swatch" style="background:${hex}">
      <strong>${hex}</strong>
      <span>Цвет ${index + 1}</span>
      <button type="button" data-copy="${hex}">Копировать</button>
    </article>
  `).join("");
}

function renderPreview() {
  const bg = palette[0];
  const accent = palette[2];
  const surface = palette[4];
  sampleCard.style.background = `linear-gradient(135deg, ${bg}, ${palette[1]} 58%, ${accent})`;
  sampleCard.style.color = surface;
  sampleCard.querySelector("button").style.background = surface;
  sampleCard.querySelector("button").style.color = bg;
  const ratio = contrast(bg, surface);
  contrastRatio.textContent = ratio.toFixed(2);
  contrastLabel.textContent = ratio >= 7 ? "AAA готово" : ratio >= 4.5 ? "AA готово" : "Нужно настроить";
}

function renderSaved() {
  savedList.innerHTML = saved.length
    ? saved.map((set, index) => `
      <article class="saved-item">
        <div>
          <div class="saved-strip">${set.map((hex) => `<i style="background:${hex}"></i>`).join("")}</div>
          <small>${set.join(" ")}</small>
        </div>
        <button type="button" data-load="${index}">Загрузить</button>
      </article>
    `).join("")
    : `<div class="saved-item"><small>Сохраненных палитр пока нет.</small></div>`;
}

function render() {
  hueLabel.textContent = hueInput.value;
  intensityLabel.textContent = `${intensityInput.value}%`;
  modeLabel.textContent = modeLabels[modeSelect.value];
  renderSwatches();
  renderPreview();
  renderSaved();
}

document.querySelector("#shuffleButton").addEventListener("click", () => {
  hueInput.value = Math.floor(Math.random() * 361);
  intensityInput.value = 48 + Math.floor(Math.random() * 40);
  const modes = ["analogous", "triad", "split", "mono"];
  modeSelect.value = modes[Math.floor(Math.random() * modes.length)];
  generatePalette();
  showToast("Палитра создана");
});

document.querySelector("#saveButton").addEventListener("click", () => {
  saved.unshift([...palette]);
  saved = saved.slice(0, 5);
  renderSaved();
  showToast("Палитра сохранена");
});

document.querySelector("#resetButton").addEventListener("click", () => {
  hueInput.value = 172;
  intensityInput.value = 72;
  modeSelect.value = "analogous";
  generatePalette();
  showToast("Настройки сброшены");
});

document.querySelector("#clearSaved").addEventListener("click", () => {
  saved = [];
  renderSaved();
  showToast("Библиотека очищена");
});

swatchGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy]");
  if (button) copyColor(button.dataset.copy);
});

savedList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-load]");
  if (!button) return;
  palette = [...saved[Number(button.dataset.load)]];
  renderSwatches();
  renderPreview();
  showToast("Палитра загружена");
});

[hueInput, intensityInput, modeSelect].forEach((input) => input.addEventListener("input", generatePalette));

generatePalette();
