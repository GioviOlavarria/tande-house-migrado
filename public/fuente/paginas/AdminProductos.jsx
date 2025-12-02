function AdminProductos() {
    const initialForm = {
        id: "",
        nombre: "",
        precio: "",
        portada: "",
        categoria: "",
        oferta: false,
        sku: "",
    };

    const [form, setForm] = React.useState(initialForm);
    const [productos, setProductos] = React.useState(() => window.Store.getState().productos);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const unsub = window.Store.subscribe((action) => {
            if (action.type === "products:changed") {
                setProductos(window.Store.getState().productos);
            }
        });
        window.Store.reloadProducts();
        return unsub;
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const payload = {
                id: form.id || null,
                nombre: form.nombre,
                precio: parseInt(form.precio || "0", 10),
                portada: form.portada,
                categoria: form.categoria,
                oferta: !!form.oferta,
                sku: form.sku,
            };
            await window.Store.createProduct(payload);
            setForm(initialForm);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message || "Error al crear producto");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este producto?")) {
            return;
        }
        try {
            await window.Store.deleteProduct(id);
        } catch (err) {
            setError(err.message || "Error al eliminar producto");
        }
    };

    return (
        <div className="container py-4">
            <h3 className="mb-3">Administrar productos</h3>
            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Nuevo producto</h5>
                            <form className="row g-2" onSubmit={handleSubmit}>
                                <div className="col-12">
                                    <label className="form-label">ID (opcional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="id"
                                        value={form.id}
                                        onChange={handleChange}
                                        placeholder="p10"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Precio</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="precio"
                                        value={form.precio}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Portada</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="portada"
                                        value={form.portada}
                                        onChange={handleChange}
                                        placeholder="assets/cartas/nueva-carta.jpg"
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Categoría</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="categoria"
                                        value={form.categoria}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">SKU</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="sku"
                                        value={form.sku}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="ofertaCheck"
                                        name="oferta"
                                        checked={form.oferta}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="ofertaCheck">
                                        En oferta
                                    </label>
                                </div>
                                {error && (
                                    <div className="col-12">
                                        <div className="alert alert-danger">{error}</div>
                                    </div>
                                )}
                                <div className="col-12 d-flex">
                                    <button className="btn btn-primary ms-auto" type="submit" disabled={loading}>
                                        {loading ? "Guardando..." : "Guardar producto"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Listado de productos</h5>
                            <div className="table-responsive">
                                <table className="table table-sm align-middle">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Categoría</th>
                                        <th>Oferta</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {productos.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.nombre}</td>
                                            <td>{window.Utils.CLP(p.precio)}</td>
                                            <td>{p.categoria}</td>
                                            <td>{p.oferta ? "Sí" : "No"}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    type="button"
                                                    onClick={() => handleDelete(p.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {productos.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-3">
                                                No hay productos
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
