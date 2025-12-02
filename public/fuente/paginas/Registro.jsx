function Registro() {
    const [f, setF] = React.useState({ nombre: "", email: "", password: "" });
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

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
                        value={f.nombre}
                        onChange={(e) => setF({ ...f, nombre: e.target.value })}
                        required
                    />
                </div>
                <div className="col-12">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={f.email}
                        onChange={(e) => setF({ ...f, email: e.target.value })}
                        required
                    />
                </div>
                <div className="col-12">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={f.password}
                        onChange={(e) => setF({ ...f, password: e.target.value })}
                        required
                    />
                </div>
                {error && (
                    <div className="col-12">
                        <div className="alert alert-danger">{error}</div>
                    </div>
                )}
                <div className="col-12 d-flex gap-2 align-items-center">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Creando..." : "Crear cuenta"}
                    </button>
                    <a className="btn btn-outline-secondary" href="#/">
                        Cancelar
                    </a>
                </div>
            </form>
        </div>
    );
}
