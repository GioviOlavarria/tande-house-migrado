const USER_API = window.USER_API_BASE_URL;
const PRODUCT_API = window.PRODUCT_API_BASE_URL;
const PAYMENT_API = window.PAYMENT_API_BASE_URL;
const BILLING_API = window.BILLING_API_BASE_URL;

const LS_CART = "th_cart_v1";
const LS_AUTH = "th_auth_v2";

const listeners = new Set();
const notify = (type, payload) => listeners.forEach((f) => f({ type, payload }));

const persist = {
    load(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    },
    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    },
};

const savedAuth = persist.load(LS_AUTH, null);

let state = {
    productos: [],
    categorias: ["Todas"],
    cart: persist.load(LS_CART, []),

    user: savedAuth ? savedAuth.user : null,
    token: savedAuth ? savedAuth.token : null,

    loadingProducts: false,
    errorProducts: null,
};

function authHeaders(extra = {}) {
    const headers = { ...extra };
    if (state.token) headers["Authorization"] = "Bearer " + state.token;
    return headers;
}

async function loadProductsFromApi() {
    state.loadingProducts = true;
    notify("products:loading");

    try {
        const res = await fetch(PRODUCT_API + "/products");
        if (!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();
        state.productos = Array.isArray(data) ? data : [];
        state.categorias = [
            "Todas",
            ...Array.from(
                new Set(state.productos.map((p) => p.categoria).filter(Boolean))
            ),
        ];

        state.loadingProducts = false;
        state.errorProducts = null;
        notify("products:changed", state.productos);
    } catch (e) {
        state.loadingProducts = false;
        state.errorProducts = e.message;
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
    return p && typeof p.stock === "number" ? p.stock : 0;
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
        if (!c || c === "Todas") return state.productos;
        return state.productos.filter((p) => p.categoria === c);
    },

    getOffers() {
        return state.productos.filter((p) => p.oferta);
    },

    async createProduct(prod) {
        ensureAdmin();
        const res = await fetch(PRODUCT_API + "/products", {
            method: "POST",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(prod),
        });

        if (!res.ok) throw new Error("Error creando producto");
        const saved = await res.json();

        state.productos = [...state.productos, saved];
        notify("products:changed", state.productos);
        return saved;
    },

    async updateProduct(id, patch) {
        ensureAdmin();
        const existing = state.productos.find((p) => p.id === id);
        if (!existing) throw new Error("Producto no encontrado");

        const body = { ...existing, ...patch };

        const res = await fetch(PRODUCT_API + "/products/" + id, {
            method: "PUT",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Error actualizando producto");
        const saved = await res.json();

        state.productos = state.productos.map((p) => (p.id === id ? saved : p));
        notify("products:changed", state.productos);
        return saved;
    },

    async deleteProduct(id) {
        ensureAdmin();
        const res = await fetch(PRODUCT_API + "/products/" + id, {
            method: "DELETE",
            headers: authHeaders(),
        });

        if (!res.ok) throw new Error("Error eliminando producto");

        state.productos = state.productos.filter((p) => p.id !== id);
        notify("products:changed", state.productos);
    },

    addToCart(item, qty = 1) {
        const stock = getStockFor(item.id);
        const current = state.cart.find((x) => x.id === item.id);
        const currentQty = current ? current.qty : 0;
        const desired = currentQty + qty;

        if (stock <= 0 || desired > stock) return;

        state.cart = current
            ? state.cart.map((x) => (x.id === item.id ? { ...x, qty: desired } : x))
            : [...state.cart, { ...item, qty }];

        persist.save(LS_CART, state.cart);
        notify("cart:changed", state.cart);
    },

    setQty(id, qty) {
        const stock = getStockFor(id);
        const value = qty < 1 ? 1 : qty;
        if (value > stock) return;

        state.cart = state.cart.map((x) =>
            x.id === id ? { ...x, qty: value } : x
        );

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

window.Payments = {
    async startFlowPayment() {
        if (!state.user) throw new Error("Debes iniciar sesión");
        if (!state.cart.length) throw new Error("Carrito vacío");

        const payload = {
            email: state.user.email,
            userId: state.user.id,
            cart: state.cart.map((x) => ({
                productId: x.id,
                quantity: x.qty,
            })),
        };

        const res = await fetch(PAYMENT_API + "/flow/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error("Payment API " + res.status + ": " + text);
        }

        return res.json();
    },
};

window.Auth = {
    getUser() {
        return state.user;
    },

    async login(email, password) {
        const res = await fetch(USER_API + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Credenciales inválidas");

        const data = await res.json();

        state.user = data.user;
        state.token = data.token;

        persist.save(LS_AUTH, {
            user: state.user,
            token: state.token,
        });

        notify("auth:changed", state.user);
    },

    async register(data) {
        const res = await fetch(USER_API + "/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("No se pudo registrar");

        const out = await res.json();

        state.user = out.user;
        state.token = out.token;

        persist.save(LS_AUTH, {
            user: state.user,
            token: state.token,
        });

        notify("auth:changed", state.user);
    },

    logout() {
        state.user = null;
        state.token = null;
        persist.save(LS_AUTH, null);
        notify("auth:changed", null);
    },
};
