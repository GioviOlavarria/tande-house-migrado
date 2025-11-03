(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const contCarrito = $("#carritoLista");
  const subtotalEl = $("#carritoSubtotal");
  const btnVaciar = $("#btnVaciarCarrito");

  const formatoCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

  function render() {
    if (!contCarrito) return;
    const cart = window.TY_CART?.load() || [];
    contCarrito.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item) => {
      const totalItem = Number(item.precio) * Number(item.qty);
      subtotal += totalItem;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.portada}" alt="${
        item.nombre
      }" width="56" height="56" style="object-fit:cover;border-radius:8px"></td>
        <td>${item.nombre}<br><small class="text-muted">${
        item.sku || ""
      }</small></td>
        <td>${formatoCLP.format(item.precio)}</td>
        <td style="max-width:140px;">
          <input type="number" min="0" value="${
            item.qty
          }" class="form-control form-control-sm qty-input" data-id="${
        item.id
      }">
        </td>
        <td class="fw-semibold">${formatoCLP.format(totalItem)}</td>
        <td><button class="btn btn-sm btn-outline-danger btn-remove" data-id="${
          item.id
        }">Quitar</button></td>
      `;
      contCarrito.appendChild(row);
    });

    if (subtotalEl) subtotalEl.textContent = formatoCLP.format(subtotal);
  }

  document.addEventListener("input", (e) => {
    const input = e.target.closest(".qty-input");
    if (!input || !window.TY_CART?.setQty) return;
    const id = input.getAttribute("data-id");
    const qty = Number(input.value);
    window.TY_CART.setQty(id, qty);
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-remove");
    if (!btn || !window.TY_CART?.remove) return;
    window.TY_CART.remove(btn.getAttribute("data-id"));
  });

  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (!window.TY_CART?.clearAll) return;
      if (confirm("¿Deseas vaciar el carrito?")) {
        window.TY_CART.clearAll();
      }
    });
  }

  document.addEventListener("cart:updated", render);
  document.addEventListener("DOMContentLoaded", render);
})();
