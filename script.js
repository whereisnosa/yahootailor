const PRODUCTS = {
  "classic-tee": {name:"Classic Logo Tee", price:15000, image:"image-tee", description:"Oversized T-Shirt · Black"},
  "tailor-cap": {name:"Tailor Cap", price:7500, image:"image-cap", description:"Adjustable Cap · Forest"},
  "good-things-tee": {name:"Good Things Tee", price:15000, image:"image-good-tee", description:"Graphic T-Shirt · Bone"},
  "utility-cargo": {name:"Utility Cargo Pants", price:28000, image:"image-cargo", description:"Relaxed Fit · Black"}
};
const money = amount => new Intl.NumberFormat("en-NG", {style:"currency",currency:"NGN",maximumFractionDigits:0}).format(amount);
let cart = {};
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const toast = message => {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2300);
};
function addToCart(id) {
  if (!PRODUCTS[id]) return;
  cart[id] = (cart[id] || 0) + 1;
  renderCart(); toast(`${PRODUCTS[id].name} added to your cart.`);
}
function changeQuantity(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}
function cartQuantity(){ return Object.values(cart).reduce((sum,qty)=>sum+qty,0); }
function renderCart() {
  const qty = cartQuantity();
  $("#cart-count").textContent = qty;
  $("#drawer-count").textContent = `(${qty})`;
  const entries = Object.entries(cart);
  $("#cart-items").innerHTML = entries.length ? entries.map(([id,qty]) => {
    const p = PRODUCTS[id];
    return `<div class="cart-line">
      <div class="cart-thumb ${p.image}"></div>
      <div><h3>${p.name}</h3><p>${p.description}</p>
        <div class="qty-control"><button data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Increase quantity">+</button></div>
        <button class="remove-item" data-remove="${id}">Remove</button>
      </div><strong class="line-price">${money(p.price*qty)}</strong>
    </div>`;
  }).join("") : `<div class="empty-cart"><span>YOUR CART IS EMPTY.</span><p>Find something that fits.</p><button class="button button-dark" id="continue-shopping">Explore the drop ↗</button></div>`;
  $("#cart-summary").hidden = !entries.length;
  $("#cart-subtotal").textContent = money(entries.reduce((sum,[id,count])=>sum+PRODUCTS[id].price*count,0));
}
function openCart() {
  $("#cart-drawer").classList.add("active"); $("#cart-backdrop").classList.add("active");
  $("#cart-drawer").setAttribute("aria-hidden","false"); document.body.classList.add("locked");
}
function closeCart() {
  $("#cart-drawer").classList.remove("active"); $("#cart-backdrop").classList.remove("active");
  $("#cart-drawer").setAttribute("aria-hidden","true"); document.body.classList.remove("locked");
}
function openQuote(){ $("#quote-modal").classList.add("active"); $("#quote-modal").setAttribute("aria-hidden","false"); document.body.classList.add("locked"); }
function closeQuote(){ $("#quote-modal").classList.remove("active"); $("#quote-modal").setAttribute("aria-hidden","true"); document.body.classList.remove("locked"); }
document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);
  const qty = event.target.closest("[data-qty]");
  if (qty) changeQuantity(qty.dataset.qty, Number(qty.dataset.delta));
  const remove = event.target.closest("[data-remove]");
  if (remove) { delete cart[remove.dataset.remove]; renderCart(); }
  if (event.target.closest("#continue-shopping")) closeCart();
});
$("#cart-open").addEventListener("click", openCart);
$("#cart-close").addEventListener("click", closeCart);
$("#cart-backdrop").addEventListener("click", closeCart);
$("#checkout-button").addEventListener("click", () => {
  const lines = Object.entries(cart).map(([id,qty])=>`${PRODUCTS[id].name} x ${qty} — ${money(PRODUCTS[id].price*qty)}`).join("\n");
  const total = Object.entries(cart).reduce((sum,[id,qty])=>sum+PRODUCTS[id].price*qty,0);
  const message = `Hi Yahoo Tailor, I'd like to enquire about this order:\n\n${lines}\n\nSubtotal: ${money(total)}\n\nPlease confirm sizes, availability, delivery fee and payment details.`;
  // Replace the placeholder number below with the business WhatsApp number in international format.
  const whatsappNumber = "";
  if (whatsappNumber) window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  else {
    navigator.clipboard?.writeText(message).then(()=>toast("Order summary copied. Add your WhatsApp number in script.js to enable direct ordering.")).catch(()=>toast("Add your WhatsApp number in script.js to enable direct ordering."));
  }
});
$("#quote-open").addEventListener("click", openQuote);
$("#contact-quote").addEventListener("click", event => { event.preventDefault(); openQuote(); });
$("#quote-close").addEventListener("click", closeQuote);
$("#quote-modal").addEventListener("click", event => { if(event.target === $("#quote-modal")) closeQuote(); });
$("#quote-form").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `YAHOO TAILOR — CUSTOM ORDER ENQUIRY\nName: ${data.get("name")}\nContact: ${data.get("contact")}\nOrder type: ${data.get("type")}\nQuantity: ${data.get("quantity")}\nDetails: ${data.get("details") || "Not provided"}`;
  navigator.clipboard?.writeText(message).then(()=>toast("Enquiry copied. Paste it into your email or WhatsApp.")).catch(()=>toast("Enquiry prepared. Copy the details before closing."));
  closeQuote();
  event.currentTarget.reset();
});
$("#menu-toggle").addEventListener("click", () => $("#mobile-nav").classList.toggle("active"));
$$(".mobile-nav a").forEach(link=>link.addEventListener("click",()=>$("#mobile-nav").classList.remove("active")));
$("#search-toggle").addEventListener("click",()=>{ $("#search-bar").classList.toggle("active"); if($("#search-bar").classList.contains("active")) $("#search-input").focus(); });
$("#search-close").addEventListener("click",()=>{ $("#search-bar").classList.remove("active"); $("#search-input").value=""; filterProducts(""); });
function filterProducts(term) {
  const query = term.trim().toLowerCase(); let visible=0;
  $$(".product-card").forEach(card=>{
    const categoryMatch = typeof activeCategory === "undefined" || activeCategory === "all" || card.dataset.category === activeCategory;
    const match = categoryMatch && `${card.dataset.name} ${card.dataset.category} ${card.textContent}`.toLowerCase().includes(query);
    card.hidden = !match; if(match) visible++;
  });
  if($("#product-result-count")) $("#product-result-count").textContent = `${String(visible).padStart(2,"0")} PRODUCT${visible===1?"":"S"}`;
  if($("#no-results")) $("#no-results").hidden = visible !== 0;
}
$("#search-input").addEventListener("input", event => { filterProducts(event.target.value); $("#shop").scrollIntoView({behavior:"smooth",block:"start"}); });
document.addEventListener("keydown", event => { if(event.key==="Escape"){closeCart();closeQuote();$("#search-bar").classList.remove("active");$("#mobile-nav").classList.remove("active");} });
$("#year").textContent = new Date().getFullYear();
renderCart();

// Shop-page category filters (also harmless on the landing page).
let activeCategory = "all";
function applyShopFilters() {
  const query = $("#search-input") ? $("#search-input").value.trim().toLowerCase() : "";
  let visible = 0;
  $$(".product-card").forEach(card => {
    const categoryMatch = activeCategory === "all" || card.dataset.category === activeCategory;
    const textMatch = `${card.dataset.name} ${card.dataset.category} ${card.textContent}`.toLowerCase().includes(query);
    const match = categoryMatch && textMatch;
    card.hidden = !match; if (match) visible++;
  });
  if ($("#product-result-count")) $("#product-result-count").textContent = `${String(visible).padStart(2,"0")} PRODUCT${visible===1?"":"S"}`;
  if ($("#no-results")) $("#no-results").hidden = visible !== 0;
}
$$("[data-filter]").forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.filter;
  $$("[data-filter]").forEach(chip => chip.classList.toggle("active", chip === button));
  applyShopFilters();
}));
