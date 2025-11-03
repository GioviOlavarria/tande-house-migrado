(function () {
  const CART_KEY = "ty_cart_v1";
  const $ = (sel, root = document) => root.querySelector(sel);

  function load() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const cart = raw ? JSON.parse(raw) : [];
      return Array.isArray(cart) ? cart : [];
    } catch {
      return [];
    }
  }

  function save(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    document.dispatchEvent(
      new CustomEvent("cart:updated", { detail: { cart } })
    );
  }

  function count() {
    return load().reduce((acc, item) => acc + Number(item.qty || 0), 0);
  }

  function add(item, qty = 1) {
    const cart = load();
    const i = cart.findIndex((x) => x.id === item.id);
    if (i >= 0) cart[i].qty = Number(cart[i].qty || 0) + Number(qty);
    else cart.push({ ...item, qty: Number(qty) });
    save(cart);
  }

  function remove(id) {
    const cart = load().filter((x) => x.id !== id);
    save(cart);
  }

  function setQty(id, qty) {
    const q = Math.max(0, Number(qty));
    const cart = load();
    const item = cart.find((x) => x.id === id);
    if (!item) return;
    if (q === 0) save(cart.filter((x) => x.id !== id));
    else {
      item.qty = q;
      save(cart);
    }
  }

  function clearAll() {
    save([]);
  }

  const badge = $("#badgeCarrito");
  function updateBadge() {
    if (!badge) return;
    const n = count();
    badge.textContent = n;
    badge.style.display = n > 0 ? "inline-block" : "none";
  }
  document.addEventListener("DOMContentLoaded", updateBadge);
  document.addEventListener("cart:updated", updateBadge);

  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) {
      document.dispatchEvent(
        new CustomEvent("cart:updated", { detail: { cart: load() } })
      );
    }
  });

  window.TY_CART = { load, save, count, add, remove, setQty, clearAll };
})();
