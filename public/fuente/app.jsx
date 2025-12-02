function App() {
  const [route, setRoute] = React.useState(() => window.Router.current());

  React.useEffect(() => {
    const stop = window.Router.listen((r) => {
      setRoute(r);
      window.scrollTo(0, 0);
    });
    return stop;
  }, []);

  let Page = Inicio;

  switch (route.path) {
    case "/":
      Page = Inicio;
      break;
    case "/productos":
      Page = Productos;
      break;
    case "/categorias":
      Page = Categorias;
      break;
    case "/ofertas":
      Page = Ofertas;
      break;
    case "/carrito":
      Page = Carrito;
      break;
    case "/checkout":
      Page = Checkout;
      break;
    case "/exito":
      Page = Exito;
      break;
    case "/fallo":
      Page = Fallo;
      break;
    case "/errorcompra":
      Page = ErrorCompra;
      break;
    case "/sobre":
      Page = Sobre;
      break;
    case "/blog":
      Page = Blog;
      break;
    case "/blogdetalle":
      Page = BlogDetalle;
      break;
    case "/contacto":
      Page = Contacto;
      break;
    case "/login":
      Page = Login;
      break;
    case "/registro":
      Page = Registro;
      break;
    case "/detalle":
      Page = Detalle;
      break;
    case "/pago":
      Page = PasarelaPago;
      break;
    case "/admin":
      Page = AdminProductos;
      break;
    default:
      Page = Inicio;
      break;
  }

  return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Page route={route} />
        </main>
        <Footer />
      </div>
  );
}
