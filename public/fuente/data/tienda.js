const API_BASE =
    window.API_BASE_URL ||
    "https://tande-house-backend-production.up.railway.app/api";

const LS_CART = "th_cart_v1";
const LS_USER = "th_user_v1";

const listeners = new Set();
const notify = (type, payload) => listeners.forEach((f) => f({ type, payload }));

const persist = {
    load(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    },
    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {}
    },
};

let state = {
    productos: [],
    categorias: ["Todas"],
    cart: persist.load(LS_CART, []),
    user: persist.load(LS_USER, null),
    loadingProducts: false,
    errorProducts: null,
};

async function loadProductsFromApi() {
    state.loadingProducts = true;
    notify("products:loading");
    try {
        const res = await fetch(API_BASE + "/products");
        if (!res.ok) {
            throw new Error("Error HTTP " + res.status);
        }
        const data = await res.json();
        state.productos = data;
        state.categorias = [
            "Todas",
            ...Array.from(new Set(data.map((p) => p.categoria))),
        ];
        state.loadingProducts = false;
        state.errorProducts = null;
        notify("products:changed", state.productos);
    } catch (e) {
        state.loadingProducts = false;
        state.errorProducts = e.message;
        if (window.SEED && window.SEED.productos) {
            state.productos = window.SEED.productos;
            state.categorias = ["Todas", ...window.SEED.categorias];
            notify("products:changed", state.productos);
        }
    }
}

loadProductsFromApi();

function ensureAdmin() {
    if (!state.user || !state.user.admin) {
        throw new Error("Solo un administrador puede realizar esta acción");
    }
}

function getStockFor(id) {
    const p = state.productos.find((x) => x.id === id);
    if (!p) return 0;
    return typeof p.stock === "number" ? p.stock : 0;
}

window.Utils = {
    CLP(n) {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
        }).format(n);
    },
};

window.Store = {
    subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },
    getState() {
        return JSON.parse(JSON.stringify(state));
    },
    reloadProducts() {
        return loadProductsFromApi();
    },
    getByCategory(c) {
        if (!c || c === "Todas") {
            return state.productos;
        }
        return state.productos.filter((p) => p.categoria === c);
    },
    getOffers() {
        return state.productos.filter((p) => p.oferta);
    },
    async createProduct(prod) {
        ensureAdmin();
        const res = await fetch(API_BASE + "/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prod),
        });
        if (!res.ok) {
            throw new Error("Error creando producto");
        }
        const saved = await res.json();
        state.productos = [...state.productos, saved];
        notify("products:changed", state.productos);
        return saved;
    },
    async updateProduct(id, patch) {
        ensureAdmin();
        const existing = state.productos.find((p) => p.id === id);
        if (!existing) {
            throw new Error("Producto no encontrado");
        }
        const body = { ...existing, ...patch };
        const res = await fetch(API_BASE + "/products/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            throw new Error("Error actualizando producto");
        }
        const saved = await res.json();
        state.productos = state.productos.map((p) => (p.id === id ? saved : p));
        notify("products:changed", state.productos);
        return saved;
    },
    async deleteProduct(id) {
        ensureAdmin();
        const res = await fetch(API_BASE + "/products/" + id, {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error("Error eliminando producto");
        }
        state.productos = state.productos.filter((p) => p.id !== id);
        notify("products:changed", state.productos);
    },
    addToCart(item, qty = 1) {
        const stock = getStockFor(item.id);
        const current = state.cart.find((x) => x.id === item.id);
        const currentQty = current ? current.qty : 0;
        const desired = currentQty + qty;

        if (stock <= 0) {
            alert("Este producto está AGOTADO.");
            return;
        }
        if (desired > stock) {
            alert("No hay stock suficiente para este producto.");
            return;
        }
        if (current) {
            state.cart = state.cart.map((x) =>
                x.id === item.id ? { ...x, qty: desired } : x
            );
        } else {
            state.cart = [...state.cart, { ...item, qty }];
        }
        persist.save(LS_CART, state.cart);
        notify("cart:changed", state.cart);
    },
    setQty(id, qty) {
        const stock = getStockFor(id);
        const value = qty < 1 ? 1 : qty;
        if (stock > 0 && value > stock) {
            alert("No hay stock suficiente.");
            return;
        }
        state.cart = state.cart.map((x) => (x.id === id ? { ...x, qty: value } : x));
        persist.save(LS_CART, state.cart);
        notify("cart:changed", state.cart);
    },
    removeFromCart(id) {
        state.cart = state.cart.filter((x) => x.id !== id);
        persist.save(LS_CART, state.cart);
        notify("cart:changed", state.cart);
    },
    clearCart() {
        state.cart = [];
        persist.save(LS_CART, state.cart);
        notify("cart:changed", state.cart);
    },
};

window.Auth = {
    getUser() {
        return state.user;
    },
    async login(email, password) {
        const res = await fetch(API_BASE + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            throw new Error("Credenciales inválidas");
        }
        const user = await res.json();
        state.user = user;
        persist.save(LS_USER, user);
        notify("auth:changed", user);
    },
    async register(data) {
        const res = await fetch(API_BASE + "/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            throw new Error("No se pudo registrar");
        }
        const user = await res.json();
        state.user = user;
        persist.save(LS_USER, user);
        notify("auth:changed", user);
    },
    logout() {
        state.user = null;
        persist.save(LS_USER, null);
        notify("auth:changed", null);
    },
};
