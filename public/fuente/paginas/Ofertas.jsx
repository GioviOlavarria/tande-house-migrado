function Ofertas() {
  const [items, setItems] = React.useState(window.Store.getOffers());
  React.useEffect(
    () =>
      window.Store.subscribe((e) => {
        if (e.type === "products:changed") setItems(window.Store.getOffers());
      }),
    []
  );
  return (
    <div className="container py-4">
      <h4 className="mb-3">Ofertas</h4>
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
