function Categorias() {
  const cats = window.Store.getState().categorias;
  const [current, setCurrent] = React.useState(cats[0]);
  const [items, setItems] = React.useState(window.Store.getByCategory(current));
  React.useEffect(
    () =>
      window.Store.subscribe((e) => {
        if (e.type === "products:changed")
          setItems(window.Store.getByCategory(current));
      }),
    [current]
  );
  return (
    <div className="container py-4">
      <h4 className="mb-3">Categorías</h4>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {cats.map((c) => (
          <button
            key={c}
            className={
              "btn " + (c === current ? "btn-primary" : "btn-outline-primary")
            }
            onClick={() => {
              setCurrent(c);
              setItems(window.Store.getByCategory(c));
            }}
          >
            {c}
          </button>
        ))}
        <a className="btn btn-outline-secondary ms-auto" href="#/productos">
          Ver todos
        </a>
      </div>
      <div className="row g-3">
        {items.map((p) => (
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
