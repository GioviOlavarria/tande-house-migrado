function Navbar() {
    const sum = (arr) => arr.reduce((a, b) => a + b.qty, 0);

    const [cartCount, setCartCount] = React.useState(
        sum(window.Store.getState().cart || [])
    );
    const [user, setUser] = React.useState(window.Auth.getUser());

    React.useEffect(() => {
        const unsubscribe = window.Store.subscribe((e) => {
            if (e.type === "cart:changed") {
                setCartCount(sum(e.payload || []));
            }
            if (e.type === "auth:changed") {
                setUser(e.payload);
            }
        });
        return unsubscribe;
    }, []);

    const isAdmin = user && user.admin;

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <a
                    className="navbar-brand d-flex align-items-center gap-2"
                    href="#/"
                >
                    <img src="assets/logo.png" alt="" width="28" height="28" />
                    <span>TandeHouse</span>
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#nav"
                    aria-controls="nav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="nav">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        <li className="nav-item">
                            <a className="nav-link" href="#/productos">
                                Productos
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#/categorias">
                                Categorías
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#/ofertas">
                                Ofertas
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#/sobre">
                                Sobre nosotros
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#/blog">
                                Blog
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#/contacto">
                                Contacto
                            </a>
                        </li>
                        {isAdmin && (
                            <li className="nav-item">
                                <a className="nav-link" href="#/admin">
                                    Admin productos
                                </a>
                            </li>
                        )}
                        <li className="nav-item ms-3 me-2">
                            <a className="nav-link position-relative" href="#/carrito">
                                <i className="bi bi-cart3"></i>
                                {cartCount > 0 && (
                                    <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </span>
                                )}
                            </a>
                        </li>
                        {!user && (
                            <li className="nav-item">
                                <a className="nav-link" href="#/login">
                                    <i className="bi bi-person-circle me-1"></i>
                                    Iniciar sesión
                                </a>
                            </li>
                        )}
                        {user && (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#/"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bi bi-person-circle me-1"></i>
                                    {user.nombre || user.email}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                    <span className="dropdown-item-text">
                      {user.email}
                    </span>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    {isAdmin && (
                                        <li>
                                            <a className="dropdown-item" href="#/admin">
                                                Admin productos
                                            </a>
                                        </li>
                                    )}
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() => {
                                                window.Auth.logout();
                                                location.hash = "#/";
                                            }}
                                        >
                                            Cerrar sesión
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
