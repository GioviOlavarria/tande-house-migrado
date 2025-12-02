function Registro() {
    const [f, setF] = React.useState({
        nombre: "",
        email: "",
        password: "",
        admin: false,
        adminCode: "",
    });
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setF((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await window.Auth.register(f);
            setLoading(false);
            location.hash = "#/";
        } catch (err) {
            setLoading(false);
            setError(err.message || "Error al registrarse");
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 520 }}>
            <h3 className="mb-3">Crear cuenta</h3>
            <form className="row g-3" onSubmit={onSubmit}>
                <div className="col-12">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={f.nombre}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="col-12">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={f.email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="col-12">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={f.password}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="col-12 form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="adminCheck"
                        name="admin"
                        checked={f.admin}
                        onChange={onChange}
                    />
                    <label className="form-check-label" htmlFor="adminCheck">
                        Cuenta administrador
                    </label>
                </div>
                {f.admin && (
                    <div className="col-12">
                        <label className="form-label">Código administrador</label>
                        <input
                            type="password"
                            className="form-control"
                            name="adminCode"
                            value={f.adminCode}
                            onChange={onChange}
                            placeholder="Ingresa el código secreto"
                            required
                        />
                    </div>
                )}
                {error && (
                    <div className="col-12">
                        <div className="alert alert-danger">{error}</div>
                    </div>
                )}
                <div className="col-12 d-flex gap-2">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Creando..." : "Registrarme"}
                    </button>
                    <a className="btn btn-outline-secondary" href="#/">
                        Cancelar
                    </a>
                </div>
            </form>
        </div>
    );
}
