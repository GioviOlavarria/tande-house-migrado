function Carrito() {
  const [cart, setCart] = React.useState(window.Store.getState().cart);
  React.useEffect(
    () =>
      window.Store.subscribe((e) => {
        if (e.type === "cart:changed") setCart(window.Store.getState().cart);
      }),
    []
  );
  const total = cart.reduce((a, b) => a + b.precio * b.qty, 0);
  return (
    <div className="container py-4">
      <h4 className="mb-3">Carrito</h4>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((it) => (
              <li
                key={it.id}
                className="list-group-item d-flex align-items-center"
              >
                <img
                  src={it.portada}
                  alt=""
                  width="56"
                  height="56"
                  className="me-3 rounded"
                />
                <div className="me-auto">
                  <div>
                    {it.nombre} <small className="text-muted">{it.sku}</small>
                  </div>
                  <small className="text-muted">
                    Precio: {window.Utils.CLP(it.precio)}
                  </small>
                </div>
                <input
                  type="number"
                  min="0"
                  value={it.qty}
                  onChange={(e) =>
                    window.Store.setQty(it.id, Number(e.target.value))
                  }
                  className="form-control form-control-sm me-2"
                  style={{ width: 80 }}
                />
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => window.Store.removeFromCart(it.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between align-items-center">
            <strong>Total: {window.Utils.CLP(total)}</strong>
            <a className="btn btn-success" href="#/checkout">
              Ir a Checkout
            </a>
          </div>
        </>
      )}
    </div>
  );
}
