function App() {
  const route = (h) => {
    const cleanPath = h.split('?')[0];

    if (cleanPath.startsWith("/producto/")) {
      return React.createElement(ModalProducto ? React.Fragment : Detalle);
    }
    if (cleanPath.startsWith("/blog/")) {
      return React.createElement(BlogDetalle);
    }
    if (cleanPath.startsWith("/error")) {
      return React.createElement(ErrorCompra);
    }

    switch (cleanPath) {
      case "/":
        return React.createElement(Inicio);
      case "/productos":
        return React.createElement(Productos);
      case "/categorias":
        return React.createElement(Categorias);
      case "/ofertas":
        return React.createElement(Ofertas);
      case "/carrito":
        return React.createElement(Carrito);
      case "/checkout":
        return React.createElement(Checkout);
      case "/exito":
        return React.createElement(Exito);
      case "/payment-success":
        return React.createElement(PaymentSuccess);
      case "/fallo":
        return React.createElement(Fallo);
      case "/sobre":
        return React.createElement(Sobre);
      case "/blog":
        return React.createElement(Blog);
      case "/contacto":
        return React.createElement(Contacto);
      case "/login":
        return React.createElement(Login);
      case "/registro":
        return React.createElement(Registro);
      case "/pago":
        return React.createElement(PasarelaPago);
      case "/admin":
        return React.createElement(AdminProductos);
      default:
        return React.createElement(Inicio);
    }
  };

  const [current, setCurrent] = React.useState(window.Router.current());

  React.useEffect(() => {
    const onHash = () => setCurrent(window.Router.current());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return React.createElement(
      React.Fragment,
      null,
      React.createElement(Navbar),
      route(current),
      React.createElement(Footer),
      React.createElement(ModalProducto)
  );
}