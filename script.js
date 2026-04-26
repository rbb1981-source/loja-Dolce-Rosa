const WHATSAPP_NUMBER = "";
const MERCADO_PAGO_BACKEND_URL = "";

const products = [
  {
    id: "progressiva-organica",
    name: "Progressiva Orgânica Sem Formol 1L",
    price: 110,
    category: "Alisamento",
    image: "assets/products/progressiva.jpg",
  },
  {
    id: "kit-absolutely-soft",
    name: "Kit Absolutely Soft",
    price: 80,
    category: "Tratamento",
    image: "assets/products/kit-soft.jpg",
  },
  {
    id: "kit-absolutely-care",
    name: "Kit Absolutely Care",
    price: 50,
    category: "Tratamento",
    image: "assets/products/kit-care.jpg",
  },
  {
    id: "mascara-cronograma-500g",
    name: "Máscara Cronograma Capilar 500g",
    price: 30,
    category: "Tratamento",
    image: "assets/products/mascara-cronograma.jpg",
  },
  {
    id: "mascara-cronograma-1kg",
    name: "Máscara Cronograma Capilar 1kg",
    price: 50,
    category: "Tratamento",
    image: "assets/products/mascara-cronograma.jpg",
  },
  {
    id: "bb-cream",
    name: "BB Cream Absolute Protection",
    price: 30,
    category: "Finalização",
    image: "assets/products/bb-cream.jpg",
  },
  {
    id: "queratina",
    name: "Queratina 300ml",
    price: 20,
    category: "Tratamento",
    image: "assets/products/queratina.jpg",
  },
  {
    id: "ativador-cachos",
    name: "Ativador de Cachos Absolutely Curls 500ml",
    price: 20,
    category: "Finalização",
    image: "assets/products/ativador-cachos.jpg",
  },
  {
    id: "miracle-intensive",
    name: "Miracle Intensive 500ml",
    price: 20,
    category: "Tratamento",
    image: "assets/products/miracle.jpg",
  },
  {
    id: "superplex-keratin",
    name: "Superplex Keratin",
    price: 40,
    category: "Tratamento",
    image: "assets/products/superplex.jpg",
  },
  {
    id: "hair-botox",
    name: "Hair Botox 1kg",
    price: 60,
    category: "Alisamento",
    image: "assets/products/hair-botox.jpg",
  },
  {
    id: "gelatin-power-curls",
    name: "Gelatin Power Curls 500g",
    price: 20,
    category: "Finalização",
    image: "assets/products/gelatin-curls.jpg",
  },
  {
    id: "perfume-capilar",
    name: "Perfume Capilar",
    price: 30,
    category: "Finalização",
    image: "assets/products/perfume-capilar.jpg",
  },
];

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const productsGrid = document.querySelector("#productsGrid");
const cartPanel = document.querySelector("#cartPanel");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const checkoutButton = document.querySelector("#checkoutButton");
const checkoutNote = document.querySelector("#checkoutNote");
const paymentMethod = document.querySelector("#paymentMethod");
const categoryButtons = document.querySelectorAll(".category-card");

let activeCategory = "Todos";
let cart = JSON.parse(localStorage.getItem("dolceRosaCart") || "[]");

function saveCart() {
  localStorage.setItem("dolceRosaCart", JSON.stringify(cart));
}

function formatPrice(value) {
  return formatter.format(value);
}

function renderProducts() {
  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((product) => product.category === activeCategory);

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-info">
            <h3>${product.name}</h3>
            <div class="product-meta">
              <span class="price">${formatPrice(product.price)}</span>
              <button class="add-button" type="button" data-id="${product.id}">
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const isMercadoPago = paymentMethod.value === "Mercado Pago";

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(total);
  checkoutButton.disabled = cart.length === 0;
  checkoutButton.textContent = isMercadoPago
    ? "Pagar com Mercado Pago"
    : "Finalizar pedido no WhatsApp";
  checkoutButton.classList.toggle("is-mercado-pago", isMercadoPago);
  checkoutNote.classList.toggle("is-visible", isMercadoPago);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio. Adicione seus produtos favoritos para montar o pedido.</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h3>${item.name}</h3>
            <div class="quantity-row">
              <div class="quantity-controls" aria-label="Quantidade de ${item.name}">
                <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-action="increase" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
              </div>
              <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>
          </div>
        </div>
      `,
    )
    .join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  openCart();
}

function updateQuantity(productId, amount) {
  const item = cart.find((product) => product.id === productId);
  if (!item) return;

  item.quantity += amount;
  cart = cart.filter((product) => product.quantity > 0);
  saveCart();
  renderCart();
}

function openCart() {
  cartPanel.classList.add("is-open");
  overlay.classList.add("is-open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("is-open");
  overlay.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
}

function checkoutWhatsApp() {
  if (cart.length === 0) return;

  const lines = cart.map((item) => {
    const subtotal = formatPrice(item.price * item.quantity);
    return `• ${item.quantity}x ${item.name} - ${subtotal}`;
  });
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const selectedPayment = paymentMethod.value;
  const message = [
    "Olá! Gostaria de finalizar meu pedido Dolce Rosa Professional:",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
    `Forma de pagamento: ${selectedPayment}`,
  ].join("\n");

  const baseUrl = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}`
    : "https://wa.me/";

  window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, "_blank");
}

async function checkoutMercadoPago() {
  if (cart.length === 0) return;

  if (!MERCADO_PAGO_BACKEND_URL) {
    alert(
      "Para ativar o Mercado Pago, publique a função backend e preencha MERCADO_PAGO_BACKEND_URL no script.js.",
    );
    return;
  }

  checkoutButton.disabled = true;
  checkoutButton.textContent = "Criando pagamento...";

  try {
    const response = await fetch(`${MERCADO_PAGO_BACKEND_URL}/api/create-preference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.init_point) {
      throw new Error(data.error || "Não foi possível criar o pagamento.");
    }

    window.location.href = data.init_point;
  } catch (error) {
    alert(`Não foi possível abrir o Mercado Pago: ${error.message}`);
    renderCart();
  }
}

function handleCheckout() {
  if (paymentMethod.value === "Mercado Pago") {
    checkoutMercadoPago();
    return;
  }

  checkoutWhatsApp();
}

productsGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-button");
  if (!button) return;
  addToCart(button.dataset.id);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const amount = button.dataset.action === "increase" ? 1 : -1;
  updateQuantity(button.dataset.id, amount);
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderProducts();
  });
});

document.querySelector("#openCart").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
checkoutButton.addEventListener("click", handleCheckout);
paymentMethod.addEventListener("change", renderCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

renderProducts();
renderCart();
