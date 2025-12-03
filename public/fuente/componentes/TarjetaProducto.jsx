function TarjetaProducto({ producto, onDetalle }) {
    const handleAdd = () => {
        window.Store.addToCart(producto, 1);
    };

    const stock = producto.stock != null ? producto.stock : 0;
    const sinStock = stock <= 0;

    return (
        <div className="col">
            <div className="card h-100 borde-producto">
                <div className="ratio ratio-4x3">
                    <img
                        src={producto.portada}
                        className="card-img-top img-producto"
                        alt={producto.nombre}
                    />
                </div>
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1 text-truncate">{producto.nombre}</h5>
                    <p className="card-text text-muted mb-1">{producto.sku}</p>
                    <p className="card-text fw-bold mb-1">
                        {window.Utils.CLP(producto.precio)}
                    </p>
                    <p className="card-text mb-2">
                        Stock:{" "}
                        <span className={sinStock ? "text-danger" : "text-success"}>
              {stock}
            </span>
                    </p>
                    <div className="mt-auto d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary btn-sm flex-grow-1"
                            type="button"
                            onClick={onDetalle}
                        >
                            Detalle
                        </button>
                        <button
                            className="btn btn-primary btn-sm flex-grow-1"
                            type="button"
                            onClick={handleAdd}
                            disabled={sinStock}
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
