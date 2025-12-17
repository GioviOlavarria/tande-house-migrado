function Fallo() {
    return (
        <div className="container py-5 text-center">
            <h3>No se pudo realizar el pago.</h3>
            <p className="text-muted">
                El pago no fue confirmado por Flow o ocurrió un problema al validar.
            </p>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
                <a className="btn btn-outline-secondary" href="#/carrito">
                    Volver al carrito
                </a>
                <a className="btn btn-primary" href="#/checkout">
                    Intentar nuevamente
                </a>
            </div>
        </div>
    );
}
