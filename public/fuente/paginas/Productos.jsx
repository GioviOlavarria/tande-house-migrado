function Productos() {
    const [q, setQ] = React.useState("");
    const [cat, setCat] = React.useState("Todas");
    const [items, setItems] = React.useState([]);
    const [categorias, setCategorias] = React.useState(["Todas"]);

    React.useEffect(() => {
        function syncFromStore() {
            const s = window.Store.getState();
            setItems(s.productos || []);
            setCategorias(s.categorias || ["Todas"]);
        }

        syncFromStore();

        const unsubscribe = window.Store.subscribe((e) => {
            if (e.type === "products:changed") {
                syncFromStore();
            }
        });

        window.Store.reloadProducts();

        return unsubscribe;
    }, []);

    const list = items.filter(
        (p) =>
            (cat === "Todas" || p.categoria === cat) &&
            p.nombre.toLowerCase().includes(q.toLowerCase())
    );

    return (
        <div className="container py-4">
            <h2 className="mb-3">Productos</h2>

            <div className="row mb-3">
                <div className="col-12 col-md-8 mb-2 mb-md-0">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <select
                        className="form-select"
                        value={cat}
                        onChange={(e) => setCat(e.target.value)}
                    >
                        {categorias.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row g-3">
                {list.map((p) => (
                    <div className="col-6 col-sm-4 col-md-3" key={p.id}>
                        <BordeProducto>
                            <TarjetaProducto producto={p} />
                        </BordeProducto>
                    </div>
                ))}

                {list.length === 0 && (
                    <div className="col-12 text-center text-muted py-5">
                        No se encontraron productos.
                    </div>
                )}
            </div>
        </div>
    );
}
