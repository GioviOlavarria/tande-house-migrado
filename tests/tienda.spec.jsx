function App() {
  const route = (h) => {
    switch (h) {
      case "/":
        return <Inicio />;
      case "/productos":
        return <Productos />;
      case "/categorias":
        return <Categorias />;
      case "/ofertas":
        return <Ofertas />;
      case "/carrito":
        return <Carrito />;
      case "/checkout":
        return <Checkout />;
      case "/exito":
        return <Exito />;
      case "/fallo":
        return <Fallo />;
      default:
        return <Inicio />;
    }
  };
  const [current, setCurrent] = React.useState(window.Router.current());
  React.useEffect(() => {
    const onHash = () => setCurrent(window.Router.current());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return (
    <>
      <Navbar />
      {route(current)}
      <Footer />
    </>
  );
}
