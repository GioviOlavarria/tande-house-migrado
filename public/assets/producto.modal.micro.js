(function () {
  const ready = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn);

  ready(() => {
    const $ = (s, r = document) => r.querySelector(s);
    function ensureToastContainer() {
      let c = document.getElementById("th-toast-container");
      if (!c) {
        c = document.createElement("div");
        c.id = "th-toast-container";
        c.className = "toast-container position-fixed bottom-0 end-0 p-3";
        document.body.appendChild(c);
      }
      return c;
    }

    function showToast(message) {
      try {
        const container = ensureToastContainer();
        const t = document.createElement("div");
        t.className = "toast align-items-center text-bg-success border-0";
        t.role = "alert";
        t.ariaLive = "assertive";
        t.ariaAtomic = "true";
        t.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>`;
        container.appendChild(t);
        const toast = new bootstrap.Toast(t, { delay: 1800 });
        toast.show();
        t.addEventListener("hidden.bs.toast", () => t.remove());
      } catch {
        alert(message);
      }
    }
    function ensureModal() {
      const mustHave = [
        "#productoModalLabel",
        "#productoCategorias",
        "#productoPrecio",
        "#productoSku",
        "#productoDescripcion",
        "#productoDetalles",
        "#productoStock",
        "#carouselInner",
        "#btnAñadirCarro",
      ];
      let modal = $("#productoModal");
      const ok = modal && mustHave.every((sel) => $(sel, modal));
      if (ok) return modal;

      if (modal) modal.remove();
      const tpl = document.createElement("template");
      tpl.innerHTML = `
      <div class="modal fade" id="productoModal" tabindex="-1" aria-labelledby="productoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <div>
                <h5 class="modal-title" id="productoModalLabel">Nombre del Producto</h5>
                <div id="productoCategorias" class="mt-1"></div>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <div class="row g-4">
                <div class="col-lg-6">
                  <div id="productoCarousel" class="carousel slide" data-bs-ride="false">
                    <div class="carousel-inner" id="carouselInner"></div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#productoCarousel" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#productoCarousel" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Siguiente</span>
                    </button>
                  </div>
                </div>
                <div class="col-lg-6">
                  <p class="price mb-2" id="productoPrecio">$0</p>
                  <p class="text-body-secondary mb-3" id="productoSku"></p>
                  <p id="productoDescripcion">Descripción del producto</p>
                  <ul class="list-group mb-3" id="productoDetalles"></ul>
                  <div class="d-flex gap-2">
                    <button class="btn btn-primary" id="btnAñadirCarro" data-add-to-cart>Agregar al Carrito</button>
                    <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Seguir viendo</button>
                  </div>
                  <small class="d-block mt-3 text-muted">Stock: <span id="productoStock">—</span></small>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <small class="text-muted">TandeHouse</small>
            </div>
          </div>
        </div>
      </div>`.trim();
      document.body.appendChild(tpl.content);
      return $("#productoModal");
    }

    const clp = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });
    const parseJSON = (el, attr, fb) => {
      const raw = el.getAttribute(attr);
      if (!raw) return fb;
      try {
        return JSON.parse(raw);
      } catch {
        return fb;
      }
    };

    document.addEventListener(
      "click",
      (e) => {
        const t = e.target.closest("[data-product]");
        if (!t) return;

        if (t.tagName === "A") e.preventDefault();

        const modalEl = ensureModal();
        const Modal = window.bootstrap?.Modal;
        if (!Modal || !modalEl) {
          console.warn("Bootstrap Modal no disponible o modal no creado.");
          return;
        }

        const prod = {
          id: t.getAttribute("data-id"),
          nombre: t.getAttribute("data-name"),
          precio: Number(t.getAttribute("data-price") || 0),
          sku: t.getAttribute("data-sku") || "",
          stock: t.getAttribute("data-stock") || "—",
          portada: t.getAttribute("data-image") || "",
          categorias: parseJSON(t, "data-categories", []),
          descripcion: t.getAttribute("data-description") || "",
          imagenes: parseJSON(t, "data-images", []),
          detalles: parseJSON(t, "data-details", {}),
        };

        const lblTitulo = $("#productoModalLabel", modalEl);
        const contCategorias = $("#productoCategorias", modalEl);
        const pPrecio = $("#productoPrecio", modalEl);
        const pSku = $("#productoSku", modalEl);
        const pDesc = $("#productoDescripcion", modalEl);
        const ulDetalles = $("#productoDetalles", modalEl);
        const spanStock = $("#productoStock", modalEl);
        const carouselInner = $("#carouselInner", modalEl);
        const btnCarro = $("#btnAñadirCarro", modalEl);

        if (lblTitulo) lblTitulo.textContent = prod.nombre || "Producto";
        if (pPrecio) pPrecio.textContent = clp.format(prod.precio || 0);
        if (pSku) pSku.textContent = prod.sku ? `Código: ${prod.sku}` : "";
        if (pDesc) pDesc.textContent = prod.descripcion || "";
        if (spanStock) spanStock.textContent = prod.stock;

        if (contCategorias) {
          contCategorias.innerHTML = (prod.categorias || [])
            .map(
              (c) =>
                `<span class="badge text-bg-secondary me-1 rounded-pill">${c}</span>`
            )
            .join("");
        }
        if (ulDetalles) {
          ulDetalles.innerHTML = "";
          Object.entries(prod.detalles || {}).forEach(([k, v]) => {
            const li = document.createElement("li");
            li.className =
              "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `<span>${k}</span><span class="fw-semibold">${v}</span>`;
            ulDetalles.appendChild(li);
          });
        }
        if (carouselInner) {
          carouselInner.innerHTML = "";
          (prod.imagenes || []).forEach((src, i) => {
            const div = document.createElement("div");
            div.className = `carousel-item${i === 0 ? " active" : ""}`;
            div.innerHTML = `<img src="${src}" class="d-block w-100" alt="${
              prod.nombre
            } imagen ${i + 1}" loading="lazy">`;
            carouselInner.appendChild(div);
          });
        }

        if (btnCarro) {
          btnCarro.onclick = () => {
            if (window.TY_CART?.add) {
              window.TY_CART.add(
                {
                  id: prod.id,
                  nombre: prod.nombre,
                  precio: prod.precio,
                  sku: prod.sku,
                  portada: prod.portada,
                },
                1
              );
              
              showToast("Producto agregado correctamente");
            }
          };
        }

        new Modal(modalEl).show();
      },
      true
    );
  });
})();
