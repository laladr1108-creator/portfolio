const body = document.body;
const themeToggle = document.querySelector("#themeToggle");
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function syncTheme() {
  const isLight = body.classList.contains("light");
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Включить темную тему" : "Включить светлую тему");
}

const savedTheme = localStorage.getItem("swatik11-theme-v2");
if (savedTheme === "light") body.classList.add("light");
syncTheme();

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light");
  localStorage.setItem("swatik11-theme-v2", body.classList.contains("light") ? "light" : "dark");
  syncTheme();
  showToast(body.classList.contains("light") ? "Светлая тема включена" : "Темная тема включена");
});

document.querySelector("#copyLink").addEventListener("click", async () => {
  const url = "http://31.76.9.140/";
  try {
    await navigator.clipboard.writeText(url);
    showToast("Ссылка на портфолио скопирована");
  } catch {
    showToast(url);
  }
});

document.querySelectorAll(".case-item").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    const link = card.querySelector("a");
    if (link) link.click();
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const link = card.querySelector("a");
    if (link) {
      event.preventDefault();
      link.click();
    }
  });
});
