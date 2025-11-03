function Productos() {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("Todas");
  const [items, setItems] = React.useState(window.Store.getState().productos);
  React.useEffect(
    () =>
      window.Store.subscribe((e) => {
        if (e.type === "products:changed")
          setItems(window.Store.getState().productos);
      }),
    []
  );
  const list = items.filter(
    (p) =>
      (cat === "Todas" || p.categoria === cat) &&
      p.nombre.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="container py-4">
      <h4 className="mb-3">Productos</h4>
      <div className="row g-2 mb-3">
        <div className="col-8 col-sm-6">
          <input
            className="form-control"
            placeholder="Buscar"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-4 col-sm-3">
          <select
            className="form-select"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            <option>Todas</option>
            {window.Store.getState().categorias.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="row g-3">
        {list.map((p) => (
          <div className="col-6 col-sm-4 col-md-3" key={p.id}>
            <BordeProducto>
              <TarjetaProducto
                product={p}
                onAdd={(x) => window.Store.addToCart(x, 1)}
              />
            </BordeProducto>
          </div>
        ))}
      </div>
    </div>
  );
}
