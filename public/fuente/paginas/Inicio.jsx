function Inicio() {
  const [items, setItems] = React.useState(
    window.Store.getState().productos.slice(0, 8)
  );
  React.useEffect(
    () =>
      window.Store.subscribe((e) => {
        if (e.type === "products:changed")
          setItems(window.Store.getState().productos.slice(0, 8));
      }),
    []
  );
  return (
    <div className="container py-4">
      <div className="mb-4 text-center">
        <img
          src="assets/nosotros.gif"
          alt=""
          style={{ maxWidth: "100%", borderRadius: "1rem" }}
        />
      </div>
      <h4 className="mb-3">Novedades</h4>
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
