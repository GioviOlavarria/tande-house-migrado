function Checkout() {
  const st = window.Store.getState();
  const [f, setF] = React.useState({
    nombre: "",
    email: "",
    direccion: "",
    comuna: "",
    telefono: "",
  });
  const [loading, setLoading] = React.useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    if (st.cart.length === 0) {
      location.hash = "#/error?code=carrito_vacio";
      return;
    }
    setLoading(true);
    setTimeout(() => {
      let code = null;
      if ((f.email || "").toLowerCase().endsWith("@fail.com"))
        code = "tarjeta_rechazada";
      if ((f.nombre || "").toLowerCase().includes("timeout"))
        code = "red_timeout";
      if (code) {
        setLoading(false);
        location.hash = "#/error?code=" + code;
        return;
      }
      location.hash = "#/pago";
    }, 800);
  };
  return (
    <div className="container py-4">
      <h4 className="mb-3">Checkout</h4>
      <form className="row g-3" onSubmit={onSubmit}>
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            required
            className="form-control"
            value={f.nombre}
            onChange={(e) => setF({ ...f, nombre: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            required
            className="form-control"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input
            required
            className="form-control"
            value={f.direccion}
            onChange={(e) => setF({ ...f, direccion: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Comuna</label>
          <input
            required
            className="form-control"
            value={f.comuna}
            onChange={(e) => setF({ ...f, comuna: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Teléfono</label>
          <input
            required
            className="form-control"
            value={f.telefono}
            onChange={(e) => setF({ ...f, telefono: e.target.value })}
          />
        </div>
        <div className="col-12 d-flex gap-2">
          <a className="btn btn-outline-secondary" href="#/carrito">
            Volver
          </a>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Procesando..." : "Pagar"}
          </button>
        </div>
      </form>
    </div>
  );
}
