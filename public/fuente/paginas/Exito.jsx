function Exito() {
    const [loading, setLoading] = React.useState(true);
    const [err, setErr] = React.useState("");
    const [flow, setFlow] = React.useState(null);
    const [boleta, setBoleta] = React.useState(null);

    const [showModal, setShowModal] = React.useState(true);

    const PAYMENT_API = window.PAYMENT_API_BASE_URL;
    const BILLING_API = window.BILLING_API_BASE_URL;

    function getTokenFromHash() {
        const hash = window.location.hash || "";
        const q = hash.indexOf("?");
        if (q < 0) return null;
        const qs = hash.substring(q + 1);
        const params = new URLSearchParams(qs);
        return params.get("token");
    }

    React.useEffect(() => {
        (async () => {
            try {
                if (!PAYMENT_API) throw new Error("Falta window.PAYMENT_API_BASE_URL en index.html");
                if (!BILLING_API) throw new Error("Falta window.BILLING_API_BASE_URL en index.html");

                const token = getTokenFromHash();
                if (!token) throw new Error("No llegó token desde Flow. Revisa urlReturn (debe apuntar a #/exito?token=...).");

                const r1 = await fetch(`${PAYMENT_API}/flow/return?token=${encodeURIComponent(token)}`);
                if (!r1.ok) throw new Error(await r1.text());
                const flowData = await r1.json();
                setFlow(flowData);

                const status = Number(flowData.status);
                const commerceOrder = flowData.commerceOrder || flowData.commerce_order;
                if (status !== 2 || !commerceOrder) {
                    window.location.hash = "#/fallo";
                    return;
                }

                const r2 = await fetch(`${BILLING_API}/boletas/byCommerceOrder/${encodeURIComponent(commerceOrder)}`);
                if (!r2.ok) throw new Error(await r2.text());
                const b = await r2.json();
                setBoleta(b);

                window.Store.clearCart();
            } catch (e) {
                setErr(e?.message || "Error validando pago/boleta");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const closeModal = () => setShowModal(false);

    return (
        <div className="container py-5">
            {loading && (
                <div className="text-center">
                    <h3>Validando pago...</h3>
                    <p className="text-muted">Consultando Flow y boleta.</p>
                </div>
            )}

            {!loading && err && (
                <div className="text-center">
                    <h3>Pago no validado</h3>
                    <p className="text-danger">{err}</p>
                    <a className="btn btn-outline-secondary" href="#/carrito">Volver al carrito</a>
                </div>
            )}

            {!loading && !err && (
                <div className="text-center">
                    <h3>Compra exitosa ✅</h3>
                    <p className="text-muted">Pago confirmado por Flow.</p>

                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <a className="btn btn-primary" href="#/">Volver a la tienda</a>
                        {boleta && (
                            <button className="btn btn-outline-dark" onClick={() => setShowModal(true)}>
                                Ver boleta
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Boleta */}
            {boleta && showModal && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Boleta</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>

                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div><strong>Folio:</strong> {boleta.folio}</div>
                                        <div><strong>Orden:</strong> {boleta.commerceOrder}</div>
                                        <div><strong>Fecha:</strong> {boleta.createdAt}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div><strong>Neto:</strong> {window.Utils.CLP(boleta.neto)}</div>
                                        <div><strong>IVA:</strong> {window.Utils.CLP(boleta.iva)}</div>
                                        <div><strong>Total:</strong> {window.Utils.CLP(boleta.total)}</div>
                                    </div>
                                </div>

                                {Array.isArray(boleta.items) && boleta.items.length > 0 && (
                                    <div className="mt-4">
                                        <h6>Detalle</h6>
                                        <ul className="list-group">
                                            {boleta.items.map((it, idx) => (
                                                <li key={idx} className="list-group-item d-flex justify-content-between">
                                                    <span>{it.nombre || it.productName || it.productId} × {it.quantity}</span>
                                                    <span>{it.total ? window.Utils.CLP(it.total) : ""}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}


                                {flow && (
                                    <div className="mt-4">
                                        <h6 className="text-muted">Debug Flow</h6>
                                        <pre className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(flow, null, 2)}
                    </pre>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-outline-secondary" onClick={closeModal}>
                                    Cerrar
                                </button>
                                <a className="btn btn-primary" href="#/">
                                    Seguir comprando
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* backdrop */}
                    <div
                        className="modal-backdrop fade show"
                        onClick={closeModal}
                    ></div>
                </div>
            )}
        </div>
    );
}
