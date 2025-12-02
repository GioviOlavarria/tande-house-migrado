function PasarelaPago() {
    const state = window.Store.getState();
    const total = state.cart.reduce((acc, item) => acc + item.precio * item.qty, 0);

    const handleExito = () => {
        window.Store.clearCart();
        location.hash = "#/exito";
    };

    const handleFallo = () => {
        location.hash = "#/fallo";
    };

    const handleError = () => {
        location.hash = "#/errorcompra";
    };

    return (
        <div className="container py-4" style={{ maxWidth: 720 }}>
            <h3 className="mb-3">Pasarela de pago</h3>
            <p className="text-muted">
                Esta es una simulación de pasarela de pago. Selecciona una opción para continuar.
            </p>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Resumen de compra</h5>
                    <ul className="list-group list-group-flush mb-3">
                        {state.cart.map((item) => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between">
                <span>
                  {item.nombre} × {item.qty}
                </span>
                                <span>{window.Utils.CLP(item.precio * item.qty)}</span>
                            </li>
                        ))}
                        <li className="list-group-item d-flex justify-content-between fw-bold">
                            <span>Total</span>
                            <span>{window.Utils.CLP(total)}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <h5 className="mb-3">Método de pago</h5>
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <button className="btn btn-outline-primary w-100" type="button">
                        Transbank (simulado)
                    </button>
                </div>
                <div className="col-12 col-md-4">
                    <button className="btn btn-outline-secondary w-100" type="button">
                        Ventipay (simulado)
                    </button>
                </div>
                <div className="col-12 col-md-4">
                    <button className="btn btn-outline-dark w-100" type="button">
                        Otra tarjeta (simulado)
                    </button>
                </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-success" type="button" onClick={handleExito}>
                    Simular pago exitoso
                </button>
                <button className="btn btn-warning" type="button" onClick={handleFallo}>
                    Simular pago rechazado
                </button>
                <button className="btn btn-danger" type="button" onClick={handleError}>
                    Simular error en pago
                </button>
                <a href="#/checkout" className="btn btn-outline-secondary ms-auto">
                    Volver al checkout
                </a>
            </div>
        </div>
    );
}
