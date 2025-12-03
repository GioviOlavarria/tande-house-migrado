function AdminProductos() {
    const initialForm = {
        id: "",
        nombre: "",
        precio: "",
        portada: "",
        categoria: "",
        oferta: false,
        sku: "",
        stock: "",
    };

    const user = window.Auth.getUser();
    const isAdmin = user && user.admin;

    const [form, setForm] = React.useState(initialForm);
    const [productos, setProductos] = React.useState(() => window.Store.getState().productos);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState("");

    React.useEffect(() => {
        const unsub = window.Store.subscribe((action) => {
            if (action.type === "products:changed") {
                const st = window.Store.getState();
                setProductos(st.productos);
            }
        });
        window.Store.reloadProducts();
        return unsub;
    }, []);

    if (!isAdmin) {
        return (
            <div className="container py-4">
                <h3 className="mb-3">Administrar productos</h3>
                <div className="alert alert-danger">
                    Solo un usuario administrador puede acceder a esta sección.
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result;
            setForm((prev) => ({
                ...prev,
                portada: dataUrl,
            }));
            setImagePreview(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setImagePreview("");
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
                stock: form.stock === "" ? 0 : parseInt(form.stock || "0", 10),
            };
            if (editingId) {
                await window.Store.updateProduct(editingId, payload);
            } else {
                await window.Store.createProduct(payload);
            }
            resetForm();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message || "Error al guardar producto");
        }
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setForm({
            id: p.id,
            nombre: p.nombre || "",
            precio: p.precio != null ? String(p.precio) : "",
            portada: p.portada || "",
            categoria: p.categoria || "",
            oferta: !!p.oferta,
            sku: p.sku || "",
            stock: p.stock != null ? String(p.stock) : "",
        });
        setImagePreview(p.portada || "");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este producto?")) {
            return;
        }
        try {
            await window.Store.deleteProduct(id);
            if (editingId === id) {
                resetForm();
            }
        } catch (err) {
            setError(err.message || "Error al eliminar producto");
        }
    };

    return (
        <div className="container py-4">
            <h3 className="mb-3">Administrar productos</h3>
            <div className="row g-4">
                <div className="col-12 col-lg-5 col-xl-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                {editingId ? "Editar producto" : "Nuevo producto"}
                            </h5>
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
                                    <label className="form-label">
                                        Imagen (subir archivo o usar URL)
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control mb-1"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="portada"
                                        value={form.portada}
                                        onChange={handleChange}
                                        placeholder="assets/cartas/nueva-carta.jpg o data:image/..."
                                    />
                                </div>
                                {imagePreview && (
                                    <div className="col-12">
                                        <div className="border rounded p-2 text-center">
                                            <img
                                                src={imagePreview}
                                                alt="Vista previa"
                                                style={{ maxWidth: "100%", maxHeight: 160, objectFit: "contain" }}
                                            />
                                        </div>
                                    </div>
                                )}
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
                                <div className="col-12">
                                    <label className="form-label">Stock</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="stock"
                                        value={form.stock}
                                        onChange={handleChange}
                                        min="0"
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
                                    {editingId && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary me-2"
                                            onClick={resetForm}
                                        >
                                            Cancelar edición
                                        </button>
                                    )}
                                    <button className="btn btn-primary ms-auto" type="submit" disabled={loading}>
                                        {loading
                                            ? "Guardando..."
                                            : editingId
                                                ? "Guardar cambios"
                                                : "Guardar producto"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-7 col-xl-8">
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
                                        <th>Stock</th>
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
                                            <td>{p.stock != null ? p.stock : 0}</td>
                                            <td>{p.oferta ? "Sí" : "No"}</td>
                                            <td className="text-end">
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        type="button"
                                                        onClick={() => handleEdit(p)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        type="button"
                                                        onClick={() => handleDelete(p.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {productos.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center py-3">
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
