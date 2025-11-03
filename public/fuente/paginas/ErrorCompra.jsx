function ErrorCompra() {
  const [h, setH] = React.useState(window.Router.current());
  React.useEffect(() => {
    const f = () => setH(window.Router.current());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  const q = h.split("?")[1] || "";
  const params = Object.fromEntries(new URLSearchParams(q));
  const code = (params.code || "desconocido").toLowerCase();
  const map = {
    tarjeta_rechazada: {
      t: "Pago rechazado",
      m: "Revisa los datos o intenta otro medio.",
    },
    sin_fondos: {
      t: "Fondos insuficientes",
      m: "Prueba otra tarjeta o método.",
    },
    cvv_invalido: { t: "CVV inválido", m: "Verifica el código de seguridad." },
    tresds_fallido: {
      t: "3-D Secure fallido",
      m: "Completa la verificación bancaria.",
    },
    red_timeout: {
      t: "Tiempo de espera agotado",
      m: "Reintenta en unos segundos.",
    },
    stock: { t: "Sin stock", m: "Un artículo se agotó." },
    carrito_vacio: {
      t: "Carrito vacío",
      m: "Agrega productos antes de pagar.",
    },
    sistema: { t: "Error del sistema", m: "Intenta más tarde." },
    desconocido: {
      t: "No se pudo completar el pago",
      m: "Reintenta o contáctanos.",
    },
  };
  const info = map[code] || map.desconocido;
  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <div className="text-center mb-4">
        <i className="bi bi-x-circle text-danger" style={{ fontSize: 64 }}></i>
        <h3 className="mt-3">{info.t}</h3>
        <p className="text-muted mb-1">{info.m}</p>
        <small className="text-muted">Código: {code}</small>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <h6 className="mb-2">Qué puedes hacer</h6>
          <ul className="mb-0">
            <li>Verifica los datos y vuelve a intentar.</li>
            <li>Prueba otro método de pago.</li>
            <li>Si persiste, contáctanos indicando el código.</li>
          </ul>
        </div>
      </div>
      <div className="d-flex gap-2 justify-content-center">
        <a className="btn btn-primary" href="#/checkout">
          Reintentar pago
        </a>
        <a className="btn btn-outline-secondary" href="#/carrito">
          Volver al carrito
        </a>
        <a className="btn btn-outline-dark" href="#/contacto">
          Contacto
        </a>
      </div>
    </div>
  );
}
