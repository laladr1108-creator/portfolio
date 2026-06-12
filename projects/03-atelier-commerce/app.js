const products = [
  {
    id: 1,
    name: "Архивный хронограф",
    category: "wear",
    tone: "warm",
    price: 420,
    rating: 4.9,
    description: "Минималистичные часы с матовой сталью и теплой кожей.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Наушники Signal",
    category: "tech",
    tone: "neutral",
    price: 280,
    rating: 4.7,
    description: "Беспроводной студийный звук с мягким матовым покрытием.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Дорожная сумка Canvas",
    category: "wear",
    tone: "warm",
    price: 198,
    rating: 4.8,
    description: "Формованная дорожная сумка с кожей и латунной фурнитурой.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Льняное кресло",
    category: "home",
    tone: "neutral",
    price: 640,
    rating: 4.6,
    description: "Компактное кресло с дубовым каркасом и фактурным льном.",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Кроссовки Runner 02",
    category: "wear",
    tone: "cool",
    price: 156,
    rating: 4.5,
    description: "Архитектурные кроссовки со слоистой сеткой и скульптурной подошвой.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "Рабочая лампа",
    category: "home",
    tone: "cool",
    price: 220,
    rating: 4.8,
    description: "Регулируемая настольная лампа с четким абажуром и устойчивой базой.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80"
  }
];

const cart = new Map();
const productGrid = document.querySelector("#productGrid");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const cartCount = document.querySelector("#cartCount");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const toast = document.querySelector("#toast");

const categoryLabels = {
  wear: "аксессуары",
  home: "дом",
  tech: "техника"
};

const toneLabels = {
  warm: "теплый",
  cool: "холодный",
  neutral: "нейтральный"
};

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function selectedTones() {
  return [...document.querySelectorAll("[name='tone']:checked")].map((input) => input.value);
}

function getCategory() {
  return document.querySelector("[name='category']:checked").value;
}

function filteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = getCategory();
  const tones = selectedTones();
  let list = products.filter((product) => {
    const matchesQuery = [product.name, product.description, product.category].some((value) => value.toLowerCase().includes(query));
    const matchesCategory = category === "all" || product.category === category;
    const matchesTone = !tones.length || tones.includes(product.tone);
    return matchesQuery && matchesCategory && matchesTone;
  });

  const sort = sortSelect.value;
  if (sort === "price-low") list = list.sort((a, b) => a.price - b.price);
  if (sort === "price-high") list = list.sort((a, b) => b.price - a.price);
  if (sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
  return list;
}

function renderProducts() {
  const list = filteredProducts();
  resultCount.textContent = list.length;
  productGrid.innerHTML = list.length
    ? list.map((product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="body">
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <div class="product-meta">
            <span>${categoryLabels[product.category]}</span>
            <span>${toneLabels[product.tone]}</span>
            <span>${product.rating.toFixed(1)} рейтинг</span>
          </div>
          <footer>
            <strong>${money(product.price)}</strong>
            <button type="button" data-add="${product.id}">Добавить</button>
          </footer>
        </div>
      </article>
    `).join("")
    : `<div class="empty-state">По текущим фильтрам товаров нет.</div>`;
}

function renderCart() {
  const entries = [...cart.entries()].map(([id, qty]) => {
    const product = products.find((item) => item.id === id);
    return { product, qty };
  });
  const itemCount = entries.reduce((sum, item) => sum + item.qty, 0);
  const total = entries.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  cartCount.textContent = itemCount;
  cartTotal.textContent = money(total);
  cartItems.innerHTML = entries.length
    ? entries.map(({ product, qty }) => `
      <article class="cart-item">
        <div>
          <strong>${product.name}</strong>
          <span>${qty} x ${money(product.price)}</span>
        </div>
        <button type="button" data-remove="${product.id}">Убрать</button>
      </article>
    `).join("")
    : `<div class="empty-state">Корзина пуста. Добавьте товар, чтобы начать оформление.</div>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1700);
}

document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  const remove = event.target.closest("[data-remove]");
  if (add) {
    const id = Number(add.dataset.add);
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    showToast("Добавлено в корзину");
  }
  if (remove) {
    const id = Number(remove.dataset.remove);
    cart.delete(id);
    renderCart();
    showToast("Удалено из корзины");
  }
});

document.querySelector("#openCart").addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
});

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

document.querySelector("#closeCart").addEventListener("click", closeCart);
document.querySelector("#closeBackdrop").addEventListener("click", closeCart);
document.querySelector("#checkoutButton").addEventListener("click", () => {
  showToast(cart.size ? "Оформление готово" : "Сначала добавьте товар");
});

document.querySelector("#resetFilters").addEventListener("click", () => {
  searchInput.value = "";
  document.querySelector("[name='category'][value='all']").checked = true;
  document.querySelectorAll("[name='tone']").forEach((input) => input.checked = false);
  sortSelect.value = "featured";
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
document.querySelectorAll("[name='category'], [name='tone']").forEach((input) => {
  input.addEventListener("change", renderProducts);
});

renderProducts();
renderCart();
