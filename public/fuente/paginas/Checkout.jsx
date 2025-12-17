function Checkout() {
  const st = window.Store.getState();
  const u = window.Auth.getUser();

  const [f, setF] = React.useState({
    nombre: u?.nombre || "",
    email: u?.email || "",
    direccion: "",
    comuna: "",
    telefono: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const u2 = window.Auth.getUser();
    if (u2) {
      setF((prev) => ({
        ...prev,
        nombre: prev.nombre || u2.nombre || "",
        email: prev.email || u2.email || "",
      }));
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const stNow = window.Store.getState();
    const user = window.Auth.getUser();

    if (!stNow.cart || stNow.cart.length === 0) {
      location.hash = "#/errorcompra";
      return;
    }

    if (!user) {
      location.hash = "#/login";
      return;
    }

    setLoading(true);
    try {

      localStorage.setItem(
          "th_checkout_v1",
          JSON.stringify({
            nombre: f.nombre,
            email: f.email,
            direccion: f.direccion,
            comuna: f.comuna,
            telefono: f.telefono,
          })
      );


      location.hash = "#/pago";
    } catch (err) {
      setError(err?.message || "Error en checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container py-4">
        <h4 className="mb-3">Checkout</h4>

        {!u && (
            <div className="alert alert-warning">
              Debes iniciar sesión para pagar.{" "}
              <a href="#/login" className="alert-link">
                Ir a login
              </a>
            </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

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

            <button
                className="btn btn-primary"
                type="submit"
                disabled={loading || !u}
                title={!u ? "Debes iniciar sesión" : ""}
            >
              {loading ? "Continuando..." : "Pagar"}
            </button>
          </div>
        </form>
      </div>
  );
}
