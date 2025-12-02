function Login() {
    const [f, setF] = React.useState({ email: "", password: "" });
    const [error, setError] = React.useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await window.Auth.login(f.email, f.password);
            location.hash = "#/";
        } catch (err) {
            setError(err.message || "Error al iniciar sesión");
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 520 }}>
            <h3 className="mb-3">Iniciar sesión</h3>
            <form className="row g-3" onSubmit={onSubmit}>
                {/* Campos email / password como ya los tienes */}
                {error && <div className="alert alert-danger">{error}</div>}
            </form>
        </div>
    );
}
