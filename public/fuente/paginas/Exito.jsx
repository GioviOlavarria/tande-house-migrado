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
                console.log("=== INICIO VALIDACION ===");
                console.log("PAYMENT_API:", PAYMENT_API);
                console.log("BILLING_API:", BILLING_API);
                console.log("Hash completo:", window.location.hash);

                if (!PAYMENT_API) {
                    throw new Error("Falta window.PAYMENT_API_BASE_URL en index.html");
                }
                if (!BILLING_API) {
                    throw new Error("Falta window.BILLING_API_BASE_URL en index.html");
                }

                const token = getTokenFromHash();
                console.log("Token extraído:", token);

                if (!token) {
                    throw new Error("No llegó token desde Flow");
                }

                const url = `${PAYMENT_API}/flow/return?token=${encodeURIComponent(token)}`;
                console.log("URL completa a llamar:", url);

                const r1 = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors'
                });

                console.log("Status response:", r1.status);
                console.log("Response OK:", r1.ok);

                if (!r1.ok) {
                    const errorText = await r1.text();
                    console.error("Error response:", errorText);
                    throw new Error(`Error ${r1.status}: ${errorText}`);
                }

                const flowData = await r1.json();
                console.log("Flow data:", flowData);
                setFlow(flowData);

                const status = flowData.status;
                const commerceOrder = flowData.commerceOrder;

                if (status !== "PAID" || !commerceOrder) {
                    console.log("Pago no exitoso, redirigiendo a fallo");
                    window.location.hash = "#/fallo";
                    return;
                }

                console.log("Esperando 2 segundos antes de buscar boleta...");
                await new Promise(resolve => setTimeout(resolve, 2000));

                console.log("Buscando boleta...");
                const r2 = await fetch(`${BILLING_API}/boletas/byCommerceOrder/${encodeURIComponent(commerceOrder)}`);

                if (!r2.ok) {
                    const errorText = await r2.text();
                    throw new Error(`Error obteniendo boleta ${r2.status}: ${errorText}`);
                }

                const b = await r2.json();
                console.log("Boleta recibida:", b);
                setBoleta(b);

                window.Store.clearCart();
                console.log("=== VALIDACION EXITOSA ===");

            } catch (e) {
                console.error("=== ERROR EN VALIDACION ===");
                console.error("Error completo:", e);
                console.error("Stack:", e.stack);
                setErr(e?.message || "Error validando pago/boleta");
            } finally {
                setLoading(false);
            }
        })();
    }, [PAYMENT_API, BILLING_API]);

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
                    <h3>Compra exitosa</h3>
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
                                        <div><strong>Fecha:</strong> {new Date(boleta.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div><strong>Neto:</strong> {window.Utils.CLP(boleta.neto)}</div>
                                        <div><strong>IVA:</strong> {window.Utils.CLP(boleta.iva)}</div>
                                        <div><strong>Total:</strong> {window.Utils.CLP(boleta.total)}</div>
                                    </div>
                                </div>
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

                    <div
                        className="modal-backdrop fade show"
                        onClick={closeModal}
                    ></div>
                </div>
            )}
        </div>
    );
}