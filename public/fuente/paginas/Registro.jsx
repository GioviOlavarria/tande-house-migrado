function Registro() {
    const [f, setF] = React.useState({ nombre: "", email: "", password: "" });
    const [error, setError] = React.useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await window.Auth.register(f);
            location.hash = "#/";
        } catch (err) {
            setError(err.message || "Error al registrarse");
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 520 }}>
            <h3 className="mb-3">Crear cuenta</h3>
            <form className="row g-3" onSubmit={onSubmit}>
                {/* Campos nombre / email / password como ya los tienes */}
                {error && <div className="alert alert-danger">{error}</div>}
            </form>
        </div>
    );
}

