function PasarelaPago() {
    const state = window.Store.getState();
    const total = state.cart.reduce((acc, item) => acc + item.precio * item.qty, 0);
    const [error, setError] = React.useState(null);
    const [processing, setProcessing] = React.useState(false);

    const pagarConFlow = async () => {
        setError(null);
        setProcessing(true);
        try {
            const data = await window.Payments.startFlowPayment();

            if (!data.url || data.url === "undefined" || data.url === "null" || data.url.includes("undefined")) {
                throw new Error("URL de pago inválida recibida del servidor");
            }

            window.location.href = data.url;

        } catch (e) {
            setProcessing(false);
            setError(e.message || "No se pudo iniciar el pago con Flow");
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 720 }}>
            <h3 className="mb-3">Pasarela de pago</h3>
            <p className="text-muted">
                Serás redirigido a Flow para completar el pago real.
            </p>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Resumen de compra</h5>
                    <ul className="list-group list-group-flush mb-3">
                        {state.cart.map((item) => (
                            <li
                                key={item.id}
                                className="list-group-item d-flex justify-content-between"
                            >
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
                    {error && <div className="alert alert-danger mb-0">{error}</div>}
                </div>
            </div>

            <h5 className="mb-3">Método de pago</h5>

            <div className="d-flex flex-wrap gap-2">
                <button
                    className="btn btn-success"
                    type="button"
                    onClick={pagarConFlow}
                    disabled={processing}
                >
                    {processing ? "Redirigiendo a Flow..." : "Pagar con Flow"}
                </button>

                <a href="#/checkout" className="btn btn-outline-secondary ms-auto">
                    Volver al checkout
                </a>
            </div>
        </div>
    );
}
