function Navbar() {
    const [state, setState] = React.useState(() => window.Store.getState());

    React.useEffect(() => {
        const unsub = window.Store.subscribe(() => {
            setState(window.Store.getState());
        });
        return unsub;
    }, []);

    const user = window.Auth.getUser();
    const isAdmin = user && user.admin;
    const cartQty = state.cart.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="#/">
                    TandeHouse
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarMain"
                    aria-controls="navbarMain"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarMain">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        <li className="nav-item me-3">
                            <a className="nav-link position-relative" href="#/carrito">
                                <i className="bi bi-cart3"></i>
                                {cartQty > 0 && (
                                    <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                    {cartQty}
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
                                    id="userDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bi bi-person-circle me-1"></i>
                                    {user.nombre || user.email}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li>
                                        <span className="dropdown-item-text">{user.email}</span>
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
